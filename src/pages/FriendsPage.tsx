import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../lib/app-context';

interface Person {
  id: string;
  name: string;
  level: number;
  status: string;
  initial: string;
  color: string;
}

const initialFriends: Person[] = [
  { id: 'miras', name: 'Miras', level: 18, status: 'В игре', initial: 'М', color: 'orange' },
  { id: 'sofia', name: 'Sofia', level: 14, status: 'Онлайн', initial: 'С', color: 'purple' },
  { id: 'timur', name: 'Timur', level: 11, status: 'Онлайн', initial: 'Т', color: 'blue' },
  { id: 'alex', name: 'Alex', level: 20, status: '2 ч. назад', initial: 'A', color: 'green' },
];

const initialRequests: Person[] = [
  { id: 'dana', name: 'Dana', level: 9, status: 'Хочет дружить', initial: 'Д', color: 'purple' },
  { id: 'arsen', name: 'Arsen', level: 16, status: 'Хочет дружить', initial: 'А', color: 'blue' },
];

export function FriendsPage() {
  const { t, language } = useApp();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<'friends' | 'requests'>('friends');
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState(initialFriends);
  const [requests, setRequests] = useState(initialRequests);
  const source = tab === 'friends' ? friends : requests;
  const visible = useMemo(() => source.filter((person) =>
    person.name.toLowerCase().includes(query.trim().toLowerCase())), [query, source]);
  const copy = language === 'ru'
    ? { accept: 'Принять', decline: 'Отклонить', empty: 'Ничего не найдено' }
    : { accept: 'Accept', decline: 'Decline', empty: 'Nothing found' };

  const invite = (person: Person) => {
    sessionStorage.setItem('cardix-invited-friend', person.name);
    navigate('/play/online');
  };

  const accept = (person: Person) => {
    setRequests((current) => current.filter((item) => item.id !== person.id));
    setFriends((current) => current.some((item) => item.id === person.id)
      ? current : [...current, { ...person, status: language === 'ru' ? 'Онлайн' : 'Online' }]);
  };

  const decline = (id: string) => {
    setRequests((current) => current.filter((person) => person.id !== id));
  };

  return (
    <div className="screen">
      <PageHeader title={t('friends')} subtitle={`${friends.length} ${t('friends').toLowerCase()}`} />
      <label className="search-box"><Icon name="search" /><input value={query}
        onChange={(event) => setQuery(event.target.value)} placeholder={t('searchFriend')} /></label>
      <div className="friend-tabs">
        <button type="button" className={tab === 'friends' ? 'active' : ''} onClick={() => setTab('friends')}>{t('friends')}</button>
        <button type="button" className={tab === 'requests' ? 'active' : ''} onClick={() => setTab('requests')}>
          {t('requests')} {requests.length > 0 && <b>{requests.length}</b>}
        </button>
      </div>
      <div className="section-heading"><h2>{tab === 'friends' ? t('onlineNow') : t('requests')}</h2><span>{visible.length}</span></div>
      <section className="friend-list">
        {visible.map((person) => (
          <article className="friend-row" key={person.id}>
            <div className={`friend-initial ${person.color}`}>{person.initial}<i /></div>
            <div><h3>{person.name}</h3><p>{t('level')} {person.level} · {person.status}</p></div>
            {tab === 'friends'
              ? <button type="button" onClick={() => invite(person)}>{t('invite')}</button>
              : <div className="request-actions">
                <button type="button" onClick={() => accept(person)}>{copy.accept}</button>
                <button type="button" className="decline" onClick={() => decline(person.id)} aria-label={`${copy.decline}: ${person.name}`}>×</button>
              </div>}
          </article>
        ))}
        {visible.length === 0 && <p className="friends-empty">{copy.empty}</p>}
      </section>
    </div>
  );
}
