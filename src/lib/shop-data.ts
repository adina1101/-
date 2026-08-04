export type ShopCategory = 'cards' | 'tables' | 'boosters' | 'tokens';
export type ShopSlot = 'deck';

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  price: number;
  art: string;
  image?: string;
  backColor?: string;
  colors: [string, string];
  future?: boolean;
  slot?: ShopSlot;
}

export const shopItems: ShopItem[] = [
  { id: 'cards-noir', category: 'cards', name: 'Колода Нуар', description: 'Минималистичная рубашка CARDIX', price: 180, art: '♠', colors: ['#f21f2d', '#090b18'], slot: 'deck' },
  { id: 'cards-diamond', category: 'cards', name: 'Красный бриллиант', description: 'Геометрическая премиальная колода', price: 260, art: '♦', colors: ['#ffffff', '#c60d1a'], slot: 'deck' },
  { id: 'cards-dice-diamonds', category: 'cards', name: 'Кости и бубны', description: 'Бело-синяя колода с игровыми кубиками', price: 190, art: '10♦', image: '/assets/shop/dice-diamonds-card.jpg', backColor: '#1264c7', colors: ['#49aaf2', '#101d38'], slot: 'deck' },
  { id: 'cards-mechanical-ace', category: 'cards', name: 'Механический туз', description: 'Колода с объёмным синим орнаментом', price: 260, art: 'A♠', image: '/assets/shop/mechanical-ace-card.jpg', backColor: '#1264c7', colors: ['#6174c9', '#131943'], slot: 'deck' },
  { id: 'cards-neon-ace', category: 'cards', name: 'Неоновый туз', description: 'Чёрная колода с голубым свечением', price: 320, art: 'A♠', image: '/assets/shop/neon-ace-card.jpg', colors: ['#35e7ff', '#02050a'], slot: 'deck' },
  { id: 'cards-vintage-spades', category: 'cards', name: 'Винтажные пики', description: 'Светлая колода с синими мастями', price: 230, art: '9♠', image: '/assets/shop/vintage-spades-card.jpg', colors: ['#f1ead8', '#344873'], slot: 'deck' },
  { id: 'cards-royal-blood', category: 'cards', name: 'Королевская кровь', description: 'Бордовая колода с серебряной окантовкой', price: 360, art: 'A♦', image: '/assets/shop/royal-blood-card.jpg', colors: ['#c9c9c9', '#4a0707'], slot: 'deck' },
  { id: 'table-velvet', category: 'tables', name: 'Красный бархат', description: 'Роскошная тема игрового стола', price: 320, art: '◆', colors: ['#a50916', '#22050a'] },
  { id: 'table-midnight', category: 'tables', name: 'Полуночный клуб', description: 'Тёмно-синий стол с мягким свечением', price: 280, art: '♣', colors: ['#272e54', '#030511'] },
  { id: 'boost-xp', category: 'boosters', name: 'Усилитель опыта', description: 'Двойной опыт на следующие 24 часа', price: 100, art: '2×', colors: ['#ff8b28', '#5a1d06'] },
  { id: 'tokens-small', category: 'tokens', name: 'Набор жетонов S', description: 'Зарезервировано для будущих наград', price: 0, art: '◆', colors: ['#ffd36b', '#8c4f0b'], future: true },
];

export const shopCategories: Array<'all' | ShopCategory> = [
  'all', 'cards', 'tables', 'boosters', 'tokens',
];
