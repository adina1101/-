import { useLocation } from 'wouter';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { DurakRulesCopy } from '../components/DurakRulesCopy';
import { WarRulesCopy } from '../components/WarRulesCopy';
import { GameRulesCopy } from '../components/GameRulesCopy';
import { useApp } from '../lib/app-context';
import { games } from '../lib/games';
import { gameRules } from '../lib/game-rules';

export function GameDetailPage({ id }: { id: string }) {
  const [, navigate] = useLocation();
  const { language, favorites, toggleFavorite, t } = useApp();
  const game = games.find((item) => item.id === id);
  if (!game) return <div className="screen"><PageHeader title="Игра не найдена" back="/rules" /></div>;
  const name = language === 'ru' ? game.nameRu : game.nameEn;
  const description = language === 'ru' ? game.descriptionRu : game.descriptionEn;
  const favorite = favorites.includes(game.id);
  const isDurak = game.id === 'durak' || game.id === 'transfer-durak';
  const rules = gameRules[game.id];
  const deck = isDurak || game.id === 'war' ? (language === 'ru' ? '36 / 52 карты' : '36 / 52 cards') : rules?.deck[language];
  return (
    <div className="screen detail-screen">
      <PageHeader title={name} subtitle={`${game.players} ${t('players')}`} back="/rules" />
      <section className="detail-hero">
        <div className="large-card">{game.icon}<small>A</small></div>
        <button className={favorite ? 'favorite active' : 'favorite'} onClick={() => toggleFavorite(game.id)}>♥</button>
      </section>
      <p className="detail-description">{description}</p>
      <section className="fact-grid">
        <article><span>♟</span><small>{t('players')}</small><strong>{game.players}</strong></article>
        <article><span>▤</span><small>{language === 'ru' ? 'Колода' : 'Deck'}</small><strong>{deck}</strong></article>
        <article><span>◆</span><small>Сложность</small><strong>{'●'.repeat(game.difficulty)}{'○'.repeat(3 - game.difficulty)}</strong></article>
      </section>
      <section className="rules-copy">
        {isDurak ? <DurakRulesCopy transfer={game.id === 'transfer-durak'} />
          : game.id === 'war' ? <WarRulesCopy />
            : rules && <GameRulesCopy rules={rules} />}
      </section>
      <button className="primary-button sticky-play" onClick={() => {
        sessionStorage.setItem('cardverse-selected-game', game.id);
        navigate('/play');
      }}>{t('play')} <Icon name="play" /></button>
    </div>
  );
}
