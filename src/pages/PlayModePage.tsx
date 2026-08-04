import { useState } from 'react';
import { useLocation } from 'wouter';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../lib/app-context';
import { games } from '../lib/games';
import { createTournament } from '../lib/tournament-engine';

type Mode = 'ai' | 'online' | 'local' | 'tournament' | 'practice';

const copy = {
  ru: {
    ai: ['Против ИИ', 'Выбери сложность соперников'],
    online: ['Онлайн', 'Найди соперников или создай комнату'],
    local: ['На одном устройстве', 'Настрой локальную партию'],
    tournament: ['Турниры', 'Выбери соревнование'],
    practice: ['Практический режим', 'Тренируйся без потери жетонов'],
    game: 'Игра', players: 'Количество участников', difficulty: 'Сложность',
    deck: 'Количество карт в колоде', cards: 'карт',
    mode: 'Режим', start: 'Начать игру', searching: 'Ищем игроков…',
    ready: 'Всё готово!', cancel: 'Отменить', code: 'Код комнаты',
    continue: 'Продолжить', people: 'участника',
  },
  en: {
    ai: ['Play vs AI', 'Choose the opponents’ difficulty'],
    online: ['Online', 'Find opponents or create a room'],
    local: ['Local multiplayer', 'Set up a local match'],
    tournament: ['Tournaments', 'Choose a competition'],
    practice: ['Practice mode', 'Train without losing tokens'],
    game: 'Game', players: 'Number of players', difficulty: 'Difficulty',
    deck: 'Cards in deck', cards: 'cards',
    mode: 'Mode', start: 'Start game', searching: 'Finding players…',
    ready: 'All set!', cancel: 'Cancel', code: 'Room code',
    continue: 'Continue', people: 'players',
  },
} as const;

const modeOptions: Record<Mode, string[]> = {
  ai: ['Легко', 'Средне', 'Сложно', 'Эксперт'],
  online: ['Быстрый матч', 'Случайные соперники', 'Создать комнату', 'Войти по коду'],
  local: [],
  tournament: ['Ежедневный турнир', 'Недельная лига', 'Кубок CARDIX'],
  practice: ['Легко', 'Средне', 'Сложно', 'Эксперт'],
};

function getMaxPlayers(range: string) {
  const values = range.match(/\d+/g)?.map(Number) ?? [6];
  return Math.min(6, Math.max(...values));
}

