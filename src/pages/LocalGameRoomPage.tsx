import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { PlayingCardView as Card } from '../components/PlayingCardView';
import { DeckCover } from '../components/DeckCover';
import { InvalidMoveDialog } from '../components/InvalidMoveDialog';
import { MatchStreakStatus } from '../components/MatchStreakStatus';
import { TransferChoiceDialog } from '../components/TransferChoiceDialog';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import type { PlayingCard, TablePair } from '../lib/card-engine';
import {
  applyDurakAction, createMultiplayerDurak, getDefenderCardOptions, getDurakActionAvailability, getDurakCardError, type DurakCardError,
} from '../lib/multiplayer-durak-engine';
import { games } from '../lib/games';
import { loadGameSession } from '../lib/game-session';

export function LocalGameRoomPage() {
  const { profile } = useApp();
  const { claimReward, recordGamePlayed } = useEconomy();
  const [, navigate] = useLocation();
  const session = useMemo(loadGameSession, []);
  const selectedGame = useMemo(() => {
    return games.find((game) => game.id === session.gameId) ?? games[0];
  }, [session.gameId]);
  const rules = selectedGame.id === 'transfer-durak' ? 'transfer' : 'throw-in';
  const names = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('cardverse-session');
      const count = stored ? (JSON.parse(stored) as { playerCount?: number }).playerCount ?? 2 : 2;
      return Array.from({ length: count }, (_, index) => index === 0 ? profile.nickname : `Игрок ${index + 1}`);
    } catch { return [profile.nickname, 'Игрок 2']; }
  }, [profile.nickname]);
  const [game, setGame] = useState(() => createMultiplayerDurak(names, Math.random, rules, session.deckSize));
  const [hidden, setHidden] = useState(true);
  const [invalidMove, setInvalidMove] = useState<DurakCardError | null>(null);
  const [matchId, setMatchId] = useState(() => crypto.randomUUID());
  const [rewardShown, setRewardShown] = useState(false);
  const [departing, setDeparting] = useState<{ table: TablePair[]; motion: string } | null>(null);
  const [transferChoice, setTransferChoice] = useState<PlayingCard | null>(null);
  const actor = game.players[game.actor];
  const actions = getDurakActionAvailability(game, game.actor);

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
    if (game.phase === 'defend' && game.rules === 'transfer') {
      const options = getDefenderCardOptions(game, card);
      if (options.canDefend && options.canTransfer) {
        setTransferChoice(card);
        return;
      }
      if (options.canTransfer) {
        act({ type: 'transfer', cardId });
        return;
      }
      act({ type: 'defend', cardId });
      return;
    }
    act({ type: 'play', cardId });
  };
  const exit = () => { if (window.confirm('Выйти из партии?')) navigate('/play'); };

  useEffect(() => {
    if (!game.result) return;
    recordGamePlayed(`local-${selectedGame.id}:${matchId}`);
    if (game.loserId !== undefined && game.loserId !== 0) {
      claimReward(`local-${selectedGame.id}-win:${matchId}`, 10);
      setRewardShown(true);
    }
  }, [claimReward, game.loserId, game.result, matchId, recordGamePlayed, selectedGame.id]);

  return (
    <div className="local-room">
      <header className="game-toolbar"><button onClick={exit}>×</button><div><strong>{selectedGame.nameRu} · локальная игра</strong><small>{session.deckSize} карт · козырь: {game.trump}</small></div><button>?</button></header>
      <section className="local-players">
        {game.players.map((player) => <article className={player.id === game.actor ? 'active' : ''} key={player.id}>
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
          <button type="button" disabled={!actions.canTake || hidden} className="action-secondary" onClick={() => act({ type: 'take' })}>Взять</button>
          <button type="button" disabled={!actions.canPass || hidden} className="action-secondary" onClick={() => act({ type: 'pass' })}>Пас</button>
          <button type="button" disabled={!actions.canFinishBout || hidden} className="action-primary" onClick={() => act({ type: 'pass' })}>Бито</button>
          <small>{hidden ? 'Сначала нажми «Я готов»' : actions.canTake ? 'Можно взять карты' : actions.canFinishBout ? 'Все карты отбиты — нажми «Бито»' : actions.canPass ? 'Подкинь карту или нажми «Пас»' : 'Выбери подходящую карту'}</small>
        </>}
        {game.result && <><MatchStreakStatus />{rewardShown && <strong className="match-token-reward">Победа · +10 жетонов</strong>}
          <button className="action-primary" onClick={() => {
            setGame(createMultiplayerDurak(names, Math.random, rules, session.deckSize)); setMatchId(crypto.randomUUID());
            setRewardShown(false); setHidden(true);
          }}>Новая партия</button></>}
      </section>
      <section className="local-hand"><h3>{actor.name}</h3><div className="player-hand">{actor.hand.map((card) => <Card key={card.id} card={card}
        disabled={hidden} onClick={() => playCard(card.id)} />)}</div></section>
      {hidden && !game.result && <div className="pass-overlay"><div><span>↻</span><h2>Передайте устройство</h2><p>Сейчас ходит <strong>{actor.name}</strong></p><small>Не показывайте свои карты другим игрокам</small><button className="primary-button" onClick={() => setHidden(false)}>Я готов</button></div></div>}
      {invalidMove && <InvalidMoveDialog reason={invalidMove} onClose={() => setInvalidMove(null)} />}
      {transferChoice && <TransferChoiceDialog card={transferChoice} onCancel={() => setTransferChoice(null)}
        onDefend={() => { act({ type: 'defend', cardId: transferChoice.id }); setTransferChoice(null); }}
        onTransfer={() => { act({ type: 'transfer', cardId: transferChoice.id }); setTransferChoice(null); }} />}
    </div>
  );
}
