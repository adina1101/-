import { Link } from 'wouter';
import { useApp } from '../lib/app-context';
import type { DurakCardError } from '../lib/multiplayer-durak-engine';

export function InvalidMoveDialog({ reason, onClose }: { reason: DurakCardError; onClose: () => void }) {
  const { language } = useApp();
  const text = language === 'ru' ? {
    title: 'Так ходить нельзя',
    description: 'Эта карта не подходит для текущего хода. Попробуйте другую карту или проверьте правила игры.',
    close: 'Выбрать другую',
    rules: 'Открыть правила',
  } : {
    title: 'That move is not allowed',
    description: 'This card cannot be played now. Try another card or check the game rules.',
    close: 'Choose another',
    rules: 'Open rules',
  };
  const reasonText = language === 'ru' ? {
    finished: 'Партия уже завершена.',
    'no-attack': 'Сейчас на столе нет карты, которую нужно отбить.',
    'cannot-beat': 'Эта карта не бьёт атакующую: нужна старшая карта той же масти или козырь.',
    'wait-defense': 'Сначала защитник должен отбить уже лежащую карту.',
    'attack-limit': 'Достигнут максимальный размер атаки в этом раунде.',
    'rank-mismatch': 'Подкидывать можно только достоинства, которые уже есть на столе.',
  } : {
    finished: 'The match has already ended.',
    'no-attack': 'There is no attacking card to beat right now.',
    'cannot-beat': 'This card cannot beat the attack. Use a higher card of the same suit or a trump.',
    'wait-defense': 'Wait until the defender beats the card already on the table.',
    'attack-limit': 'The attack limit for this round has been reached.',
    'rank-mismatch': 'You may only throw a rank that is already on the table.',
  };

  return (
    <div className="dialog-backdrop invalid-move-backdrop" onMouseDown={onClose}>
      <section className="invalid-move-dialog" onMouseDown={(event) => event.stopPropagation()}>
        <span className="invalid-move-icon">!</span>
        <h2>{text.title}</h2>
        <p>{reasonText[reason] ?? text.description}</p>
        <div className="invalid-move-actions">
          <button onClick={onClose}>{text.close}</button>
          <Link href="/rules/durak" onClick={onClose}>{text.rules}</Link>
        </div>
      </section>
    </div>
  );
}
