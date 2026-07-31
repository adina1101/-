import { Link } from 'wouter';
import type { Game } from '../lib/types';
import { useApp } from '../lib/app-context';

export function GameCard({ game }: { game: Game }) {
  const { language, t } = useApp();
  const name = language === 'ru' ? game.nameRu : game.nameEn;
  const difficulty = [t('easy'), t('medium'), t('hard')][game.difficulty - 1];

  return (
    <Link href={`/rules/${game.id}`} className="game-card">
      <div className={`game-symbol suit-${game.icon === '♥' || game.icon === '♦' ? 'red' : 'black'}`}>
        {game.icon}<small>{game.icon}</small>
      </div>
      <div className="game-info">
        <h3>{name}</h3>
        <p>{game.players} {t('players')}</p>
        <span className={`difficulty d${game.difficulty}`}>{difficulty}</span>
      </div>
    </Link>
  );
}
