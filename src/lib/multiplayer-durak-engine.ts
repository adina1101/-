import { canBeat, canThrow, createDeck, type PlayingCard, type TablePair } from './card-engine.ts';

export interface DurakPlayer { id: number; name: string; hand: PlayingCard[] }
export type DurakPhase = 'attack' | 'defend' | 'throw' | 'taking';
export type DurakAction =
  | { type: 'play'; cardId: string }
  | { type: 'take' }
  | { type: 'pass' };
export type DurakCardError = 'finished' | 'no-attack' | 'cannot-beat' | 'wait-defense' | 'attack-limit' | 'rank-mismatch';

export interface MultiplayerDurak {
  players: DurakPlayer[];
  deck: PlayingCard[];
  discarded: PlayingCard[];
  trump: PlayingCard['suit'];
  trumpCard: PlayingCard;
  table: TablePair[];
  attacker: number;
  defender: number;
  actor: number;
  phase: DurakPhase;
  defenderStartCards: number;
  passed: number[];
  message: string;
  result?: string;
  loserId?: number;
}

export const activePlayerIds = (game: MultiplayerDurak) =>
  game.players.filter((player) => player.hand.length > 0).map((player) => player.id);

function nextPlayer(players: DurakPlayer[], from: number, excluded: number[] = []) {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const id = (from + offset) % players.length;
    if (players[id].hand.length > 0 && !excluded.includes(id)) return id;
  }
  return from;
}

function firstThrower(game: MultiplayerDurak) {
  if (game.players[game.attacker].hand.length > 0 && game.attacker !== game.defender) return game.attacker;
  return nextPlayer(game.players, game.attacker, [game.defender]);
}

export function createMultiplayerDurak(names: string[], random: () => number = Math.random): MultiplayerDurak {
  if (names.length < 2 || names.length > 6) throw new Error('Durak supports 2–6 players');
  const deck = createDeck(random);
  const trumpCard = deck[0];
  const players = names.map((name, id) => ({
    id, name, hand: Array.from({ length: 6 }, () => deck.pop()!),
  }));
  const lowestTrump = players.flatMap((player) => player.hand
    .filter((card) => card.suit === trumpCard.suit)
    .map((card) => ({ id: player.id, value: card.value })))
    .sort((a, b) => a.value - b.value)[0];
  const attacker = lowestTrump?.id ?? 0;
  const defender = nextPlayer(players, attacker);
  return {
    players, deck, discarded: [], trump: trumpCard.suit, trumpCard, table: [],
    attacker, defender, actor: attacker, phase: 'attack',
    defenderStartCards: players[defender].hand.length, passed: [],
    message: `${players[attacker].name} атакует ${players[defender].name}`,
  };
}

export function getDurakCardError(game: MultiplayerDurak, card: PlayingCard): DurakCardError | null {
  if (game.result) return 'finished';
  if (game.phase === 'defend') {
    const openAttacks = game.table.filter((pair) => !pair.defense).map((pair) => pair.attack);
    if (!openAttacks.length) return 'no-attack';
    return openAttacks.some((attack) => canBeat(attack, card, game.trump)) ? null : 'cannot-beat';
  }
  if (game.phase !== 'taking' && game.table.some((pair) => !pair.defense)) return 'wait-defense';
  if (game.table.length >= Math.min(6, game.defenderStartCards)) return 'attack-limit';
  if (!canThrow(card, game.table)) return 'rank-mismatch';
  return null;
}

export const canPlayDurakCard = (game: MultiplayerDurak, card: PlayingCard) =>
  getDurakCardError(game, card) === null;

