import { useApp } from '../lib/app-context';
import type { GameRule } from '../lib/game-rules';

export function GameRulesCopy({ rules }: { rules: GameRule }) {
  const { language, t } = useApp();
  return <>
    <h2>{t('goal')}</h2><p>{rules.goal[language]}</p>
    <h2>{t('preparation')}</h2><p>{rules.setup[language]}</p>
    <h2>{t('rules')}</h2><ol>{rules.steps.map((step, index) =>
      <li key={index}>{step[language]}</li>)}</ol>
  </>;
}
