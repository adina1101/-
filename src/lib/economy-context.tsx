import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ShopSlot } from './shop-data';
import { useAuth } from './auth-context';
import { loadCloudEconomy, saveCloudEconomy } from './economy-storage';
import { completeStreakDay, initialStreak, localDateKey, type StreakState } from './streak';
import { useOnlineStatus } from './online-status';

export interface SpinRecord { id: number; symbols: string[]; bet: number; win: number }
export interface CasinoStats { totalSpins: number; totalWon: number; biggestWin: number }
export interface EconomyState {
  tokens: number;
  owned: string[];
  stats: CasinoStats;
  history: SpinRecord[];
  freeSpinDate: string;
  equipped: Partial<Record<ShopSlot, string>>;
  rewardClaims: string[];
  completedGameClaims: string[];
  streak: StreakState;
}
interface EconomyValue extends EconomyState {
  purchase: (id: string, price: number, slot?: ShopSlot) => boolean;
  startSpin: (bet: number, isFree: boolean) => boolean;
  finishSpin: (symbols: string[], bet: number, win: number, lossPenalty: number) => void;
  equip: (id: string, slot: ShopSlot) => void;
  claimReward: (claimId: string, amount: number) => void;
  recordGamePlayed: (matchId: string) => void;
  buyFreeze: () => boolean;
  hasFreeSpin: boolean;
}

const initial: EconomyState = {
  tokens: 240, owned: [], stats: { totalSpins: 0, totalWon: 0, biggestWin: 0 },
  history: [], freeSpinDate: '', equipped: {}, rewardClaims: [], completedGameClaims: [],
  streak: initialStreak,
};
const EconomyContext = createContext<EconomyValue | null>(null);

function loadState(): EconomyState {
  try {
    const stored = localStorage.getItem('cardix-economy');
    const saved = stored ? JSON.parse(stored) as Partial<EconomyState> : {};
    return { ...initial, ...saved, streak: { ...initialStreak, ...saved.streak } };
  } catch { return initial; }
}

export function EconomyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const online = useOnlineStatus();
  const [state, setState] = useState<EconomyState>(loadState);
  const [cloudReady, setCloudReady] = useState(false);
  const today = localDateKey();
  useEffect(() => {
    localStorage.setItem('cardix-economy', JSON.stringify(state));
    if (!online) localStorage.setItem('cardix-economy-dirty', '1');
  }, [online, state]);

  useEffect(() => {
    if (!user || !online) { setCloudReady(false); return; }
    let active = true;
    setCloudReady(false);
    const dirty = localStorage.getItem('cardix-economy-dirty') === '1';
    if (dirty) {
      void saveCloudEconomy(user.id, state).then((saved) => {
        if (!active) return;
        if (saved) localStorage.removeItem('cardix-economy-dirty');
        setCloudReady(saved);
      });
      return () => { active = false; };
    }
    void loadCloudEconomy(user.id).then((saved) => {
      if (!active) return;
      if (saved) setState((current) => ({
        ...current, ...saved, streak: { ...initialStreak, ...saved.streak },
      }));
      else void saveCloudEconomy(user.id, state);
      setCloudReady(true);
    });
    return () => { active = false; };
  }, [online, user?.id]);

  useEffect(() => {
    if (!user || !online || !cloudReady) return;
    const timer = window.setTimeout(() => void saveCloudEconomy(user.id, state).then((saved) => {
      if (saved) localStorage.removeItem('cardix-economy-dirty');
      else localStorage.setItem('cardix-economy-dirty', '1');
    }), 350);
    return () => window.clearTimeout(timer);
  }, [cloudReady, online, state, user]);

  const value = useMemo<EconomyValue>(() => ({
    ...state,
    hasFreeSpin: state.freeSpinDate !== today,
    purchase: (id, price, slot) => {
      if (state.tokens < price || state.owned.includes(id)) return false;
      setState((current) => ({
        ...current, tokens: current.tokens - price, owned: [...current.owned, id],
        equipped: slot ? { ...current.equipped, [slot]: id } : current.equipped,
      }));
      return true;
    },
    equip: (id, slot) => {
      if (!state.owned.includes(id)) return;
      setState((current) => ({
        ...current,
        equipped: { ...current.equipped, [slot]: current.equipped[slot] === id ? undefined : id },
      }));
    },
    claimReward: (claimId, amount) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      setState((current) => current.rewardClaims.includes(claimId) ? current : ({
        ...current,
        tokens: current.tokens + Math.floor(amount),
        rewardClaims: [...current.rewardClaims, claimId].slice(-100),
      }));
    },
    recordGamePlayed: (matchId) => setState((current) => {
      if (current.completedGameClaims.includes(matchId)) return current;
      const update = completeStreakDay(current.streak, today);
      return {
        ...current,
        tokens: current.tokens + update.reward,
        streak: update.streak,
        completedGameClaims: [...current.completedGameClaims, matchId].slice(-200),
      };
    }),
    buyFreeze: () => {
      if (state.tokens < 25) return false;
      setState((current) => current.tokens < 25 ? current : ({
        ...current, tokens: current.tokens - 25,
        streak: { ...current.streak, freezes: current.streak.freezes + 1 },
      }));
      return true;
    },
    startSpin: (bet, isFree) => {
      if (!isFree && state.tokens < bet * 2) return false;
      if (isFree && state.freeSpinDate === today) return false;
      setState((current) => ({
        ...current,
        tokens: current.tokens - (isFree ? 0 : bet),
        freeSpinDate: isFree ? today : current.freeSpinDate,
      }));
      return true;
    },
    finishSpin: (symbols, bet, win, lossPenalty) => {
      setState((current) => ({
        ...current, tokens: current.tokens + win - lossPenalty,
        stats: {
          totalSpins: current.stats.totalSpins + 1,
          totalWon: current.stats.totalWon + win,
          biggestWin: Math.max(current.stats.biggestWin, win),
        },
        history: [{ id: Date.now(), symbols, bet, win }, ...current.history].slice(0, 12),
      }));
    },
  }), [state, today]);
  return <EconomyContext.Provider value={value}>{children}</EconomyContext.Provider>;
}

export function useEconomy() {
  const value = useContext(EconomyContext);
  if (!value) throw new Error('useEconomy must be used inside EconomyProvider');
  return value;
}
