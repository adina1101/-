import { useCallback, useMemo, useState } from 'react';
import { useEconomy } from '../lib/economy-context';
import { loadGameSession } from '../lib/game-session';
import {
  advanceTournament, completeTournamentRound, createTournament, loadTournament,
} from '../lib/tournament-engine';
import { ClassicGameRoomPage } from './ClassicGameRoomPage';
import { GameRoomPage } from './GameRoomPage';
import { LocalGameRoomPage } from './LocalGameRoomPage';
import { WarGameRoomPage } from './WarGameRoomPage';

export function GameSessionPage({ local = false }: { local?: boolean }) {
  const session = useMemo(loadGameSession, []);
  const { recordTournamentResult } = useEconomy();
  const [tournament, setTournament] = useState(() => session.mode === 'tournament'
    ? loadTournament() ?? createTournament(session.choice || 'CARDIX Cup', session.gameId) : null);
  const complete = useCallback((won: boolean) => {
    if (!tournament || tournament.status !== 'active') return;
    recordTournamentResult(`${tournament.id}:${tournament.stage}`, won);
    setTournament(completeTournamentRound(tournament, won));
  }, [recordTournamentResult, tournament]);
  const next = useCallback(() => {
    setTournament((current) => current ? advanceTournament(current) : current);
  }, []);
  const tournamentProps = tournament ? { tournament, onTournamentComplete: complete, onTournamentNext: next } : {};
  const roomKey = tournament ? `${tournament.id}:${tournament.stage}` : session.gameId;
  const isDurak = session.gameId === 'durak' || session.gameId === 'transfer-durak';
  if (isDurak) return local ? <LocalGameRoomPage /> : <GameRoomPage key={roomKey} {...tournamentProps} />;
  if (session.gameId === 'war') return <WarGameRoomPage key={roomKey} session={session} local={local} {...tournamentProps} />;
  return <ClassicGameRoomPage key={roomKey} session={session} {...tournamentProps} />;
}
