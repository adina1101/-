import { useState } from 'react';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../lib/app-context';

const people = [
  { name: 'Miras', level: 18, status: 'В игре', avatar: 'М', color: 'orange' },
  { name: 'Sofia', level: 14, status: 'Онлайн', avatar: 'С', color: 'purple' },
  { name: 'Timur', level: 11, status: 'Онлайн', avatar: 'Т', color: 'blue' },
  { name: 'Alex', level: 20, status: '2 ч. назад', avatar: 'A', color: 'green' },
];

export function FriendsPage() {
  const { t } = useApp();
  const [query, setQuery] = useState('');
  const visible = people.filter((person) => person.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="screen">
      <PageHeader title={t('friends')} subtitle={`${people.length} ${t('friends').toLowerCase()}`} />
      <label className="search-box"><Icon name="search" /><input value={query}
        onChange={(event) => setQuery(event.target.value)} placeholder={t('searchFriend')} /></label>
      <div className="friend-tabs"><button className="active">{t('friends')}</button><button>{t('requests')} <b>2</b></button></div>
      <div className="section-heading"><h2>{t('onlineNow')}</h2><span>3</span></div>
      <section className="friend-list">
        {visible.map((person) => (
          <article className="friend-row" key={person.name}>
            <div className={`friend-avatar ${person.color}`}>{person.avatar}<i /></div>
            <div><h3>{person.name}</h3><p>{t('level')} {person.level} · {person.status}</p></div>
            <button>{t('invite')}</button>
          </article>
        ))}
      </section>
    </div>
  );
}
