import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { nextStreakMilestone } from '../lib/streak';

export function StreakCard({ compact = false }: { compact?: boolean }) {
  const { language } = useApp();
  const { streak, tokens, buyFreeze } = useEconomy();
  const ru = language === 'ru';
  const milestone = nextStreakMilestone(streak.current);
  const progress = Math.max(0, 100 - ((milestone - streak.current) / 20) * 100);
  return <section className={compact ? 'streak-card compact' : 'streak-card'}>
    <div className="streak-flame">🔥<strong>{streak.current}</strong></div>
    <div className="streak-copy">
      <span>{ru ? 'Ежедневная серия' : 'Daily streak'}</span>
      <h2>{streak.title}</h2>
      <p>{ru ? `Сыграйте партию сегодня · награда ${milestone} жетонов на ${milestone}-й день`
        : `Play today · earn ${milestone} tokens on day ${milestone}`}</p>
      <div className="streak-progress"><i style={{ width: `${progress}%` }} /></div>
    </div>
    <div className="freeze-box"><span>❄️ {streak.freezes}</span>
      <button disabled={tokens < 25} onClick={buyFreeze}>+1 · 25 ◆</button>
      <Link href="/streak">{ru ? 'Подробнее ›' : 'Details ›'}</Link></div>
    {!compact && streak.lastReward > 0 && <small className="streak-last-reward">
      {ru ? `Последняя награда: +${streak.lastReward} жетонов` : `Last reward: +${streak.lastReward} tokens`}
    </small>}
  </section>;
}
import { Link } from 'wouter';
