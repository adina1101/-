import { useEffect, useState } from 'react';

export function ProfilePhoto({ photo, className = '' }: { photo: string | null; className?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [photo]);
  return <span className={`profile-photo ${className}`}>
    {photo && !failed
      ? <img src={photo} alt="Фото профиля" onError={() => setFailed(true)} />
      : <svg viewBox="0 0 48 48" role="img" aria-label="Профиль">
        <circle cx="24" cy="17" r="9" />
        <path d="M8 43C9.5 32.5 15 27 24 27S38.5 32.5 40 43Z" />
      </svg>}
  </span>;
}
