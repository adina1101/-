import type { Language } from './types';

const dictionary = {
  ru: {
    rules: 'Правила', play: 'Играть', friends: 'Друзья', profile: 'Профиль',
    settings: 'Настройки', shop: 'Магазин', casinoNav: 'Казино', greeting: 'Добрый вечер', heroTitle: 'Твоя следующая партия',
    heroText: 'Быстрый матч с игроком твоего уровня', findGame: 'Найти игру',
    online: 'онлайн', dailyMissions: 'Миссии дня', seeAll: 'Все', games: 'Игры',
    searchGame: 'Найти игру', popular: 'Популярные', poker: 'Покер', casino: 'Казино',
    solitaire: 'Пасьянсы', players: 'игроков', easy: 'Легко', medium: 'Средне',
    hard: 'Сложно', gameModes: 'Выбери режим', ai: 'Против ИИ',
    aiText: 'Тренируйся в своём темпе', onlineGame: 'Онлайн',
    onlineText: 'Игроки со всего мира', local: 'На одном устройстве',
    localText: 'Передавайте телефон', tournament: 'Турниры', tournamentText: 'Соревнуйся за место в лиге',
    appearance: 'Внешний вид', darkTheme: 'Тёмная тема', language: 'Язык',
    sound: 'Звуки', music: 'Музыка', animations: 'Анимации', notifications: 'Уведомления',
    account: 'Аккаунт', support: 'Поддержка', privacy: 'Конфиденциальность',
    logout: 'Выйти', wins: 'Победы', gamesPlayed: 'Игр', winRate: 'Винрейт',
    achievements: 'Достижения', recentMatches: 'Последние матчи', level: 'Уровень',
    addFriend: 'Добавить', searchFriend: 'Найти по имени', onlineNow: 'Сейчас онлайн',
    requests: 'Заявки', invite: 'В игру', history: 'История', goal: 'Цель',
    preparation: 'Подготовка', tips: 'Советы', favorite: 'В избранное',
  },
  en: {
    rules: 'Rules', play: 'Play', friends: 'Friends', profile: 'Profile',
    settings: 'Settings', shop: 'Shop', casinoNav: 'Casino', greeting: 'Good evening', heroTitle: 'Your next match',
    heroText: 'A quick match with a player at your level', findGame: 'Find a game',
    online: 'online', dailyMissions: 'Daily missions', seeAll: 'See all', games: 'Games',
    searchGame: 'Search games', popular: 'Popular', poker: 'Poker', casino: 'Casino',
    solitaire: 'Solitaire', players: 'players', easy: 'Easy', medium: 'Medium',
    hard: 'Hard', gameModes: 'Choose a mode', ai: 'Play vs AI',
    aiText: 'Practice at your own pace', onlineGame: 'Online',
    onlineText: 'Players from around the world', local: 'Local multiplayer',
    localText: 'Pass the phone', tournament: 'Tournaments', tournamentText: 'Compete for a league place',
    appearance: 'Appearance', darkTheme: 'Dark theme', language: 'Language',
    sound: 'Sound', music: 'Music', animations: 'Animations', notifications: 'Notifications',
    account: 'Account', support: 'Support', privacy: 'Privacy', logout: 'Log out',
    wins: 'Wins', gamesPlayed: 'Games', winRate: 'Win rate', achievements: 'Achievements',
    recentMatches: 'Recent matches', level: 'Level', addFriend: 'Add',
    searchFriend: 'Search by username', onlineNow: 'Online now', requests: 'Requests',
    invite: 'Invite', history: 'History', goal: 'Goal', preparation: 'Preparation',
    tips: 'Tips', favorite: 'Favorite',
  },
} as const;

export type TranslationKey = keyof typeof dictionary.ru;
export const translate = (language: Language, key: TranslationKey) => dictionary[language][key];
