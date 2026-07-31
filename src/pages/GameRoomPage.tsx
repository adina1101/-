import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { DeckCover } from '../components/DeckCover';
import { PlayingCardView as Card } from '../components/PlayingCardView';
import { UserAvatar } from '../components/UserAvatar';
import { InvalidMoveDialog } from '../components/InvalidMoveDialog';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import type { TablePair } from '../lib/card-engine';
import {
  applyDurakAction, chooseDurakAction, createMultiplayerDurak, getDurakCardError,
  type DurakCardError,
} from '../lib/multiplayer-durak-engine';
import { games } from '../lib/games';

const botNames = ['CardBot', 'Nova', 'Rex', 'Luna', 'Max'];
export function GameRoomPage() {
  const { profile } = useApp();
  const { claimReward } = useEconomy();
  const [, navigate] = useLocation();
  const session = useMemo(() => {
    try {
      const saved = sessionStorage.getItem('cardverse-session');
      return saved ? JSON.parse(saved) as { playerCount?: number } : {};
    } catch { return {}; }
  }, []);
  const playerCount = Math.min(6, Math.max(2, session.playerCount ?? 2));
  const selectedGame = games.find((item) => item.id === (session as { gameId?: string }).gameId) ?? games[0];
  const gameTitle = selectedGame.nameRu;
  const names = useMemo(() => [profile.nickname, ...botNames.slice(0, playerCount - 1)],
    [playerCount, profile.nickname]);
  const [game, setGame] = useState(() => createMultiplayerDurak(names));
  const [paused, setPaused] = useState(false);
  const [invalidMove, setInvalidMove] = useState<DurakCardError | null>(null);
  const [matchId, setMatchId] = useState(() => crypto.randomUUID());
  const [rewardShown, setRewardShown] = useState(false);
  const [departing, setDeparting] = useState<{ table: TablePair[]; motion: string } | null>(null);
  const human = game.players[0];
  const openAttack = game.table.find((pair) => !pair.defense)?.attack;
  const allDefended = game.table.length > 0 && game.table.every((pair) => pair.defense);
  const humanTurn = game.actor === 0;
  const canTake = humanTurn && game.phase === 'defend' && Boolean(openAttack);
  const canPass = humanTurn && (game.phase === 'taking' || (game.phase === 'throw' && allDefended));

  useEffect(() => {
    if (paused || departing || game.result || game.actor === 0) return;
    const timer = window.setTimeout(() => {
      const action = chooseDurakAction(game);
      if (action) commitAction(action);
    }, 520);
    return () => window.clearTimeout(timer);
  }, [departing, game, paused]);

  useEffect(() => {
    if (!game.result || game.loserId === undefined || game.loserId === 0) return;
    claimReward(`${selectedGame.id}-win:${matchId}`, 10);
    setRewardShown(true);
  }, [claimReward, game.loserId, game.result, matchId]);

  const commitAction = (action: Parameters<typeof applyDurakAction>[1]) => {
    const next = applyDurakAction(game, action);
    if (next === game) return false;
    if (game.table.length && next.table.length === 0) {
      const motion = game.phase === 'taking'
        ? game.defender === 0 ? 'taking-player' : 'taking-opponent'
        : 'clearing';
      setDeparting({ table: game.table, motion });
      window.setTimeout(() => setDeparting(null), 520);
    }
    setGame(next);
    return true;
  };
  const playHumanCard = (cardId: string) => {
    const card = human.hand.find((item) => item.id === cardId);
    if (!card) return;
    const error = getDurakCardError(game, card);
    if (error) {
      setInvalidMove(error);
      return;
    }
    commitAction({ type: 'play', cardId });
  };
  const restart = () => {
    setGame(createMultiplayerDurak(names)); setMatchId(crypto.randomUUID());
    setRewardShown(false); setPaused(false);
  };
  const exit = () => { if (window.confirm('Выйти из текущей партии?')) navigate('/play'); };
  const role = (id: number) => id === game.attacker ? 'АТАКУЕТ' : id === game.defender ? 'ЗАЩИЩАЕТСЯ' : 'ЖДЁТ';

  return (
    <div className="durak-room">
      <header className="game-toolbar">
        <button onClick={exit}>×</button>
        <div><strong>{gameTitle} · {playerCount} игроков</strong><small>Козырь: {game.trump}</small></div>
        <button onClick={() => setPaused(true)}>Ⅱ</button>
      </header>

      <section className="opponents-row">
        {game.players.slice(1).map((player) => <article className={player.id === game.actor ? 'table-player active' : 'table-player'} key={player.id}>
          <UserAvatar nickname={player.name} avatar={null} className="player-badge" />
          <strong>{player.name}</strong><small>{player.hand.length} карт</small>
          <em>{player.id === game.actor ? 'ХОДИТ · ' : ''}{role(player.id)}</em>
        </article>)}
      </section>

      <section className={`durak-table ${departing?.motion ?? ''}`}>
        <div className="trump-deck">
          {game.deck.length > 1 && <DeckCover />}
          {game.deck.length > 0
            ? <div className={game.deck.length > 1 ? 'trump-card' : 'trump-card deck-empty'}><Card card={game.trumpCard} small disabled /><em>КОЗЫРЬ</em></div>
            : <div className="empty-trump-suit"><span>{game.trump}</span><em>КОЗЫРЬ</em></div>}
          <b>{game.deck.length}</b>
        </div>
        <div className="battle-pairs">
          {!departing && game.table.length === 0 && <p>{game.message}</p>}
          {(departing?.table ?? game.table).map((pair) => <div className="battle-pair" key={pair.attack.id}>
            <Card card={pair.attack} small disabled />{pair.defense && <Card card={pair.defense} small disabled />}
          </div>)}
        </div>
        <p className="game-message">{game.result ?? game.message}</p>
      </section>

      <section className="durak-actions">
        {game.result ? <>{rewardShown && <strong className="match-token-reward">Победа · +10 жетонов</strong>}
          <button className="action-primary" onClick={restart}>Новая партия</button></> : <>
          <button type="button" disabled={!canTake || Boolean(departing)} className="action-secondary" onClick={() => commitAction({ type: 'take' })}>Взять</button>
          <button type="button" disabled={!canPass || Boolean(departing)} className="action-secondary" onClick={() => commitAction({ type: 'pass' })}>Пас</button>
          <button type="button" disabled={!canPass || Boolean(departing)} className="action-primary" onClick={() => commitAction({ type: 'pass' })}>Бито</button>
          <small>{humanTurn ? game.phase === 'defend' ? 'Отбей карту или возьми' : 'Подкинь подходящую карту или нажми «Пас»' : `Сейчас ходит ${game.players[game.actor].name}`}</small>
        </>}
      </section>

      <section className="durak-player">
        <div className={humanTurn ? 'player-caption active' : 'player-caption'}>
          <UserAvatar nickname={profile.nickname} avatar={profile.avatar} className="player-badge" />
          <div><strong>{profile.nickname}</strong><small>{human.hand.length} карт · {role(0)}</small></div>
        </div>
        <div className="player-hand">{human.hand.map((card) => <Card key={card.id} card={card}
          disabled={!humanTurn || Boolean(departing)}
          onClick={() => playHumanCard(card.id)} />)}</div>
      </section>

      {paused && <div className="pause-overlay"><div className="pause-card">
        <span>Ⅱ</span><h2>Пауза</h2><p>Партия остановлена</p>
        <button className="primary-button" onClick={() => setPaused(false)}>Продолжить</button>
        <button onClick={restart}>Начать заново</button><button className="danger-text" onClick={exit}>Выйти из игры</button>
      </div></div>}
      {invalidMove && <InvalidMoveDialog reason={invalidMove} onClose={() => setInvalidMove(null)} />}
    </div>
  );
}
