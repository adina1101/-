import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { nextStreakMilestone } from '../lib/streak';

export function MatchStreakStatus() {
  const { language } = useApp();
  const { streak } = useEconomy();
  const next = nextStreakMilestone(streak.current);
  return <div className="match-streak-status">
    <span>🔥</span>
    <div>
      <strong>{language === 'ru' ? `Серия: ${streak.current} дн.` : `${streak.current}-day streak`}</strong>
      <small>{language === 'ru' ? `Следующая награда на ${next}-й день` : `Next reward on day ${next}`}</small>
    </div>
  </div>;
}
