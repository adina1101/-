import { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { PurchaseDialog } from '../components/PurchaseDialog';
import { ShopItemCard } from '../components/ShopItemCard';
import { useEconomy } from '../lib/economy-context';
import { shopCategories, shopItems, type ShopCategory, type ShopItem } from '../lib/shop-data';
import { useApp } from '../lib/app-context';
import { shopCategoryCopy, shopItemText, shopText } from '../lib/shop-i18n';

export function ShopPage() {
  const { tokens, owned, equipped, purchase, equip } = useEconomy();
  const { language } = useApp();
  const [category, setCategory] = useState<'all' | ShopCategory>('all');
  const [selected, setSelected] = useState<ShopItem | null>(null);
  const [success, setSuccess] = useState<ShopItem | null>(null);
  const visible = shopItems.filter((item) => category === 'all' || item.category === category);

  const confirmPurchase = () => {
    if (!selected || !purchase(selected.id, selected.price, selected.slot)) return;
    setSuccess(selected); setSelected(null);
    window.setTimeout(() => setSuccess(null), 1900);
  };

  return (
    <div className="screen shop-screen">
      <PageHeader title={shopText(language, 'title')} subtitle={shopText(language, 'subtitle')} />
      <section className="wallet-banner">
        <div><small>{shopText(language, 'balance')}</small><strong><Icon name="token" /> {tokens}</strong></div>
        <span>{shopText(language, 'earn')}</span>
      </section>
      <div className="shop-categories">
        {shopCategories.map((item) => <button key={item} className={category === item ? 'active' : ''}
          onClick={() => setCategory(item)}>{shopCategoryCopy[item][language]}</button>)}
      </div>
      <div className="shop-grid">
        {visible.map((item) => <ShopItemCard key={item.id} item={item} owned={owned.includes(item.id)}
          equipped={item.slot ? equipped[item.slot] === item.id : false}
          affordable={tokens >= item.price} onBuy={() => setSelected(item)}
          onEquip={() => item.slot && equip(item.id, item.slot)} onPreview={() => setSelected(item)} />)}
      </div>
      {selected && <PurchaseDialog item={selected}
        owned={owned.includes(selected.id)} equipped={selected.slot ? equipped[selected.slot] === selected.id : false}
        onCancel={() => setSelected(null)} onConfirm={confirmPurchase}
        onEquip={() => { if (selected.slot) equip(selected.id, selected.slot); setSelected(null); }} />}
      {success && <div className="purchase-success"><div className="success-burst">✓<i /><i /><i /><i /></div>
        <h2>{shopText(language, 'unlocked')}</h2><p>{shopItemText(success, language).name} {shopText(language, 'yours')}</p></div>}
    </div>
  );
}
