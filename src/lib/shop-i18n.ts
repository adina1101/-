import type { Language } from './types';
import type { ShopCategory, ShopItem } from './shop-data';

type Copy = { ru: string; en: string };
const copy = (ru: string, en: string): Copy => ({ ru, en });

const itemCopy: Record<string, { name: Copy; description: Copy }> = {
  'cards-noir': { name: copy('Колода Нуар', 'Noir Deck'), description: copy('Минималистичная рубашка CARDIX', 'Minimal CARDIX card back') },
  'cards-diamond': { name: copy('Красный бриллиант', 'Red Diamond'), description: copy('Геометрическая премиальная колода', 'Geometric premium deck') },
  'cards-dice-diamonds': { name: copy('Кости и бубны', 'Dice & Diamonds'), description: copy('Бело-синяя колода с игровыми кубиками', 'A blue and white deck with gaming dice') },
  'cards-mechanical-ace': { name: copy('Механический туз', 'Mechanical Ace'), description: copy('Колода с объёмным синим орнаментом', 'A deck with dimensional blue ornament') },
  'cards-neon-ace': { name: copy('Неоновый туз', 'Neon Ace'), description: copy('Чёрная колода с голубым свечением', 'A black deck with a cyan glow') },
  'cards-vintage-spades': { name: copy('Винтажные пики', 'Vintage Spades'), description: copy('Светлая колода с синими мастями', 'A light deck with hand-drawn blue suits') },
  'cards-royal-blood': { name: copy('Королевская кровь', 'Royal Blood'), description: copy('Бордовая колода с серебряной окантовкой', 'A burgundy deck with silver trim') },
  'table-velvet': { name: copy('Красный бархат', 'Red Velvet'), description: copy('Роскошная тема игрового стола', 'Luxury casino table theme') },
  'table-midnight': { name: copy('Полуночный клуб', 'Midnight Club'), description: copy('Тёмно-синий стол с мягким свечением', 'Deep navy table with a subtle glow') },
  'boost-xp': { name: copy('Усилитель опыта', 'XP Booster'), description: copy('Двойной опыт на следующие 24 часа', 'Double XP for the next 24 hours') },
  'tokens-small': { name: copy('Набор жетонов S', 'Token Pack S'), description: copy('Зарезервировано для будущих наград', 'Reserved for future rewards') },
};

export const shopCategoryCopy: Record<'all' | ShopCategory, Copy> = {
  all: copy('Все', 'All'),
  cards: copy('Колоды', 'Decks'),
  tables: copy('Столы', 'Tables'),
  boosters: copy('Усилители', 'Boosters'),
  tokens: copy('Жетоны', 'Token packs'),
};

const ui = {
  title: copy('Магазин', 'Shop'),
  subtitle: copy('Настройте игру под себя', 'Make CARDIX yours'),
  balance: copy('Ваш баланс', 'Your balance'),
  earn: copy('Зарабатывайте жетоны в играх и заданиях', 'Earn tokens by playing and completing missions'),
  comingSoon: copy('Скоро', 'Coming soon'),
  equipped: copy('Выбрано', 'Equipped'),
  equip: copy('Выбрать', 'Equip'),
  owned: copy('Куплено', 'Owned'),
  locked: copy('Закрыто', 'Locked'),
  buy: copy('Купить', 'Buy'),
  confirm: copy('Подтвердите покупку', 'Confirm purchase'),
  unlock: copy('Открыть навсегда?', 'Unlock permanently?'),
  alreadyOwned: copy('Этот предмет уже куплен', 'This item is already owned'),
  tokens: copy('жетонов', 'Tokens'),
  close: copy('Закрыть', 'Close'),
  unlocked: copy('Открыто!', 'Unlocked!'),
  yours: copy('теперь ваш', 'is now yours'),
  purchased: copy('Куплено', 'Owned'),
  free: copy('Бесплатно', 'Free'),
} as const;

export type ShopUiKey = keyof typeof ui;
export const shopText = (language: Language, key: ShopUiKey) => ui[key][language];
export const shopItemText = (item: ShopItem, language: Language) => {
  const translation = itemCopy[item.id];
  return translation ? {
    name: translation.name[language],
    description: translation.description[language],
  } : { name: item.name, description: item.description };
};
