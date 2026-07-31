import { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { ProfileEditor } from '../components/ProfileEditor';
import { AvatarStudio } from '../components/AvatarStudio';
import { FullBodyAvatar } from '../components/FullBodyAvatar';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';

export function ProfilePage() {
  const { t, profile } = useApp();
  const { tokens } = useEconomy();
  const [editing, setEditing] = useState(false);
  const [avatarEditing, setAvatarEditing] = useState(false);
  return (
    <div className="screen">
      <PageHeader title={t('profile')} />
      <section className="profile-card">
        <div className="profile-avatar-stage"><FullBodyAvatar /><span className="level-badge">12</span></div>
        <h2>{profile.nickname}</h2><p>@{profile.nickname.toLowerCase().replace(/\s/g, '_')}</p>
        <button className="change-avatar-button" onClick={() => setAvatarEditing(true)}>Изменить аватар</button>
        <button className="edit-profile-button" onClick={() => setEditing(true)}>Изменить профиль</button>
        <div className="level-row"><span>{t('level')} 12</span><strong>2 340 / 3 000 XP</strong></div>
        <div className="progress large"><i style={{ width: '78%' }} /></div>
        <div className="token-balance"><Icon name="token" /><strong>{tokens}</strong><span>Tokens</span></div>
      </section>
      <section className="stat-grid">
        <article><strong>84</strong><span>{t('gamesPlayed')}</span></article>
        <article><strong>51</strong><span>{t('wins')}</span></article>
        <article><strong>61%</strong><span>{t('winRate')}</span></article>
      </section>
      <div className="section-heading"><h2>{t('achievements')}</h2><button>{t('seeAll')}</button></div>
      <section className="achievement-row">
        <div className="earned">♛<span>Первая победа</span></div>
        <div className="earned">⚡<span>Серия x5</span></div>
        <div>♚<span>100 побед</span></div>
      </section>
      <div className="section-heading"><h2>{t('recentMatches')}</h2></div>
      <section className="match-list">
        <article><b className="win">В</b><div><strong>Дурак подкидной</strong><p>против Miras · 8 мин</p></div><span>+20 ◆</span></article>
        <article><b className="loss">П</b><div><strong>Техасский холдем</strong><p>против Sofia · 14 мин</p></div><span>-10 ◆</span></article>
      </section>
      {editing && <ProfileEditor onClose={() => setEditing(false)} />}
      {avatarEditing && <AvatarStudio onClose={() => setAvatarEditing(false)} />}
    </div>
  );
}
