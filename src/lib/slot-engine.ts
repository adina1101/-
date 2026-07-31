export interface SlotSymbol {
  id: string;
  label: string;
  glyph: string;
  color: 'red' | 'black';
}

export const slotSymbols: SlotSymbol[] = [
  { id: 'joker', label: 'Joker', glyph: '★', color: 'red' },
  { id: 'ace', label: 'Ace', glyph: 'A', color: 'black' },
  { id: 'king', label: 'King', glyph: 'K', color: 'red' },
  { id: 'queen', label: 'Queen', glyph: 'Q', color: 'black' },
  { id: 'jack', label: 'Jack', glyph: 'J', color: 'red' },
  { id: 'heart', label: 'Hearts', glyph: '♥', color: 'red' },
  { id: 'diamond', label: 'Diamonds', glyph: '♦', color: 'red' },
  { id: 'club', label: 'Clubs', glyph: '♣', color: 'black' },
  { id: 'spade', label: 'Spades', glyph: '♠', color: 'black' },
];

const randomSymbol = () => {
  const roll = Math.random();
  if (roll < .03) return slotSymbols[0];
  if (roll < .12) return slotSymbols[1 + Math.floor(Math.random() * 4)];
  return slotSymbols[5 + Math.floor(Math.random() * 4)];
};

export function spinReels() {
  return [randomSymbol(), randomSymbol(), randomSymbol()];
}

export function calculatePayout(reels: SlotSymbol[], bet: number) {
  if (reels.every((symbol) => symbol.id === reels[0].id)) return bet * 3;
  if (reels.every((symbol) => symbol.color === reels[0].color)) return bet * 2;
  return 0;
}
