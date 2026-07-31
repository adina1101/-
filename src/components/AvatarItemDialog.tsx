import type { ShopItem } from '../lib/shop-data';
import { FullBodyAvatar } from './FullBodyAvatar';
import { Icon } from './Icon';
import { useApp } from '../lib/app-context';
import { shopItemText, shopText } from '../lib/shop-i18n';

export function AvatarItemDialog({ item, owned, equipped, affordable, onClose, onBuy, onEquip }: {
  item: ShopItem; owned: boolean; equipped: boolean; affordable: boolean;
  onClose: () => void; onBuy: () => void; onEquip: () => void;
}) {
  const { language } = useApp();
  const text = shopItemText(item, language);
  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section className="avatar-item-dialog" onMouseDown={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={onClose}>×</button>
        <h2>{shopText(language, 'fitting')}</h2><FullBodyAvatar preview={item} compact />
        <h3>{text.name}</h3><p>{text.description}</p>
        {!owned && <strong className="dialog-price"><Icon name="token" /> {item.price}</strong>}
        <button className="primary-button" disabled={!owned && !affordable}
          onClick={owned ? onEquip : onBuy}>{equipped ? shopText(language, 'remove') : owned ? shopText(language, 'equip') : shopText(language, 'buyEquip')}</button>
      </section>
    </div>
  );
}
