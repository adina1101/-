import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { PlayingCardView as Card } from '../components/PlayingCardView';
import { DeckCover } from '../components/DeckCover';
import { UserAvatar } from '../components/UserAvatar';
import { InvalidMoveDialog } from '../components/InvalidMoveDialog';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import type { TablePair } from '../lib/card-engine';
import {
  applyDurakAction, createMultiplayerDurak, getDurakCardError, type DurakCardError,
} from '../lib/multiplayer-durak-engine';
import { games } from '../lib/games';
import { loadGameSession } from '../lib/game-session';

export function LocalGameRoomPage() {
  const { profile } = useApp();
  const { claimReward } = useEconomy();
  const [, navigate] = useLocation();
  const selectedGame = useMemo(() => {
    const id = loadGameSession().gameId;
    return games.find((game) => game.id === id) ?? games[0];
  }, []);
  const names = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('cardverse-session');
      const count = stored ? (JSON.parse(stored) as { playerCount?: number }).playerCount ?? 2 : 2;
      return Array.from({ length: count }, (_, index) => index === 0 ? profile.nickname : `Игрок ${index + 1}`);
    } catch { return [profile.nickname, 'Игрок 2']; }
  }, [profile.nickname]);
  const [game, setGame] = useState(() => createMultiplayerDurak(names));
  const [hidden, setHidden] = useState(true);
  const [invalidMove, setInvalidMove] = useState<DurakCardError | null>(null);
  const [matchId, setMatchId] = useState(() => crypto.randomUUID());
  const [rewardShown, setRewardShown] = useState(false);
  const [departing, setDeparting] = useState<{ table: TablePair[]; motion: string } | null>(null);
  const actor = game.players[game.actor];
  const allDefended = game.table.length > 0 && game.table.every((pair) => pair.defense);
  const canTake = game.phase === 'defend' && game.table.some((pair) => !pair.defense);
  const canEndBout = game.phase === 'taking' || (game.phase === 'throw' && allDefended);

  const act = (action: Parameters<typeof applyDurakAction>[1]) => {
    const next = applyDurakAction(game, action);
    if (next === game) return;
    if (game.table.length && next.table.length === 0) {
      const motion = game.phase === 'taking'
        ? game.defender === 0 ? 'taking-player' : 'taking-opponent'
        : 'clearing';
      setDeparting({ table: game.table, motion });
      window.setTimeout(() => { setDeparting(null); setHidden(true); }, 520);
    } else {
      setHidden(true);
    }
    setGame(next);
  };
  const playCard = (cardId: string) => {
    const card = actor.hand.find((item) => item.id === cardId);
    if (!card) return;
    const error = getDurakCardError(game, card);
    if (error) {
      setInvalidMove(error);
      return;
    }
    act({ type: 'play', cardId });
  };
  const exit = () => { if (window.confirm('Выйти из партии?')) navigate('/play'); };

  useEffect(() => {
    if (!game.result || game.loserId === undefined || game.loserId === 0) return;
    claimReward(`local-${selectedGame.id}-win:${matchId}`, 10);
    setRewardShown(true);
  }, [claimReward, game.loserId, game.result, matchId]);

  return (
    <div className="local-room">
      <header className="game-toolbar"><button onClick={exit}>×</button><div><strong>{selectedGame.nameRu} · локальная игра</strong><small>Козырь: {game.trump}</small></div><button>?</button></header>
      <section className="local-players">
        {game.players.map((player) => <article className={player.id === game.actor ? 'active' : ''} key={player.id}>
          <UserAvatar nickname={player.name} avatar={player.id === 0 ? profile.avatar : null} />
          <strong>{player.name}</strong><small>{player.hand.length} карт</small>
        </article>)}
      </section>
      <section className={`local-table ${departing?.motion ?? ''}`}>
        <div className="local-trump">
          {game.deck.length > 1 && <DeckCover />}
          {game.deck.length > 0
            ? <div className={game.deck.length > 1 ? 'local-trump-card' : 'local-trump-card deck-empty'}><Card card={game.trumpCard} small disabled /></div>
            : <div className="empty-trump-suit"><span>{game.trump}</span></div>}
          <span>КОЗЫРЬ</span><b>{game.deck.length}</b>
        </div>
        <div className="battle-pairs">{!departing && game.table.length === 0 && <p>{game.message}</p>}{(departing?.table ?? game.table).map((pair) => <div className="battle-pair" key={pair.attack.id}><Card card={pair.attack} small disabled />{pair.defense && <Card card={pair.defense} small disabled />}</div>)}</div>
        <p className="game-message">{game.result ?? game.message}</p>
      </section>
      <section className="durak-actions">
        {!game.result && <>
          <button type="button" disabled={!canTake || hidden} className="action-secondary" onClick={() => act({ type: 'take' })}>Взять</button>
          <button type="button" disabled={!canEndBout || hidden} className="action-secondary" onClick={() => act({ type: 'pass' })}>Пас</button>
          <button type="button" disabled={!canEndBout || hidden} className="action-primary" onClick={() => act({ type: 'pass' })}>Бито</button>
          <small>{hidden ? 'Сначала нажми «Я готов»' : canTake ? 'Можно взять карты' : canEndBout ? 'Подкинь ещё или заверши заход' : 'Выбери подходящую карту'}</small>
        </>}
        {game.result && <>{rewardShown && <strong className="match-token-reward">Победа · +10 жетонов</strong>}
          <button className="action-primary" onClick={() => {
            setGame(createMultiplayerDurak(names)); setMatchId(crypto.randomUUID());
            setRewardShown(false); setHidden(true);
          }}>Новая партия</button></>}
      </section>
      <section className="local-hand"><h3>{actor.name}</h3><div className="player-hand">{actor.hand.map((card) => <Card key={card.id} card={card}
        disabled={hidden} onClick={() => playCard(card.id)} />)}</div></section>
      {hidden && !game.result && <div className="pass-overlay"><div><span>↻</span><h2>Передайте устройство</h2><p>Сейчас ходит <strong>{actor.name}</strong></p><small>Не показывайте свои карты другим игрокам</small><button className="primary-button" onClick={() => setHidden(false)}>Я готов</button></div></div>}
      {invalidMove && <InvalidMoveDialog reason={invalidMove} onClose={() => setInvalidMove(null)} />}
    </div>
  );
}