export function PlayModePage({ mode }: { mode: string }) {
  const { language } = useApp();
  const [, navigate] = useLocation();
  const validMode: Mode = ['ai', 'online', 'local', 'tournament', 'practice'].includes(mode) ? mode as Mode : 'ai';
  const text = copy[language];
  const invitedFriend = validMode === 'online' ? sessionStorage.getItem('cardix-invited-friend') : null;
  const [choice, setChoice] = useState(modeOptions[validMode][0] ?? '');
  const [playerCount, setPlayerCount] = useState(() => {
    const selected = sessionStorage.getItem('cardverse-selected-game');
    return games.find((game) => game.id === selected)?.players === '1' ? 1 : 2;
  });
  const [gameId, setGameId] = useState(() => {
    const selected = sessionStorage.getItem('cardverse-selected-game');
    return games.some((game) => game.id === selected) ? selected! : 'durak';
  });
  const [deckSize, setDeckSize] = useState<36 | 52>(36);
  const [roomCode, setRoomCode] = useState('');
  const [status, setStatus] = useState<'setup' | 'searching' | 'ready'>('setup');
  const selectedGame = games.find((game) => game.id === gameId) ?? games[0];
  const singlePlayer = selectedGame.players === '1';
  const playerCounts = [2, 3, 4, 5, 6].filter((count) => count <= getMaxPlayers(selectedGame.players));
  const isJoinByCode = validMode === 'online' && choice === 'Войти по коду';
  const hasPlayerChoice = validMode !== 'tournament';

  const start = () => {
    const matchPlayerCount = validMode === 'tournament' ? 2 : playerCount;
    sessionStorage.setItem('cardverse-session', JSON.stringify({
      gameId, mode: validMode, choice, playerCount: matchPlayerCount, deckSize, invitedFriend,
    }));
    if (validMode === 'tournament') createTournament(choice, gameId);
    if (invitedFriend) sessionStorage.removeItem('cardix-invited-friend');
    setStatus(validMode === 'online' ? 'searching' : 'ready');
    if (validMode === 'online') window.setTimeout(() => setStatus('ready'), 1300);
  };

  if (status !== 'setup') {
    const game = games.find((item) => item.id === gameId);
    return (
      <div className="screen match-status">
        <div className={status === 'searching' ? 'status-orbit spinning' : 'status-orbit'}>
          {status === 'ready' ? '✓' : '♠'}
        </div>
        <h1>{status === 'ready' ? text.ready : text.searching}</h1>
        <p>{game?.[language === 'ru' ? 'nameRu' : 'nameEn']} · {validMode === 'tournament' ? `8 ${text.people}` : `${playerCount} ${text.people}`}</p>
        {status === 'ready' && <div className="players-preview">
          {Array.from({ length: validMode === 'tournament' ? 8 : playerCount }, (_, index) => <span key={index}>{index === 0 ? 'A' : validMode === 'ai' || validMode === 'practice' || validMode === 'tournament' ? 'AI' : index + 1}</span>)}
        </div>}
        <button className="primary-button" onClick={() => status === 'ready'
          ? navigate(validMode === 'local' ? '/local-game' : '/game') : setStatus('setup')}>
          {status === 'ready' ? text.start : text.cancel}
        </button>
      </div>
    );
  }

  return (
    <div className="screen setup-screen">
      <PageHeader title={text[validMode][0]} subtitle={text[validMode][1]} back="/play" />
      {invitedFriend && <div className="invited-friend-banner">
        <Icon name="check" />
        <span>{language === 'ru' ? `Приглашение для ${invitedFriend} готово` : `Invitation for ${invitedFriend} is ready`}</span>
        <button type="button" onClick={() => {
          sessionStorage.removeItem('cardix-invited-friend');
          navigate('/friends');
        }}>×</button>
      </div>}
      <h2 className="setup-label">{text.game}</h2>
      <select className="game-select" value={gameId} onChange={(event) => {
        const nextGame = games.find((game) => game.id === event.target.value);
        setGameId(event.target.value);
        if (nextGame?.players === '1') setPlayerCount(1);
        else if (nextGame) setPlayerCount((current) => Math.min(Math.max(2, current), getMaxPlayers(nextGame.players)));
        sessionStorage.setItem('cardverse-selected-game', event.target.value);
      }}>
        {games.map((game) => <option key={game.id} value={game.id}>{language === 'ru' ? game.nameRu : game.nameEn}</option>)}
      </select>

      <h2 className="setup-label">{text.deck}</h2>
      <div className="player-count-picker deck-size-picker">
        {([36, 52] as const).map((size) => <button type="button" key={size}
          className={deckSize === size ? 'active' : ''} onClick={() => setDeckSize(size)}>
          <strong>{size}</strong><small>{text.cards}</small>
        </button>)}
      </div>

      {hasPlayerChoice && !singlePlayer && <><h2 className="setup-label">{text.players}</h2>
        <div className="player-count-picker">
          {playerCounts.map((count) => <button key={count} className={playerCount === count ? 'active' : ''}
            onClick={() => setPlayerCount(count)}><strong>{count}</strong><small>{language === 'ru' ? 'игр.' : 'pl.'}</small></button>)}
        </div></>}

      {modeOptions[validMode].length > 0 && <><h2 className="setup-label">{validMode === 'ai' || validMode === 'practice' ? text.difficulty : text.mode}</h2>
        <div className="choice-list">{modeOptions[validMode].map((option) => <button key={option}
          className={choice === option ? 'choice active' : 'choice'} onClick={() => setChoice(option)}>
          <span>{option}</span>{choice === option && <Icon name="check" />}
        </button>)}</div></>}

      {isJoinByCode && <label className="code-field"><span>{text.code}</span><input maxLength={6}
        value={roomCode} onChange={(event) => setRoomCode(event.target.value.toUpperCase())} placeholder="ABC123" /></label>}
      <button className="primary-button start-match" disabled={isJoinByCode && roomCode.length < 4} onClick={start}>
        {validMode === 'online' ? text.continue : text.start} <Icon name="play" />
      </button>
    </div>
  );
}
