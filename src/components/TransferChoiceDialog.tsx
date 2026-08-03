import type { PlayingCard } from '../lib/card-engine';
import { useApp } from '../lib/app-context';
import { PlayingCardView } from './PlayingCardView';

export function TransferChoiceDialog({ card, onDefend, onTransfer, onCancel }: {
  card: PlayingCard;
  onDefend: () => void;
  onTransfer: () => void;
  onCancel: () => void;
}) {
  const { language } = useApp();
  const ru = language === 'ru';
  return <div className="dialog-backdrop transfer-choice-backdrop" onMouseDown={onCancel}>
    <section className="transfer-choice-dialog" onMouseDown={(event) => event.stopPropagation()}>
      <h2>{ru ? 'Как сыграть эту карту?' : 'How do you want to play this card?'}</h2>
      <p>{ru
        ? 'Карта может и отбить атаку, и перевести её следующему игроку.'
        : 'This card can beat the attack or transfer it to the next player.'}</p>
      <PlayingCardView card={card} small disabled />
      <div className="transfer-choice-actions">
        <button className="action-secondary" onClick={onDefend}>{ru ? 'Отбить' : 'Beat'}</button>
        <button className="action-primary" onClick={onTransfer}>{ru ? 'Перевести' : 'Transfer'}</button>
      </div>
      <button className="transfer-choice-cancel" onClick={onCancel}>{ru ? 'Отмена' : 'Cancel'}</button>
    </section>
  </div>;
}
