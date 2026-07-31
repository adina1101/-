export interface PlayingCard {
  id: string;
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  value: number;
}

export interface TablePair { attack: PlayingCard; defense?: PlayingCard }

const suits: PlayingCard['suit'][] = ['♠', '♥', '♦', '♣'];
const ranks = [
  ['6', 6], ['7', 7], ['8', 8], ['9', 9], ['10', 10],
  ['J', 11], ['Q', 12], ['K', 13], ['A', 14],
] as const;

export function createDeck(random: () => number = Math.random) {
  const deck = suits.flatMap((suit) =>
    ranks.map(([rank, value]) => ({ id: `${suit}${rank}`, suit, rank, value })));
  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [deck[index], deck[swap]] = [deck[swap], deck[index]];
  }
  return deck;
}

export const canBeat = (attack: PlayingCard, defense: PlayingCard, trump: PlayingCard['suit']) =>
  (attack.suit === defense.suit && defense.value > attack.value)
  || (attack.suit !== trump && defense.suit === trump);

export const canThrow = (card: PlayingCard, table: TablePair[]) =>
  table.length === 0 || table.some((pair) =>
    pair.attack.rank === card.rank || pair.defense?.rank === card.rank);
