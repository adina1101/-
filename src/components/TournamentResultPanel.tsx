import { useLocation } from 'wouter';
import { useApp } from '../lib/app-context';
import { useEconomy } from '../lib/economy-context';
import { tournamentRatingDelta, tournamentStageName, type TournamentState } from '../lib/tournament-engine';

export function TournamentResultPanel({ tournament, onNext }: {
  tournament: TournamentState;
  onNext: () => void;
}) {
  const { language } = useApp();
  const { rating } = useEconomy();
  const [, navigate] = useLocation();
  const ru = language === 'ru';
  const last = tournament.rounds[tournament.rounds.length - 1];
  if (!last) return <section className="tournament-result"><strong>{ru ? 'Подсчитываем рейтинг…' : 'Updating rating…'}</strong></section>;
  const delta = tournamentRatingDelta(last.won);
  return <section className="tournament-result">
    <small>{tournament.title} · {tournamentStageName(last.stage, ru)}</small>
    <strong className={last?.won ? 'won' : 'lost'}>{last?.won ? (ru ? 'Победа' : 'Victory') : (ru ? 'Поражение' : 'Defeat')}</strong>
    <div className="rating-change"><small>{ru ? 'Твой рейтинг' : 'Your rating'}</small>
      <b>{rating}</b><em className={delta > 0 ? 'up' : 'down'}>{delta > 0 ? '+' : ''}{delta}</em></div>
    <div className="tournament-path">{[0, 1, 2].map((stage) => <span key={stage}
      className={stage < tournament.stage || tournament.rounds.some((round) => round.stage === stage && round.won)
        ? 'passed' : stage === tournament.stage ? 'current' : ''}>
      {tournamentStageName(stage, ru)}</span>)}</div>
    {tournament.status === 'awaiting-next' && <button className="action-primary" onClick={onNext}>
      {ru ? 'Следующий матч' : 'Next match'}</button>}
    {tournament.status === 'champion' && <><h3>{ru ? '🏆 Ты выиграл турнир!' : '🏆 Tournament champion!'}</h3>
      <strong className="tournament-prize">◆ +10 {ru ? 'жетонов' : 'tokens'}</strong>
      <button className="action-primary" onClick={() => navigate('/play/tournament')}>{ru ? 'Новый турнир' : 'New tournament'}</button></>}
    {tournament.status === 'eliminated' && <><p>{ru ? 'Ты выбыл из сетки. Можно начать новый турнир.' : 'You are out of the bracket. Start a new tournament.'}</p>
      <button className="action-primary" onClick={() => navigate('/play/tournament')}>{ru ? 'Вернуться' : 'Return'}</button></>}
  </section>;
}
