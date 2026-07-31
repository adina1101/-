import type { ShopItem } from '../lib/shop-data';
import { Icon } from './Icon';
import { useApp } from '../lib/app-context';
import { shopItemText, shopText } from '../lib/shop-i18n';

export function ShopItemCard({ item, owned, equipped, affordable, onBuy, onEquip, onPreview }: {
  item: ShopItem;
  owned: boolean;
  equipped: boolean;
  affordable: boolean;
  onBuy: () => void;
  onEquip: () => void;
  onPreview: () => void;
}) {
  const { language } = useApp();
  const text = shopItemText(item, language);
  return (
    <article className="shop-item">
      <button className={`shop-art${item.image ? ' has-image' : ''}`} onClick={onPreview} style={{ background: `radial-gradient(circle at 30% 25%,${item.colors[0]},${item.colors[1]})` }}>
        {item.image ? <img src={item.image} alt={text.name} /> : <span>{item.art}</span>}<i />
      </button>
      <div className="shop-item-copy"><h3>{text.name}</h3><p>{text.description}</p></div>
      <div className="shop-item-footer">
        {item.future ? <span className="coming-soon">{shopText(language, 'comingSoon')}</span> : <strong><Icon name="token" /> {item.price}</strong>}
        <button className={equipped ? 'equipped' : ''} disabled={(!owned && !affordable) || item.future}
          onClick={owned ? onEquip : onBuy}>
          {equipped ? shopText(language, 'equipped') : owned ? item.slot ? shopText(language, 'equip') : shopText(language, 'owned') : item.future ? shopText(language, 'locked') : shopText(language, 'buy')}
        </button>
      </div>
    </article>
  );
}
