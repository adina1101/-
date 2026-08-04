import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { DeckCover } from '../components/DeckCover';
import { MatchStreakStatus } from '../components/MatchStreakStatus';
import { PlayingCardView } from '../components/PlayingCardView';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import type { GameSession } from '../lib/game-session';
import { createWarGame, playWarRound } from '../lib/war-engine';

const botNames = ['CardBot', 'Nova', 'Rex'];

export function WarGameRoomPage({ session, local }: { session: GameSession; local: boolean }) {
  const { profile, language } = useApp();
  const { claimReward, recordGamePlayed } = useEconomy();
  const [, navigate] = useLocation();
  const count = Math.min(4, Math.max(2, session.playerCount));
  const names = useMemo(() => Array.from({ length: count }, (_, index) => index === 0
    ? profile.nickname : local ? `Игрок ${index + 1}` : botNames[index - 1]), [count, local, profile.nickname]);
  const [game, setGame] = useState(() => createWarGame(names));
  const [matchId, setMatchId] = useState(() => crypto.randomUUID());
  const [rewardShown, setRewardShown] = useState(false);
  const ru = language === 'ru';

  useEffect(() => {
    if (!game.result) return;
    recordGamePlayed(`war:${matchId}`);
    if (session.mode !== 'practice' && game.winnerId === 0) {
      claimReward(`war-win:${matchId}`, 10); setRewardShown(true);
    }
  }, [claimReward, game.result, game.winnerId, matchId, recordGamePlayed, session.mode]);

  const restart = () => {
    setGame(createWarGame(names)); setMatchId(crypto.randomUUID()); setRewardShown(false);
  };

  return <div className="war-room">
    <header className="game-toolbar"><button onClick={() => navigate('/play')}>×</button>
      <div><strong>{ru ? 'Пьяница' : 'War'} · {count}</strong><small>{ru ? `Раунд ${game.round}` : `Round ${game.round}`}</small></div>
      <button onClick={restart}>↻</button></header>
    <section className="war-players">{game.players.map((player) => <article key={player.id}>
      <div className="war-pile">{player.deck.length > 0 && <DeckCover />}<b>{player.deck.length}</b></div>
      <strong>{player.name}</strong><small>{ru ? 'Закрытая стопка' : 'Face-down pile'}</small>
    </article>)}</section>
    <section className={game.contenders.length ? 'war-table dispute' : 'war-table'}>
      <div className="war-cards">{game.table.map((item) => <div key={item.playerId}>
        <small>{game.players[item.playerId].name}</small><PlayingCardView card={item.card} small disabled />
      </div>)}</div>
      <p>{game.result ?? game.message}</p>
      {game.contenders.length > 0 && <strong className="war-label">{ru ? `СПОР · в банке ${game.pot.length}` : `WAR · ${game.pot.length} in pot`}</strong>}
    </section>
    <section className="war-actions">{game.result ? <><MatchStreakStatus />
      {rewardShown && <strong className="match-token-reward">{ru ? 'Победа · +10 жетонов' : 'Win · +10 tokens'}</strong>}
      <button className="action-primary" onClick={restart}>{ru ? 'Новая партия' : 'New game'}</button></>
      : <button className="action-primary" onClick={() => setGame((current) => playWarRound(current))}>
        {game.contenders.length ? (ru ? 'Продолжить спор' : 'Continue war') : (ru ? 'Открыть по одной карте' : 'Reveal one card each')}
      </button>}</section>
  </div>;
}
