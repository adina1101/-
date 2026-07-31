import { useId } from 'react';
import type { AvatarSlot } from '../lib/shop-data';
import { AvatarWearablePants } from './AvatarWearablePants';
import { AvatarWearableTop } from './AvatarWearableTop';
import { wearableLooks } from './avatar-wearable-config';

type Outfit = Partial<Record<AvatarSlot, string>>;

export function AvatarWearables({ outfit, gender }: {
  outfit: Outfit; gender: 'boy' | 'girl';
}) {
  const look = outfit.outfit;
  const config = look ? wearableLooks[look] : undefined;
  const id = useId().replace(/:/g, '');
  if (!config || (config.gender && config.gender !== gender)) return null;

  return <svg className="avatar-wearables" viewBox="0 0 1024 1536" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-denim`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={config.denim[0]} /><stop offset=".55" stopColor={config.denim[1]} /><stop offset="1" stopColor={config.denim[0]} />
      </linearGradient>
      <pattern id={`${id}-plaid`} width="46" height="46" patternUnits="userSpaceOnUse">
        <rect width="46" height="46" fill="#3e4653" /><path d="M0 12H46M0 34H46M12 0V46M34 0V46" stroke="#a1a5ab" strokeWidth="7" opacity=".7" />
      </pattern>
      <pattern id={`${id}-stripe`} width="80" height="80" patternUnits="userSpaceOnUse">
        <rect width="80" height="80" fill="#d9c19b" /><rect y="40" width="80" height="40" fill="#493426" />
      </pattern>
    </defs>
    <AvatarWearablePants gender={gender} style={config.pants} fill={`url(#${id}-denim)`} />
    <AvatarWearableTop gender={gender} style={config.top} plaidId={`${id}-plaid`} stripeId={`${id}-stripe`} />
  </svg>;
}
