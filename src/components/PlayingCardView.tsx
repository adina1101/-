import type { PlayingCard } from '../lib/card-engine';
import { useEconomy } from '../lib/economy-context';
import { shopItems } from '../lib/shop-data';

export function PlayingCardView({ card, small, disabled, onClick }: {
  card: PlayingCard;
  small?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const { equipped } = useEconomy();
  const deck = shopItems.find((item) => item.id === equipped.deck);
  const red = card.suit === '♥' || card.suit === '♦';
  return (
    <button className={`durak-card ${red ? 'red-card' : ''} ${small ? 'small-card' : ''} ${deck ? `skin-${deck.id}` : ''}`}
      disabled={disabled} onClick={onClick}>
      {deck?.image && <span className="card-skin-art" style={{ backgroundImage: `url("${deck.image}")` }} />}
      <span className="card-corner top"><b>{card.rank}</b><i>{card.suit}</i></span>
      <span className="center-suit">{card.suit}</span>
      <span className="card-corner bottom"><b>{card.rank}</b><i>{card.suit}</i></span>
    </button>
  );
}
