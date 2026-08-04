import { useMemo } from 'react';
import { loadGameSession } from '../lib/game-session';
import { ClassicGameRoomPage } from './ClassicGameRoomPage';
import { GameRoomPage } from './GameRoomPage';
import { LocalGameRoomPage } from './LocalGameRoomPage';
import { WarGameRoomPage } from './WarGameRoomPage';

export function GameSessionPage({ local = false }: { local?: boolean }) {
  const session = useMemo(loadGameSession, []);
  const isDurak = session.gameId === 'durak' || session.gameId === 'transfer-durak';
  if (isDurak) return local ? <LocalGameRoomPage /> : <GameRoomPage />;
  if (session.gameId === 'war') return <WarGameRoomPage session={session} local={local} />;
  return <ClassicGameRoomPage session={session} />;
}