function playCard(game: MultiplayerDurak, cardId: string): MultiplayerDurak {
  const current = game.players[game.actor];
  const card = current.hand.find((item) => item.id === cardId);
  if (!card || !canPlayDurakCard(game, card)) return game;
  const players = game.players.map((player) => ({ ...player, hand: [...player.hand] }));
  players[game.actor].hand = players[game.actor].hand.filter((item) => item.id !== card.id);
  if (game.phase !== 'defend') {
    return {
      ...game, players, table: [...game.table, { attack: card }],
      actor: game.phase === 'taking' ? game.actor : game.defender,
      phase: game.phase === 'taking' ? 'taking' : 'defend', passed: [],
      message: game.phase === 'taking'
        ? `${current.name} подкинул карту`
        : `${players[game.defender].name} защищается от ${current.name}`,
    };
  }
  const open = game.table.find((pair) => !pair.defense && canBeat(pair.attack, card, game.trump));
  return {
    ...game, players,
    table: game.table.map((pair) => pair === open ? { ...pair, defense: card } : pair),
    actor: firstThrower({ ...game, players }), phase: 'throw', passed: [],
    message: 'Карта отбита — остальные игроки могут подкинуть',
  };
}

function refill(game: MultiplayerDurak, players: DurakPlayer[], deck: PlayingCard[]) {
  const result = players.map((player) => ({ ...player, hand: [...player.hand] }));
  const order = Array.from({ length: result.length }, (_, offset) => (game.attacker + offset) % result.length)
    .filter((id) => id !== game.defender);
  order.push(game.defender);
  for (const id of order) while (result[id].hand.length < 6 && deck.length) result[id].hand.push(deck.pop()!);
  return result;
}

function finishBout(game: MultiplayerDurak, defenderTakes: boolean): MultiplayerDurak {
  const tableCards = game.table.flatMap((pair) => pair.defense ? [pair.attack, pair.defense] : [pair.attack]);
  const deck = [...game.deck];
  let players = game.players.map((player) => ({ ...player, hand: [...player.hand] }));
  if (defenderTakes) players[game.defender].hand.push(...tableCards);
  players = refill(game, players, deck);
  const nextAttacker = defenderTakes
    ? nextPlayer(players, game.defender)
    : players[game.defender].hand.length ? game.defender : nextPlayer(players, game.defender);
  const nextDefender = nextPlayer(players, nextAttacker);
  const active = players.filter((player) => player.hand.length > 0);
  const result = deck.length === 0 && active.length <= 1
    ? active.length ? `${active[0].name} остаётся в дураках` : 'Ничья' : undefined;
  const loserId = result && active.length === 1 ? active[0].id : undefined;
  return {
    ...game, players, deck,
    discarded: defenderTakes ? game.discarded : [...game.discarded, ...tableCards],
    table: [], attacker: nextAttacker, defender: nextDefender, actor: nextAttacker,
    phase: 'attack', defenderStartCards: players[nextDefender].hand.length, passed: [], result,
    message: result ?? `${players[nextAttacker].name} атакует ${players[nextDefender].name}`, loserId,
  };
}

function passAttack(game: MultiplayerDurak) {
  if (game.phase !== 'throw' && game.phase !== 'taking') return game;
  const passed = [...new Set([...game.passed, game.actor])];
  let next = nextPlayer(game.players, game.actor, [game.defender, ...passed]);
  if (next === game.actor || passed.length >= activePlayerIds(game).filter((id) => id !== game.defender).length) {
    return finishBout({ ...game, passed }, game.phase === 'taking');
  }
  return { ...game, actor: next, passed, message: `${game.players[next].name}: подкинуть или пас` };
}

export function applyDurakAction(game: MultiplayerDurak, action: DurakAction): MultiplayerDurak {
  if (game.result) return game;
  if (action.type === 'play') return playCard(game, action.cardId);
  if (action.type === 'take' && game.phase === 'defend' && game.actor === game.defender) {
    const actor = firstThrower(game);
    return { ...game, actor, phase: 'taking', passed: [], message: `${game.players[game.defender].name} берёт — можно подкинуть` };
  }
  if (action.type === 'pass') return passAttack(game);
  return game;
}

export function chooseDurakAction(game: MultiplayerDurak): DurakAction | null {
  if (game.result) return null;
  const player = game.players[game.actor];
  const playable = player.hand.filter((card) => canPlayDurakCard(game, card))
    .sort((a, b) => (a.suit === game.trump ? 20 : 0) + a.value - ((b.suit === game.trump ? 20 : 0) + b.value));
  if (playable[0]) return { type: 'play', cardId: playable[0].id };
  if (game.phase === 'defend') return { type: 'take' };
  if (game.phase === 'throw' || game.phase === 'taking') return { type: 'pass' };
  return null;
}
