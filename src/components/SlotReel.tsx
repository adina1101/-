import type { SlotSymbol } from '../lib/slot-engine';

export function SlotReel({ symbol, spinning, delay }: {
  symbol: SlotSymbol;
  spinning: boolean;
  delay: number;
}) {
  const red = symbol.color === 'red';
  return (
    <div className={spinning ? 'slot-reel spinning' : 'slot-reel'} style={{ animationDelay: `${delay}ms` }}>
      <span className={red ? 'red-symbol' : ''}>{symbol.glyph}</span>
      <small>{symbol.label}</small>
    </div>
  );
}
