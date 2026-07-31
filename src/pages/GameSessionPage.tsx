import { useMemo } from 'react';
import { loadGameSession } from '../lib/game-session';
import { ClassicGameRoomPage } from './ClassicGameRoomPage';
import { GameRoomPage } from './GameRoomPage';
import { LocalGameRoomPage } from './LocalGameRoomPage';

export function GameSessionPage({ local = false }: { local?: boolean }) {
  const session = useMemo(loadGameSession, []);
  const isDurak = session.gameId === 'durak' || session.gameId === 'transfer-durak';
  if (isDurak) return local ? <LocalGameRoomPage /> : <GameRoomPage />;
  return <ClassicGameRoomPage session={session} />;
}
