import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AvatarSlot } from './shop-data';

export interface SpinRecord { id: number; symbols: string[]; bet: number; win: number }
export interface CasinoStats { totalSpins: number; totalWon: number; biggestWin: number }
interface EconomyState {
  tokens: number;
  owned: string[];
  stats: CasinoStats;
  history: SpinRecord[];
  freeSpinDate: string;
  equipped: Partial<Record<AvatarSlot, string>>;
  rewardClaims: string[];
}
interface EconomyValue extends EconomyState {
  purchase: (id: string, price: number, slot?: AvatarSlot) => boolean;
  startSpin: (bet: number, isFree: boolean) => boolean;
  finishSpin: (symbols: string[], bet: number, win: number, lossPenalty: number) => void;
  equip: (id: string, slot: AvatarSlot) => void;
  claimReward: (claimId: string, amount: number) => void;
  hasFreeSpin: boolean;
}

const initial: EconomyState = {
  tokens: 240, owned: [], stats: { totalSpins: 0, totalWon: 0, biggestWin: 0 },
  history: [], freeSpinDate: '', equipped: {}, rewardClaims: [],
};
const EconomyContext = createContext<EconomyValue | null>(null);

function loadState(): EconomyState {
  try {
    const stored = localStorage.getItem('cardix-economy');
    return stored ? { ...initial, ...JSON.parse(stored) as EconomyState } : initial;
  } catch { return initial; }
}

export function EconomyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EconomyState>(loadState);
  const today = new Date().toISOString().slice(0, 10);
  useEffect(() => localStorage.setItem('cardix-economy', JSON.stringify(state)), [state]);

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
