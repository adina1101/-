import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { PlayingCardView as Card } from '../components/PlayingCardView';
import { MatchStreakStatus } from '../components/MatchStreakStatus';
import { createDeck, type PlayingCard } from '../lib/card-engine';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { games } from '../lib/games';
import type { GameSession } from '../lib/game-session';

interface RoundState {
  deck: PlayingCard[]; hands: PlayingCard[][]; scores: number[];
  table: PlayingCard[]; message: string; result: string | null;
}

const botNames = ['Nova', 'Rex', 'Luna', 'Max', 'CardBot'];

function deal(deck: PlayingCard[], count: number, amount: number) {
  const next = [...deck];
  const hands = Array.from({ length: count }, () => [] as PlayingCard[]);
  for (let round = 0; round < amount; round += 1) {
    hands.forEach((hand) => { const card = next.pop(); if (card) hand.push(card); });
  }
  return { deck: next, hands };
}

function createRound(count: number): RoundState {
  const dealt = deal(createDeck(), count, 5);
  return { ...dealt, scores: Array(count).fill(0), table: [], message: 'Выберите карту', result: null };
}

export function ClassicGameRoomPage({ session }: { session: GameSession }) {
  const { profile, language } = useApp();
  const { claimReward, recordGamePlayed } = useEconomy();
  const [, navigate] = useLocation();
  const selected = games.find((game) => game.id === session.gameId) ?? games[0];
  const title = language === 'ru' ? selected.nameRu : selected.nameEn;
  const names = useMemo(() => [profile.nickname, ...botNames.slice(0, session.playerCount - 1)],
    [profile.nickname, session.playerCount]);
  const [state, setState] = useState(() => createRound(session.playerCount));
  const [resolving, setResolving] = useState(false);
  const [matchId, setMatchId] = useState(() => crypto.randomUUID());

  const play = (cardId: string) => {
    if (resolving || state.result) return;
    const humanCard = state.hands[0].find((card) => card.id === cardId);
    if (!humanCard) return;
    const hands = state.hands.map((hand) => [...hand]);
    hands[0] = hands[0].filter((card) => card.id !== cardId);
    const table = [humanCard];
    for (let index = 1; index < hands.length; index += 1) {
      const card = [...hands[index]].sort((a, b) => b.value - a.value)[0];
      table.push(card);
      hands[index] = hands[index].filter((item) => item.id !== card.id);
    }
    const best = Math.max(...table.map((card) => card.value));
    const winner = table.findIndex((card) => card.value === best);
    const scores = [...state.scores];
    scores[winner] += 1;
    setState({ ...state, hands, table, scores, message: `${names[winner]} забирает раунд`, result: null });
    setResolving(true);
  };

  useEffect(() => {
    if (!resolving) return;
    const timer = window.setTimeout(() => {
      setState((current) => {
        if (current.hands.some((hand) => hand.length > 0)) return { ...current, table: [], message: 'Выберите карту' };
        const amount = Math.min(5, Math.floor(current.deck.length / session.playerCount));
        if (amount > 0) {
          const dealt = deal(current.deck, session.playerCount, amount);
          return { ...current, ...dealt, table: [], message: 'Новый раунд' };
        }
        const best = Math.max(...current.scores);
        const winners = current.scores.map((score, index) => score === best ? names[index] : '').filter(Boolean);
        return { ...current, table: [], result: `Победитель: ${winners.join(', ')}`, message: '' };
      });
      setResolving(false);
    }, 850);
    return () => window.clearTimeout(timer);
  }, [names, resolving, session.playerCount]);

  useEffect(() => {
    if (!state.result) return;
    recordGamePlayed(`${session.gameId}:${matchId}`);
    if (state.scores[0] === Math.max(...state.scores)) claimReward(`${session.gameId}-win:${matchId}`, 10);
  }, [claimReward, matchId, recordGamePlayed, session.gameId, state.result, state.scores]);

  const restart = () => { setState(createRound(session.playerCount)); setMatchId(crypto.randomUUID()); };
  return <div className="durak-room">
    <header className="game-toolbar"><button onClick={() => navigate('/play')}>×</button>
      <div><strong>{title} · {session.playerCount} игроков</strong><small>Отдельная партия</small></div><button>?</button>
    </header>
    <section className="opponents-row">{names.slice(1).map((name, index) => <article className="table-player" key={name}>
      <strong>{name}</strong>
      <small>{state.hands[index + 1].length} карт</small><em>{state.scores[index + 1]} очк.</em>
    </article>)}</section>
    <section className="durak-table">
      <div className="battle-pairs">{state.table.length
        ? state.table.map((card, index) => <div className="battle-pair" key={card.id}><small>{names[index]}</small><Card card={card} small disabled /></div>)
        : <p>{state.result ?? state.message}</p>}</div>
      <p className="game-message">{state.result ?? state.message}</p>
    </section>
    <section className="durak-actions">{state.result
      ? <><MatchStreakStatus /><strong className="match-token-reward">{state.result}{state.scores[0] === Math.max(...state.scores) ? ' · +10 жетонов' : ''}</strong><button className="action-primary" onClick={restart}>Новая партия</button></>
      : <small>{resolving ? 'Карты на столе…' : 'Нажмите любую карту, чтобы сделать ход'}</small>}</section>
    <section className="durak-player"><div className="player-caption active">
      <div><strong>{profile.nickname}</strong><small>{state.scores[0]} очк.</small></div></div>
      <div className="player-hand">{state.hands[0].map((card) => <Card key={card.id} card={card} disabled={resolving} onClick={() => play(card.id)} />)}</div>
    </section>
  </div>;
}
