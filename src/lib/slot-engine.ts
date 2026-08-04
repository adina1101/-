export interface SlotSymbol {
  id: string;
  label: string;
  glyph: string;
  color: 'red' | 'black';
}

export const slotSymbols: SlotSymbol[] = [
  { id: 'joker', label: 'Joker', glyph: '★', color: 'red' },
  { id: 'ace-black', label: 'Ace', glyph: 'A', color: 'black' },
  { id: 'ace-red', label: 'Ace', glyph: 'A', color: 'red' },
  { id: 'six-black', label: 'Six', glyph: '6', color: 'black' },
  { id: 'six-red', label: 'Six', glyph: '6', color: 'red' },
  { id: 'king', label: 'King', glyph: 'K', color: 'red' },
  { id: 'queen', label: 'Queen', glyph: 'Q', color: 'black' },
  { id: 'jack', label: 'Jack', glyph: 'J', color: 'red' },
  { id: 'heart', label: 'Hearts', glyph: '♥', color: 'red' },
  { id: 'diamond', label: 'Diamonds', glyph: '♦', color: 'red' },
  { id: 'club', label: 'Clubs', glyph: '♣', color: 'black' },
  { id: 'spade', label: 'Spades', glyph: '♠', color: 'black' },
];

const rankSymbols = slotSymbols.filter((symbol) =>
  ['ace-black', 'ace-red', 'six-black', 'six-red', 'king', 'queen', 'jack'].includes(symbol.id));
const suitSymbols = slotSymbols.filter((symbol) =>
  ['heart', 'diamond', 'club', 'spade'].includes(symbol.id));

const randomSymbol = () => {
  const roll = Math.random();
  if (roll < .03) return slotSymbols[0];
  if (roll < .3) return rankSymbols[Math.floor(Math.random() * rankSymbols.length)];
  return suitSymbols[Math.floor(Math.random() * suitSymbols.length)];
};

export function spinReels() {
  return [randomSymbol(), randomSymbol(), randomSymbol()];
}

export function calculatePayout(reels: SlotSymbol[], bet: number) {
  const ids = reels.map((symbol) => symbol.id);
  const hasAce = ids.some((id) => id.startsWith('ace-'));
  const hasSix = ids.some((id) => id.startsWith('six-'));
  const isBonusSymbol = (id: string) => id.startsWith('ace-') || id.startsWith('six-')
    || ['heart', 'diamond', 'club', 'spade'].includes(id);
  if (hasAce && hasSix && ids.every(isBonusSymbol)) return bet * 4;
  if (reels.every((symbol) => symbol.id === reels[0].id)) return bet * 3;
  if (reels.every((symbol) => symbol.color === reels[0].color)) return bet * 2;
  return 0;
}
