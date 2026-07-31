import { useEffect, useState } from 'react';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { shopItems, type ShopItem } from '../lib/shop-data';
import { shopItemText, shopText } from '../lib/shop-i18n';
import { AvatarAppearanceEditor } from './AvatarAppearanceEditor';
import { FullBodyAvatar } from './FullBodyAvatar';
import { Icon } from './Icon';

const allWardrobe = shopItems.filter((item) =>
  item.category === 'avatar' || item.category === 'frames' || item.category === 'backgrounds');

export function AvatarStudio({ onClose }: { onClose: () => void }) {
  const { profile, setAvatarGender, language } = useApp();
  const { tokens, owned, equipped, purchase, equip } = useEconomy();
  const [preview, setPreview] = useState<ShopItem | null>(null);
  const [section, setSection] = useState<'appearance' | 'wardrobe'>('appearance');
  const wardrobe = allWardrobe.filter((item) => !item.gender || item.gender === profile.gender);
  const selectedOwned = preview ? owned.includes(preview.id) : false;
  const selectedEquipped = preview?.slot ? equipped[preview.slot] === preview.id : false;

  useEffect(() => {
    if (preview?.gender && preview.gender !== profile.gender) setPreview(null);
  }, [preview, profile.gender]);

  const apply = () => {
    if (!preview?.slot) return;
    if (selectedOwned) equip(preview.id, preview.slot);
    else purchase(preview.id, preview.price, preview.slot);
  };

  return <div className="avatar-studio">
    <header><button onClick={onClose}>×</button><div><h2>{shopText(language, 'editAvatar')}</h2>
      <p><Icon name="token" /> {tokens} {shopText(language, 'tokens')}</p></div><span /></header>
    <main>
      <section className="studio-preview">
        <div className="gender-switch">
          <button className={profile.gender === 'boy' ? 'active' : ''} onClick={() => setAvatarGender('boy')}>{shopText(language, 'boy')}</button>
          <button className={profile.gender === 'girl' ? 'active' : ''} onClick={() => setAvatarGender('girl')}>{shopText(language, 'girl')}</button>
        </div>
        <FullBodyAvatar preview={preview} />
        {preview && <div className="preview-caption"><strong>{shopItemText(preview, language).name}</strong>
          <span>{selectedOwned ? selectedEquipped ? shopText(language, 'currentlyEquipped') : shopText(language, 'purchased') : preview.price ? `${preview.price} ♦` : shopText(language, 'free')}</span></div>}
      </section>
      <section className="wardrobe-panel">
        <div className="studio-tabs">
          <button className={section === 'appearance' ? 'active' : ''} onClick={() => {
            setSection('appearance'); setPreview(null);
          }}>{language === 'ru' ? 'Внешность' : 'Appearance'}</button>
          <button className={section === 'wardrobe' ? 'active' : ''} onClick={() => setSection('wardrobe')}>
            {shopText(language, 'wardrobe')}</button>
        </div>
        {section === 'appearance' ? <AvatarAppearanceEditor /> : <>
          <h3>{shopText(language, 'wardrobe')}</h3><p>{shopText(language, 'wardrobeHint')}</p>
          <div className="wardrobe-grid">{wardrobe.map((item) => <button key={item.id}
            className={`${preview?.id === item.id ? 'selected' : ''} ${item.slot && equipped[item.slot] === item.id ? 'equipped' : ''}`}
            onClick={() => setPreview(item)}>
            <span style={{ background: `linear-gradient(145deg,${item.colors[0]},${item.colors[1]})` }}>{item.art}</span>
            <strong>{shopItemText(item, language).name}</strong>
            <small>{owned.includes(item.id) ? shopText(language, 'purchased') : item.price ? `${item.price} ♦` : shopText(language, 'free')}</small>
          </button>)}</div>
        </>}
      </section>
    </main>
    <footer><button onClick={onClose}>{shopText(language, 'done')}</button>
      {section === 'wardrobe' && <button disabled={!preview?.slot || (!selectedOwned && tokens < (preview?.price ?? 0))}
        onClick={apply}>{selectedEquipped ? shopText(language, 'remove') : selectedOwned ? shopText(language, 'equip') : shopText(language, 'buyEquip')}</button>}
    </footer>
  </div>;
}
