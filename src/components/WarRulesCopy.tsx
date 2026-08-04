import { useApp } from '../lib/app-context';

export function WarRulesCopy() {
  const { language, t } = useApp();
  const ru = language === 'ru';
  return <>
    <h2>{t('goal')}</h2><p>{ru ? 'Заберите себе всю колоду.' : 'Collect the entire deck.'}</p>
    <h2>{t('preparation')}</h2><p>{ru
      ? 'Все 36 карт раздаются участникам поровну. Игроки держат свои стопки закрытыми и не смотрят карты.'
      : 'Deal all 36 cards among the players. Everyone keeps their pile face down without looking.'}</p>
    <h2>{t('rules')}</h2><ol>
      <li>{ru ? 'Каждый участник открывает одну верхнюю карту.' : 'Each player reveals one top card.'}</li>
      <li>{ru ? 'Старшая карта забирает все открытые карты под низ стопки победителя.' : 'The highest card takes every revealed card to the bottom of the winner’s pile.'}</li>
      <li>{ru ? 'Если старшие карты равны, начинается спор: кладётся одна закрытая и одна открытая карта.' : 'Tied high cards start a war: place one card face down and another face up.'}</li>
      <li>{ru ? 'Побеждает последний участник, собравший всю колоду.' : 'The last player holding the full deck wins.'}</li>
    </ol>
  </>;
}
