import { games } from './games';

export interface GameSession {
  gameId: string;
  mode: 'ai' | 'online' | 'local' | 'tournament' | 'practice';
  playerCount: number;
  deckSize: 36 | 52;
}

export function loadGameSession(): GameSession {
  try {
    const value = sessionStorage.getItem('cardverse-session');
    const saved = value ? JSON.parse(value) as Partial<GameSession> : {};
    return {
      gameId: games.some((game) => game.id === saved.gameId) ? saved.gameId! : 'durak',
      mode: saved.mode ?? 'ai',
      playerCount: Math.min(6, Math.max(1, saved.playerCount ?? 2)),
      deckSize: saved.deckSize === 52 ? 52 : 36,
    };
  } catch {
    return { gameId: 'durak', mode: 'ai', playerCount: 2, deckSize: 36 };
  }
}
