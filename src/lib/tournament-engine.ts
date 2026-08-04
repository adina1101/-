export type TournamentStatus = 'active' | 'awaiting-next' | 'eliminated' | 'champion';
export interface TournamentRound { stage: number; opponent: string; won: boolean }
export interface TournamentState {
  id: string;
  title: string;
  gameId: string;
  stage: number;
  opponents: string[];
  rounds: TournamentRound[];
  status: TournamentStatus;
}
export interface TournamentGameProps {
  tournament?: TournamentState;
  onTournamentComplete?: (won: boolean) => void;
  onTournamentNext?: () => void;
}

const rivals = ['CardBot', 'Nova', 'Rex', 'Luna', 'Max', 'Ace', 'Vega'];

export function createTournament(title: string, gameId: string): TournamentState {
  const shuffled = [...rivals].sort(() => Math.random() - .5);
  const state: TournamentState = {
    id: crypto.randomUUID(), title, gameId, stage: 0,
    opponents: shuffled.slice(0, 3), rounds: [], status: 'active',
  };
  saveTournament(state);
  return state;
}

export function loadTournament(): TournamentState | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem('cardix-tournament');
    return stored ? JSON.parse(stored) as TournamentState : null;
  } catch { return null; }
}

export function saveTournament(state: TournamentState) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('cardix-tournament', JSON.stringify(state));
  }
}

export function completeTournamentRound(state: TournamentState, won: boolean) {
  if (state.status !== 'active' || state.rounds.some((round) => round.stage === state.stage)) return state;
  const final = state.stage === 2;
  const next: TournamentState = {
    ...state,
    rounds: [...state.rounds, { stage: state.stage, opponent: state.opponents[state.stage], won }],
    status: won ? final ? 'champion' : 'awaiting-next' : 'eliminated',
  };
  saveTournament(next);
  return next;
}

export function advanceTournament(state: TournamentState) {
  if (state.status !== 'awaiting-next') return state;
  const next: TournamentState = { ...state, stage: state.stage + 1, status: 'active' };
  saveTournament(next);
  return next;
}

export const tournamentStageName = (stage: number, ru: boolean) =>
  ru ? ['Четвертьфинал', 'Полуфинал', 'Финал'][stage] : ['Quarterfinal', 'Semifinal', 'Final'][stage];

export const tournamentRatingDelta = (won: boolean) => won ? 25 : -18;

export const tournamentTokenReward = (_stage: number, won: boolean) => won ? 10 : 0;
