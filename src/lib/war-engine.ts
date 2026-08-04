import { createDeck, type PlayingCard } from './card-engine.ts';

export interface WarPlayer { id: number; name: string; deck: PlayingCard[] }
export interface WarReveal { playerId: number; card: PlayingCard }
export interface WarGame {
  players: WarPlayer[];
  pot: PlayingCard[];
  table: WarReveal[];
  contenders: number[];
  round: number;
  message: string;
  winnerId?: number;
  result?: string;
}

export function createWarGame(names: string[], random: () => number = Math.random): WarGame {
  if (names.length < 2) throw new Error('War requires at least two players');
  const players = names.map((name, id) => ({ id, name, deck: [] as PlayingCard[] }));
  createDeck(random).forEach((card, index) => players[index % players.length].deck.push(card));
  return { players, pot: [], table: [], contenders: [], round: 0, message: 'Откройте верхние карты' };
}

function winnerResult(game: WarGame, players: WarPlayer[]) {
  const active = players.filter((player) => player.deck.length > 0);
  if (active.length !== 1) return game;
  return { ...game, players, winnerId: active[0].id, result: `${active[0].name} забирает всю колоду!`, message: 'Партия окончена' };
}

export function playWarRound(game: WarGame): WarGame {
  if (game.result) return game;
  const players = game.players.map((player) => ({ ...player, deck: [...player.deck] }));
  const war = game.contenders.length > 0;
  const participantIds = (war ? game.contenders : players.map((player) => player.id))
    .filter((id) => players[id].deck.length > 0);
  if (participantIds.length === 0) return winnerResult(game, players);
  if (war && participantIds.length === 1) {
    const winner = players[participantIds[0]];
    winner.deck.push(...game.pot);
    return winnerResult({
      ...game, players, pot: [], table: [], contenders: [], round: game.round + 1,
      message: `${winner.name} забирает спор: у соперников закончились карты`,
    }, players);
  }
  if (participantIds.length === 1) return winnerResult(game, players);

  const pot = [...game.pot];
  const table: WarReveal[] = [];
  for (const id of participantIds) {
    if (war && players[id].deck.length > 1) pot.push(players[id].deck.shift()!);
    const card = players[id].deck.shift();
    if (card) { pot.push(card); table.push({ playerId: id, card }); }
  }
  if (table.length <= 1) return winnerResult({ ...game, pot, table }, players);

  const best = Math.max(...table.map((item) => item.card.value));
  const leaders = table.filter((item) => item.card.value === best).map((item) => item.playerId);
  if (leaders.length > 1) {
    return {
      ...game, players, pot, table, contenders: leaders, round: game.round + 1,
      message: `Спор между: ${leaders.map((id) => players[id].name).join(', ')}`,
    };
  }

  const winner = players[leaders[0]];
  winner.deck.push(...pot);
  const next = {
    ...game, players, pot: [], table, contenders: [], round: game.round + 1,
    message: `${winner.name} забирает ${pot.length} карт`,
  };
  return winnerResult(next, players);
}
