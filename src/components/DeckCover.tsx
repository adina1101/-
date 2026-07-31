import { useEconomy } from '../lib/economy-context';
import { shopItems } from '../lib/shop-data';
import { useApp } from '../lib/app-context';
import { shopItemText } from '../lib/shop-i18n';

export function DeckCover() {
  const { equipped } = useEconomy();
  const { language } = useApp();
  const deck = shopItems.find((item) => item.id === equipped.deck);

  return (
    <div
      className={`deck-cover ${deck ? `skin-${deck.id}` : ''}`}
      style={deck?.image ? { backgroundImage: `url("${deck.image}")` } : undefined}
      aria-label={deck ? `${language === 'ru' ? 'Колода' : 'Deck'} ${shopItemText(deck, language).name}` : language === 'ru' ? 'Стандартная колода' : 'Standard deck'}
    >
      {!deck?.image && (deck?.art ?? '♠')}
    </div>
  );
}
