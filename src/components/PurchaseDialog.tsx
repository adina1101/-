import type { ShopItem } from '../lib/shop-data';
import { Icon } from './Icon';
import { useApp } from '../lib/app-context';
import { shopItemText, shopText } from '../lib/shop-i18n';

export function PurchaseDialog({ item, owned = false, equipped = false, onCancel, onConfirm, onEquip }: {
  item: ShopItem;
  owned?: boolean;
  equipped?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  onEquip?: () => void;
}) {
  const { language } = useApp();
  const text = shopItemText(item, language);
  return (
    <div className="dialog-backdrop" onMouseDown={onCancel}>
      <section className="purchase-dialog" onMouseDown={(event) => event.stopPropagation()}>
        <div className={`dialog-art${item.image ? ' has-image' : ''}`} style={{ background: `linear-gradient(145deg,${item.colors[0]},${item.colors[1]})` }}>
          {item.image ? <img src={item.image} alt={text.name} /> : item.art}
        </div>
        <h2>{owned ? text.name : shopText(language, 'confirm')}</h2><p>{owned ? shopText(language, 'alreadyOwned') : <><strong>{text.name}</strong> — {shopText(language, 'unlock')}</>}</p>
        <div className="dialog-price"><Icon name="token" /> {item.price} {shopText(language, 'tokens')}</div>
        <div className="dialog-actions"><button onClick={onCancel}>{shopText(language, 'close')}</button>
          <button onClick={owned ? onEquip : onConfirm} disabled={owned && equipped}>{owned ? equipped ? shopText(language, 'equipped') : shopText(language, 'equip') : shopText(language, 'buy')}</button>
        </div>
      </section>
    </div>
  );
}
