import type { Game } from './types';

const game = (
  id: string, nameRu: string, nameEn: string, category: Game['category'],
  icon: string, players: string, difficulty: Game['difficulty'],
): Game => ({
  id, nameRu, nameEn, category, icon, players, difficulty,
  descriptionRu: `Классическая карточная игра «${nameRu}» с понятными правилами и глубокой стратегией.`,
  descriptionEn: `A classic game of ${nameEn} with simple rules and deep strategy.`,
});

export const games: Game[] = [
  game('durak', 'Дурак подкидной', 'Throw-in Durak', 'popular', '♠', '2–6', 1),
  game('transfer-durak', 'Дурак переводной', 'Transfer Durak', 'popular', '♦', '2–6', 2),
  game('war', 'Пьяница', 'War', 'popular', '♥', '2–4', 1),
  game('thousand', 'Тысяча', 'Thousand', 'popular', '♣', '2–4', 3),
  game('bura', 'Бура', 'Bura', 'popular', '♠', '2–3', 2),
  game('twenty-one', 'Двадцать одно', 'Twenty One', 'popular', '♦', '2–6', 1),
  game('ochko', 'Очко', 'Ochko', 'popular', '♥', '2–6', 1),
  game('kozel', 'Козёл', 'Kozel', 'popular', '♣', '2–4', 2),
  game('terz', 'Терц', 'Terz', 'popular', '♠', '2–4', 2),
  game('seven', 'Семёрка', 'Seven', 'popular', '♦', '2–6', 1),
  game('nine', 'Девятка', 'Nine', 'popular', '♥', '2–6', 1),
  game('holdem', 'Техасский холдем', "Texas Hold'em", 'poker', '♣', '2–9', 3),
  game('omaha', 'Омаха', 'Omaha', 'poker', '♠', '2–9', 3),
  game('five-draw', 'Пятикарточный дро', 'Five Card Draw', 'poker', '♦', '2–6', 2),
  game('five-stud', 'Пятикарточный стад', 'Five Card Stud', 'poker', '♥', '2–8', 3),
  game('chinese', 'Китайский покер', 'Chinese Poker', 'poker', '♣', '2–4', 3),
  game('short-deck', 'Короткая колода', 'Short Deck', 'poker', '♠', '2–9', 3),
  game('blackjack', 'Блэкджек', 'Blackjack', 'casino', '♦', '1–7', 1),
  game('baccarat', 'Баккара', 'Baccarat', 'casino', '♥', '2–14', 2),
  game('casino', 'Казино', 'Casino', 'casino', '♣', '2–4', 2),
  game('casino-war', 'Война казино', 'Casino War', 'casino', '♠', '2–8', 1),
  game('red-dog', 'Красная собака', 'Red Dog', 'casino', '♦', '2–8', 2),
  ...['Klondike', 'Spider', 'FreeCell', 'Pyramid', 'Yukon', 'Scorpion', 'Golf',
    'Forty Thieves', 'Canfield', 'Clock Solitaire'].map((name, index) =>
    game(name.toLowerCase().replace(/ /g, '-'), name, name, 'solitaire',
      ['♥', '♣', '♦', '♠'][index % 4], '1', (index % 3 + 1) as 1 | 2 | 3)),
];
