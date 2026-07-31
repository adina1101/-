import { useEffect, useState } from 'react';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import type { ShopItem } from '../lib/shop-data';
import { AvatarWearables } from './AvatarWearables';
import { AvatarAppearance } from './AvatarAppearance';

export function FullBodyAvatar({ preview, compact = false }: {
  preview?: ShopItem | null;
  compact?: boolean;
}) {
  const { profile } = useApp();
  const [imageFailed, setImageFailed] = useState(false);
  const { equipped } = useEconomy();
  const outfit = { ...equipped, ...(preview?.slot ? { [preview.slot]: preview.id } : {}) };
  const classes = Object.values(outfit).filter(Boolean).join(' ');
  useEffect(() => setImageFailed(false), [profile.gender]);

  return (
    <div className={`full-avatar gender-${profile.gender} ${compact ? 'compact' : ''} ${classes}`}>
      <div className="avatar-aura" />
      {!imageFailed && <img src={`/assets/avatar-${profile.gender}-full.png`}
        onError={() => setImageFailed(true)}
        alt={`Аватар ${profile.gender === 'boy' ? 'мальчика' : 'девочки'}`} />}
      {imageFailed && <div className={`full-avatar-fallback ${profile.gender}`}><span className="css-avatar-face"><i /><b /></span></div>}
      <AvatarAppearance gender={profile.gender} appearance={profile.appearance} layer="base" />
      <AvatarWearables outfit={outfit} gender={profile.gender} />
      <AvatarAppearance gender={profile.gender} appearance={profile.appearance} layer="front" />
      <i className="wearable wearable-head" />
      <i className="wearable wearable-face" />
    </div>
  );
}
