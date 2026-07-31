import { useEffect, useState } from 'react';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { AvatarAppearance } from './AvatarAppearance';

export function UserAvatar({ nickname, avatar, className = '' }: {
  nickname: string;
  avatar: string | null;
  className?: string;
}) {
  const { equipped } = useEconomy();
  const { profile } = useApp();
  const [photoFailed, setPhotoFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const cosmeticClasses = [equipped.frame, equipped.background].filter(Boolean).join(' ');
  const useUploadedPhoto = Boolean(avatar) && !photoFailed;
  const source = useUploadedPhoto ? avatar! : `/assets/avatar-${profile.gender}-full.png`;

  useEffect(() => {
    setPhotoFailed(false);
    setFallbackFailed(false);
  }, [avatar, profile.gender]);

  return (
    <span className={`user-avatar ${className} ${cosmeticClasses}`}>
      <span className="avatar-photo-clip">
        {!fallbackFailed && <img className={useUploadedPhoto ? '' : 'generated-avatar-photo'} src={source} alt={nickname}
          onError={() => useUploadedPhoto ? setPhotoFailed(true) : setFallbackFailed(true)} />}
        {!useUploadedPhoto && !fallbackFailed && <AvatarAppearance gender={profile.gender} appearance={profile.appearance} portrait />}
        {fallbackFailed && <span className={`css-avatar-face ${profile.gender}`} aria-label={nickname}><i /><b /></span>}
      </span>
      {equipped.head === 'avatar-crown' && <i className="avatar-layer avatar-crown">♛</i>}
      {equipped.head === 'avatar-cap' && <i className="avatar-layer avatar-cap" />}
      {equipped.face === 'avatar-glasses' && <i className="avatar-layer avatar-glasses">● ●</i>}
      {equipped.face === 'avatar-mask-gold' && <i className="avatar-layer avatar-gold-mask">◆</i>}
    </span>
  );
}
