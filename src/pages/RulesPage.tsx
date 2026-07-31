import { useMemo, useState } from 'react';
import { GameCard } from '../components/GameCard';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../lib/app-context';
import { games } from '../lib/games';
import type { GameCategory } from '../lib/types';

export function RulesPage() {
  const { language, t } = useApp();
  const [category, setCategory] = useState<GameCategory>('popular');
  const [query, setQuery] = useState('');
  const categories: GameCategory[] = ['popular', 'poker', 'casino', 'solitaire'];
  const shownGames = useMemo(() => games.filter((game) => {
    const name = language === 'ru' ? game.nameRu : game.nameEn;
    return game.category === category && name.toLowerCase().includes(query.toLowerCase());
  }), [category, language, query]);

  return (
    <div className="screen">
      <PageHeader title={t('games')} subtitle={`${games.length} ${t('games').toLowerCase()}`} />
      <label className="search-box"><Icon name="search" /><input value={query}
        onChange={(event) => setQuery(event.target.value)} placeholder={t('searchGame')} /></label>
      <div className="category-tabs">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)}
          className={category === item ? 'active' : ''}>{t(item)}</button>)}
      </div>
      <div className="game-grid">{shownGames.map((item) => <GameCard key={item.id} game={item} />)}</div>
    </div>
  );
}
