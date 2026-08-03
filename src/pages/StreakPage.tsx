import { PageHeader } from '../components/PageHeader';
import { StreakCard } from '../components/StreakCard';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { getStreakStatus, localDateKey } from '../lib/streak';

const rewards = [
  { day: 20, title: 'Крутой' },
  { day: 40, title: 'Просто босс' },
  { day: 60, title: 'Картёжник' },
  { day: 80, title: 'Самый главный' },
  { day: 100, title: 'Легенда CARDIX' },
];

export function StreakPage() {
  const { language } = useApp();
  const { streak } = useEconomy();
  const ru = language === 'ru';
  const status = getStreakStatus(streak, localDateKey());
  const statusText = status.frozen
    ? (ru ? `Серия заморожена. Сыграйте партию — будет использовано разморозок: ${status.freezesNeeded}.` : `Streak frozen. Play a match to use ${status.freezesNeeded} freeze(s).`)
    : (ru ? 'Сыграйте минимум одну партию сегодня, чтобы продолжить серию.' : 'Complete at least one match today to continue the streak.');

  return <div className="screen streak-screen">
    <PageHeader title={ru ? 'Серия' : 'Streak'} subtitle={ru ? 'Играйте каждый день и получайте награды' : 'Play daily and earn rewards'} back="/" />
    <StreakCard />
    <section className={status.frozen ? 'streak-state frozen' : 'streak-state'}>
      <span>{status.frozen ? '❄️' : '🔥'}</span><div><strong>{status.frozen ? (ru ? 'Заморожена' : 'Frozen') : (ru ? 'Активна' : 'Active')}</strong><p>{statusText}</p></div>
    </section>
    <h2 className="streak-section-title">{ru ? 'Награды и звания' : 'Rewards and titles'}</h2>
    <section className="streak-rewards">
      {rewards.map((reward) => <article className={streak.current >= reward.day ? 'earned' : ''} key={reward.day}>
        <span>{streak.current >= reward.day ? '✓' : reward.day}</span>
        <div><strong>{reward.title}</strong><p>{ru ? `${reward.day} дней · +${reward.day} жетонов` : `${reward.day} days · +${reward.day} tokens`}</p></div>
      </article>)}
    </section>
    <p className="streak-rules-note">{ru
      ? 'Пропущенные дни автоматически используют разморозки. Изначально их 3, новая стоит 25 жетонов. После трёх пропущенных дней серия сбрасывается.'
      : 'Missed days automatically use freezes. You start with 3; another costs 25 tokens. After three missed days, the streak resets.'}</p>
  </div>;
}
