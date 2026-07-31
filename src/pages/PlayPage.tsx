import { Link } from 'wouter';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../lib/app-context';

export function PlayPage() {
  const { t } = useApp();
  const modes = [
    { id: 'ai', icon: 'ai', title: t('ai'), text: t('aiText'), color: 'purple', meta: '4 уровня' },
    { id: 'online', icon: 'online', title: t('onlineGame'), text: t('onlineText'), color: 'green', meta: '1 248 онлайн' },
    { id: 'local', icon: 'local', title: t('local'), text: t('localText'), color: 'blue', meta: '2–6 игроков' },
    { id: 'tournament', icon: 'tournament', title: t('tournament'), text: t('tournamentText'), color: 'orange', meta: 'До 20:00' },
  ];
  return (
    <div className="screen">
      <PageHeader title={t('gameModes')} subtitle="Выбери, как хочешь играть" />
      <section className="mode-list">
        {modes.map((mode) => (
          <Link className="mode-card" href={`/play/${mode.id}`} key={mode.id}>
            <span className={`mode-icon ${mode.color}`}><Icon name={mode.icon} /></span>
            <span><h2>{mode.title}</h2><p>{mode.text}</p><small>{mode.meta}</small></span>
            <Icon name="chevron" />
          </Link>
        ))}
      </section>
      <aside className="practice-banner">
        <span>♧</span><div><strong>Практический режим</strong><p>Всегда доступен · без потери токенов</p></div>
      </aside>
    </div>
  );
}
