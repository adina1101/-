import { Link } from 'wouter';
import { Icon } from '../components/Icon';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { ProfilePhoto } from '../components/ProfilePhoto';
import { StreakCard } from '../components/StreakCard';

export function HomePage() {
  const { t, profile } = useApp();
  const { tokens } = useEconomy();
  return (
    <div className="screen home-screen">
      <header className="home-top">
        <div className="brand-lockup"><div className="brand-mark"><span>♠</span></div><strong>CARDI<span>X</span></strong></div>
        <div className="balance"><Icon name="token" /> {tokens}</div>
        <Link href="/profile" className="profile-link"><ProfilePhoto photo={profile.photo} /></Link>
      </header>

      <section className="welcome">
        <p>{t('greeting')},</p>
        <h1>{profile.nickname} <span>♥</span></h1>
      </section>
      <StreakCard compact />

      <section className="hero-card">
        <img className="hero-brand-art" src="/assets/cardix-brand.png" alt="" />
        <div className="hero-copy">
          <span className="online-pill"><i /> 1 248 {t('online')}</span>
          <h2>{t('heroTitle')}</h2>
          <p>{t('heroText')}</p>
          <Link href="/play" className="primary-button">{t('findGame')} <Icon name="play" /></Link>
        </div>
      </section>

      <div className="section-heading"><h2>{t('dailyMissions')}</h2><button>{t('seeAll')}</button></div>
      <section className="mission-list">
        <article className="mission-card">
          <div className="mission-icon orange"><Icon name="flame" /></div>
          <div><h3>Победная серия</h3><p>Выиграй 3 партии подряд</p><div className="progress"><i style={{ width: '66%' }} /></div></div>
          <strong>2/3</strong>
        </article>
        <article className="mission-card">
          <div className="mission-icon green"><Icon name="trophy" /></div>
          <div><h3>Опытный игрок</h3><p>Сыграй 5 партий</p><div className="progress"><i style={{ width: '60%' }} /></div></div>
          <strong>3/5</strong>
        </article>
      </section>
    </div>
  );
}
