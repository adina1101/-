import { useLocation } from 'wouter';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { DurakRulesCopy } from '../components/DurakRulesCopy';
import { WarRulesCopy } from '../components/WarRulesCopy';
import { useApp } from '../lib/app-context';
import { games } from '../lib/games';

export function GameDetailPage({ id }: { id: string }) {
  const [, navigate] = useLocation();
  const { language, favorites, toggleFavorite, t } = useApp();
  const game = games.find((item) => item.id === id);
  if (!game) return <div className="screen"><PageHeader title="Игра не найдена" back="/rules" /></div>;
  const name = language === 'ru' ? game.nameRu : game.nameEn;
  const description = language === 'ru' ? game.descriptionRu : game.descriptionEn;
  const favorite = favorites.includes(game.id);
  const isDurak = game.id === 'durak' || game.id === 'transfer-durak';
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
        <article><span>▤</span><small>Колода</small><strong>36 / 52</strong></article>
        <article><span>◆</span><small>Сложность</small><strong>{'●'.repeat(game.difficulty)}{'○'.repeat(3 - game.difficulty)}</strong></article>
      </section>
      <section className="rules-copy">
        {isDurak ? <DurakRulesCopy transfer={game.id === 'transfer-durak'} /> : game.id === 'war' ? <WarRulesCopy /> : <>
          <h2>{t('goal')}</h2><p>Выполните цель партии раньше соперников.</p>
          <h2>{t('preparation')}</h2><p>Подготовьте колоду и раздайте карты согласно правилам выбранной игры.</p>
          <h2>{t('rules')}</h2><p>Полный игровой движок для этой игры находится в разработке.</p>
        </>}
      </section>
      <button className="primary-button sticky-play" onClick={() => {
        sessionStorage.setItem('cardverse-selected-game', game.id);
        navigate('/play');
      }}>{t('play')} <Icon name="play" /></button>
    </div>
  );
}
