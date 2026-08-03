export interface StreakState {
  current: number;
  freezes: number;
  lastPlayedDate: string;
  title: string;
  lastReward: number;
}

export const initialStreak: StreakState = {
  current: 0, freezes: 3, lastPlayedDate: '', title: 'Новичок', lastReward: 0,
};

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(from: string, to: string) {
  const parse = (value: string) => {
    const [year, month, day] = value.split('-').map(Number);
    return Date.UTC(year, month - 1, day);
  };
  return Math.round((parse(to) - parse(from)) / 86_400_000);
}

export interface StreakStatus {
  frozen: boolean;
  expired: boolean;
  missedDays: number;
  freezesNeeded: number;
}

export function getStreakStatus(current: StreakState, today = localDateKey()): StreakStatus {
  if (!current.lastPlayedDate || current.current === 0) {
    return { frozen: false, expired: false, missedDays: 0, freezesNeeded: 0 };
  }
  const gap = Math.max(0, daysBetween(current.lastPlayedDate, today));
  const missedDays = Math.max(0, gap - 1);
  const expired = missedDays > 3 || missedDays > current.freezes;
  return { frozen: missedDays > 0 && !expired, expired, missedDays, freezesNeeded: Math.min(3, missedDays) };
}

export function normalizeStreak(current: StreakState, today = localDateKey()) {
  if (!getStreakStatus(current, today).expired) return current;
  return { ...current, current: 0, lastPlayedDate: '', title: 'Новичок', lastReward: 0 };
}

export function streakTitle(days: number) {
  if (days >= 100) return 'Легенда CARDIX';
  if (days >= 80) return 'Самый главный';
  if (days >= 60) return 'Картёжник';
  if (days >= 40) return 'Просто босс';
  if (days >= 20) return 'Крутой';
  return 'Новичок';
}

export function completeStreakDay(current: StreakState, today = localDateKey()) {
  current = normalizeStreak(current, today);
  if (current.lastPlayedDate === today) return { streak: current, reward: 0, freezesUsed: 0 };
  const gap = current.lastPlayedDate ? daysBetween(current.lastPlayedDate, today) : 1;
  const missedDays = Math.max(0, gap - 1);
  const protectedStreak = gap > 0 && missedDays <= 3 && current.freezes >= missedDays;
  const nextDays = protectedStreak ? current.current + 1 : 1;
  const freezesUsed = protectedStreak ? missedDays : 0;
  const reward = nextDays % 20 === 0 ? nextDays : 0;
  return {
    streak: {
      current: nextDays,
      freezes: current.freezes - freezesUsed,
      lastPlayedDate: today,
      title: streakTitle(nextDays),
      lastReward: reward || current.lastReward,
    },
    reward,
    freezesUsed,
  };
}

export const nextStreakMilestone = (days: number) => Math.max(20, Math.ceil((days + 1) / 20) * 20);
