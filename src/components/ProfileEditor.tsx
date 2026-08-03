import { useRef, useState, type ChangeEvent } from 'react';
import { useApp } from '../lib/app-context';
import { ProfilePhoto } from './ProfilePhoto';

export function ProfileEditor({ onClose }: { onClose: () => void }) {
  const { profile, updateProfile } = useApp();
  const [nickname, setNickname] = useState(profile.nickname);
  const [photo, setPhoto] = useState(profile.photo);
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
    reader.onload = () => { setPhoto(String(reader.result)); setError(''); };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (nickname.trim().length < 2) { setError('Ник должен содержать минимум 2 символа'); return; }
    updateProfile(nickname, photo); onClose();
  };

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <section className="profile-editor" onMouseDown={(event) => event.stopPropagation()}>
        <h2>Редактировать профиль</h2>
        <button className="photo-picker" onClick={() => fileInput.current?.click()}>
          <ProfilePhoto photo={photo} /><span>Изменить фото</span>
        </button>
        <input ref={fileInput} hidden type="file" accept="image/*" onChange={chooseImage} />
        {photo && <button className="remove-photo" onClick={() => setPhoto(null)}>Удалить фото</button>}
        <label><span>Ник</span><input maxLength={18} value={nickname} onChange={(event) => setNickname(event.target.value)} /></label>
        {error && <p className="profile-error">{error}</p>}
        <div className="dialog-actions"><button onClick={onClose}>Отмена</button><button onClick={save}>Сохранить</button></div>
      </section>
    </div>
  );
}
