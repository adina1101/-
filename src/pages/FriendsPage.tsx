import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../lib/app-context';
import { useAuth } from '../lib/auth-context';
import {
  acceptFriendRequest, loadFriends, removeFriendConnection, sendFriendRequest,
  type FriendConnection,
} from '../lib/friends';
import { useOnlineStatus } from '../lib/online-status';

export function FriendsPage() {
  const { t, language, profile } = useApp();
  const { user } = useAuth();
  const online = useOnlineStatus();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<'friends' | 'requests'>('friends');
  const [friends, setFriends] = useState<FriendConnection[]>([]);
  const [requests, setRequests] = useState<FriendConnection[]>([]);
  const [ownCode, setOwnCode] = useState('');
  const [targetCode, setTargetCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState('loading');
  const ru = language === 'ru';

  const refresh = useCallback(async () => {
    if (!user || !online) { setBusy(''); return; }
    setBusy('loading');
    try {
      const snapshot = await loadFriends(user.id, profile.nickname);
      setFriends(snapshot.friends); setRequests(snapshot.requests); setOwnCode(snapshot.ownCode);
    } catch { setMessage(ru ? 'Не удалось загрузить друзей' : 'Could not load friends'); }
    finally { setBusy(''); }
  }, [online, profile.nickname, ru, user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const run = async (id: string, action: () => Promise<void>) => {
    setBusy(id); setMessage('');
    try { await action(); await refresh(); }
    catch { setMessage(ru ? 'Не удалось выполнить действие' : 'Action failed'); setBusy(''); }
  };

  const send = async () => {
    if (targetCode.trim().length < 6) return;
    setBusy('send'); setMessage('');
    try {
      const result = await sendFriendRequest(targetCode);
      const resultCopy = ru ? {
        sent: 'Заявка отправлена', not_found: 'Пользователь с таким кодом не найден',
        self: 'Нельзя добавить самого себя', pending: 'Заявка уже существует',
        already_friends: 'Вы уже друзья',
      } : {
        sent: 'Request sent', not_found: 'No user found with this code', self: 'You cannot add yourself',
        pending: 'Request already exists', already_friends: 'You are already friends',
      };
      setMessage(resultCopy[result]);
      if (result === 'sent') { setTargetCode(''); await refresh(); }
    } catch { setMessage(ru ? 'Не удалось отправить заявку' : 'Could not send request'); }
    finally { setBusy(''); }
  };

  const invite = (friend: FriendConnection) => {
    sessionStorage.setItem('cardix-invited-friend', friend.nickname);
    navigate('/play/online');
  };
  const visible = tab === 'friends' ? friends : requests;

  return <div className="screen friends-screen">
    <PageHeader title={t('friends')} subtitle={`${friends.length} ${t('friends').toLowerCase()}`} />
    <section className="friend-code-card">
      <div><small>{ru ? 'Ваш код друга' : 'Your friend code'}</small><strong>{ownCode || '••••••••'}</strong></div>
      <button type="button" disabled={!ownCode} onClick={() => {
        void navigator.clipboard.writeText(ownCode)
          .then(() => setMessage(ru ? 'Код скопирован' : 'Code copied'))
          .catch(() => setMessage(ru ? 'Выделите и скопируйте код вручную' : 'Select and copy the code manually'));
      }}>{ru ? 'Копировать' : 'Copy'}</button>
    </section>
    <section className="friend-add-form">
      <label className="search-box"><Icon name="search" /><input maxLength={8} value={targetCode}
        onChange={(event) => setTargetCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
        placeholder={ru ? 'Введите код друга' : 'Enter friend code'} /></label>
      <button type="button" disabled={!online || busy === 'send' || targetCode.length < 6} onClick={() => void send()}>{t('addFriend')}</button>
    </section>
    {message && <p className="friends-message" role="status">{message}</p>}
    <div className="friend-tabs">
      <button type="button" className={tab === 'friends' ? 'active' : ''} onClick={() => { setTab('friends'); void refresh(); }}>{t('friends')}</button>
      <button type="button" className={tab === 'requests' ? 'active' : ''} onClick={() => { setTab('requests'); void refresh(); }}>
        {t('requests')} {requests.length > 0 && <b>{requests.length}</b>}
      </button>
    </div>
    <section className="friend-list">
      {visible.map((person) => <article className="friend-row" key={person.requestId}>
        <div className="friend-initial purple">{person.nickname.slice(0, 1).toUpperCase()}<i /></div>
        <div><h3>{person.nickname}</h3><p>{person.direction === 'outgoing'
          ? (ru ? 'Заявка отправлена' : 'Request sent') : `CARDIX · ${person.code}`}</p></div>
        {person.direction === 'friend' ? <div className="request-actions">
          <button type="button" onClick={() => invite(person)}>{t('invite')}</button>
          <button type="button" className="decline" disabled={busy === person.requestId}
            aria-label={ru ? `Удалить ${person.nickname} из друзей` : `Remove ${person.nickname}`}
            onClick={() => void run(person.requestId, () => removeFriendConnection(person.requestId))}>×</button>
        </div> : person.direction === 'incoming' ? <div className="request-actions">
          <button type="button" disabled={busy === person.requestId}
            onClick={() => void run(person.requestId, () => acceptFriendRequest(person.requestId))}>{ru ? 'Принять' : 'Accept'}</button>
          <button type="button" className="decline" disabled={busy === person.requestId}
            aria-label={ru ? `Отклонить заявку ${person.nickname}` : `Decline ${person.nickname}`}
            onClick={() => void run(person.requestId, () => removeFriendConnection(person.requestId))}>×</button>
        </div> : <button type="button" disabled={busy === person.requestId}
          onClick={() => void run(person.requestId, () => removeFriendConnection(person.requestId))}>{ru ? 'Отменить' : 'Cancel'}</button>}
      </article>)}
      {busy === 'loading' && <p className="friends-empty">{ru ? 'Загрузка…' : 'Loading…'}</p>}
      {!online && <p className="friends-empty">{ru ? 'Для друзей нужен интернет' : 'Friends require an internet connection'}</p>}
      {!busy && online && visible.length === 0 && <p className="friends-empty">{tab === 'friends'
        ? (ru ? 'Здесь появятся настоящие друзья' : 'Your real friends will appear here')
        : (ru ? 'Новых заявок нет' : 'No new requests')}</p>}
    </section>
  </div>;
}
