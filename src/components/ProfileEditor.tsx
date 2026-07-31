import { useRef, useState, type ChangeEvent } from 'react';
import { useApp } from '../lib/app-context';
import { UserAvatar } from './UserAvatar';

export function ProfileEditor({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useApp();
  const [nickname, setNickname] = useState(profile.nickname);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const chooseImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2_000_000) {
      setError('Выбери изображение размером до 2 МБ');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setAvatar(String(reader.result)); setError(''); };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (nickname.trim().length < 2) { setError('Ник должен содержать минимум 2 символа'); return; }
    updateProfile(nickname, avatar); onClose();
  };

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section className="profile-editor" onMouseDown={(event) => event.stopPropagation()}>
        <h2>Редактировать профиль</h2>
        <button className="avatar-picker" onClick={() => fileInput.current?.click()}>
          <UserAvatar nickname={nickname || 'P'} avatar={avatar} /><span>Изменить фото</span>
        </button>
        <input ref={fileInput} hidden type="file" accept="image/*" onChange={chooseImage} />
        {avatar && <button className="remove-photo" onClick={() => setAvatar(null)}>Удалить фото</button>}
        <label><span>Ник</span><input maxLength={18} value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
        {error && <p className="profile-error">{error}</p>}
        <div className="dialog-actions"><button onClick={onClose}>Отмена</button><button onClick={save}>Сохранить</button></div>
      </section>
    </div>
  );
}
