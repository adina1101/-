export type ShopCategory = 'avatar' | 'frames' | 'cards' | 'tables' | 'icons' | 'backgrounds' | 'boosters' | 'tokens';
export type AvatarSlot = 'frame' | 'head' | 'face' | 'outfit' | 'top' | 'bottom' | 'shoes' | 'background' | 'deck';

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  price: number;
  art: string;
  image?: string;
  colors: [string, string];
  future?: boolean;
  slot?: AvatarSlot;
  gender?: 'boy' | 'girl';
}

export const shopItems: ShopItem[] = [
  { id: 'avatar-crown', category: 'avatar', name: 'Корона чемпиона', description: 'Золотая корона для аватара', price: 140, art: '♛', colors: ['#ffd66b', '#7a3b08'], slot: 'head' },
  { id: 'avatar-cap', category: 'avatar', name: 'Кепка CARDIX', description: 'Красная игровая кепка', price: 90, art: '⌒', colors: ['#ff2635', '#560812'], slot: 'head' },
  { id: 'avatar-glasses', category: 'avatar', name: 'Очки профи', description: 'Стильные тёмные очки', price: 110, art: '∞', colors: ['#aab0c5', '#111421'], slot: 'face' },
  { id: 'avatar-mask-gold', category: 'avatar', name: 'Золотая маска', description: 'Редкая маска победителя', price: 240, art: '◆', colors: ['#ffd875', '#6e3c09'], slot: 'face' },
  { id: 'look-shadow-tank', category: 'avatar', name: 'Тёмный стрит', description: 'Чёрный топ и широкие тёмные джинсы', price: 180, art: '01', image: '/assets/shop/outfits/shadow-tank.png', colors: ['#24242b', '#090a0f'], slot: 'outfit', gender: 'girl' },
  { id: 'look-pink-07', category: 'avatar', name: 'Pink 07', description: 'Спортивная футболка и светлые широкие джинсы', price: 240, art: '07', image: '/assets/shop/outfits/pink-07.png', colors: ['#f45b96', '#24242c'], slot: 'outfit', gender: 'girl' },
  { id: 'look-cat-street', category: 'avatar', name: 'Cat Street', description: 'Белая футболка с котиком и чёрные джинсы', price: 210, art: 'CAT', image: '/assets/shop/outfits/cat-street.png', colors: ['#f7f5ef', '#17181d'], slot: 'outfit', gender: 'girl' },
  { id: 'look-plaid-layer', category: 'avatar', name: 'Клетчатый слой', description: 'Рубашка в клетку, кроп-топ и широкие джинсы', price: 260, art: '04', image: '/assets/shop/outfits/plaid-layer.png', colors: ['#4c5360', '#15171c'], slot: 'outfit', gender: 'girl' },
  { id: 'look-lace-cargo', category: 'avatar', name: 'Lace Cargo', description: 'Кружевная блуза и джинсы карго', price: 280, art: '05', image: '/assets/shop/outfits/lace-cargo.png', colors: ['#19191f', '#637189'], slot: 'outfit', gender: 'girl' },
  { id: 'look-varsity-33', category: 'avatar', name: 'Varsity 33', description: 'Спортивная футболка и выцветшие джинсы', price: 250, art: '33', image: '/assets/shop/outfits/varsity-33.png', colors: ['#f1efe9', '#566173'], slot: 'outfit' },
  { id: 'look-cocoa-stripe', category: 'avatar', name: 'Cocoa Stripe', description: 'Полосатый свитер и чёрные джинсы клёш', price: 270, art: '07', image: '/assets/shop/outfits/cocoa-stripe.png', colors: ['#d8bf98', '#39271f'], slot: 'outfit', gender: 'girl' },
  { id: 'look-noir-ruched', category: 'avatar', name: 'Noir Ruched', description: 'Чёрный топ со сборками и джинсы клёш', price: 230, art: '08', image: '/assets/shop/outfits/noir-ruched.png', colors: ['#24242a', '#090a0e'], slot: 'outfit', gender: 'girl' },
  { id: 'look-cream-point', category: 'avatar', name: 'Cream Point', description: 'Кремовая кофта с фигурным краем и клёш', price: 290, art: '09', image: '/assets/shop/outfits/cream-point.png', colors: ['#f0e6d5', '#26272d'], slot: 'outfit', gender: 'girl' },
  { id: 'look-burgundy-satin', category: 'avatar', name: 'Burgundy Satin', description: 'Бордовый атласный топ и чёрный клёш', price: 260, art: '10', image: '/assets/shop/outfits/burgundy-satin.png', colors: ['#8a2037', '#25262c'], slot: 'outfit', gender: 'girl' },
  { id: 'look-layered-collar', category: 'avatar', name: 'Layered Collar', description: 'Белая рубашка, чёрный топ и тёмный клёш', price: 310, art: '11', image: '/assets/shop/outfits/layered-collar.png', colors: ['#f4f3ef', '#17181d'], slot: 'outfit', gender: 'girl' },
  { id: 'look-gray-asym', category: 'avatar', name: 'Gray Asym', description: 'Серая асимметричная кофта и чёрный клёш', price: 280, art: '12', image: '/assets/shop/outfits/gray-asym.png', colors: ['#a4a4a7', '#24252b'], slot: 'outfit', gender: 'girl' },
  { id: 'look-boy-forest-campus', category: 'avatar', name: 'Forest Campus', description: 'Зелёное худи и широкие серые брюки', price: 230, art: '13', image: '/assets/shop/outfits/boy-forest-campus.png', colors: ['#19382c', '#d2d3d5'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-sand-layer', category: 'avatar', name: 'Sand Layer', description: 'Бежевая куртка, клетчатая рубашка и чёрные брюки', price: 290, art: '14', image: '/assets/shop/outfits/boy-sand-layer.png', colors: ['#c8b99d', '#19191d'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-noir-knit', category: 'avatar', name: 'Noir Knit', description: 'Чёрный свитер и светлые джинсы багги', price: 260, art: '15', image: '/assets/shop/outfits/boy-noir-knit.png', colors: ['#16171c', '#aabac5'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-mocha-track', category: 'avatar', name: 'Mocha Track', description: 'Коричневая олимпийка и чёрные брюки', price: 250, art: '16', image: '/assets/shop/outfits/boy-mocha-track.png', colors: ['#574b46', '#17181c'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-leather-layer', category: 'avatar', name: 'Leather Layer', description: 'Кожаная куртка поверх серого худи', price: 330, art: '17', image: '/assets/shop/outfits/boy-leather-layer.png', colors: ['#16171a', '#77818a'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-college-gray', category: 'avatar', name: 'College Gray', description: 'Серый свитшот и широкие чёрные брюки', price: 220, art: '18', image: '/assets/shop/outfits/boy-college-gray.png', colors: ['#d2d3d5', '#17181c'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-black-bomber', category: 'avatar', name: 'Black Bomber', description: 'Чёрный бомбер и серые брюки багги', price: 300, art: '19', image: '/assets/shop/outfits/boy-black-bomber.png', colors: ['#16171a', '#d1d2d4'], slot: 'outfit', gender: 'boy' },
  { id: 'look-boy-cardigan', category: 'avatar', name: 'City Cardigan', description: 'Графитовый кардиган и светлые джинсы', price: 280, art: '20', image: '/assets/shop/outfits/boy-cardigan.png', colors: ['#3d3e42', '#afc3d3'], slot: 'outfit', gender: 'boy' },
  { id: 'frame-crimson', category: 'frames', name: 'Crimson Edge', description: 'Animated red avatar frame', price: 120, art: '◉', colors: ['#ff2635', '#560812'], slot: 'frame' },
  { id: 'frame-royal', category: 'frames', name: 'Royal Silver', description: 'Polished champion frame', price: 220, art: '♛', colors: ['#ffffff', '#444a62'], slot: 'frame' },
  { id: 'cards-noir', category: 'cards', name: 'Noir Deck', description: 'Minimal CARDIX card back', price: 180, art: '♠', colors: ['#f21f2d', '#090b18'], slot: 'deck' },
  { id: 'cards-diamond', category: 'cards', name: 'Red Diamond', description: 'Geometric premium card back', price: 260, art: '♦', colors: ['#ffffff', '#c60d1a'], slot: 'deck' },
  { id: 'cards-dice-diamonds', category: 'cards', name: 'Кости и бубны', description: 'Необычная бело-синяя колода с игровыми кубиками', price: 190, art: '10♦', image: '/assets/shop/dice-diamonds-card.jpg', colors: ['#49aaf2', '#101d38'], slot: 'deck' },
  { id: 'cards-mechanical-ace', category: 'cards', name: 'Механический туз', description: 'Премиальная колода с объёмным синим орнаментом', price: 260, art: 'A♠', image: '/assets/shop/mechanical-ace-card.jpg', colors: ['#6174c9', '#131943'], slot: 'deck' },
  { id: 'cards-neon-ace', category: 'cards', name: 'Неоновый туз', description: 'Чёрная колода с ярким голубым свечением', price: 320, art: 'A♠', image: '/assets/shop/neon-ace-card.jpg', colors: ['#35e7ff', '#02050a'], slot: 'deck' },
  { id: 'cards-vintage-spades', category: 'cards', name: 'Винтажные пики', description: 'Светлая колода с нарисованными синими мастями', price: 230, art: '9♠', image: '/assets/shop/vintage-spades-card.jpg', colors: ['#f1ead8', '#344873'], slot: 'deck' },
  { id: 'cards-royal-blood', category: 'cards', name: 'Королевская кровь', description: 'Бордовая колода с роскошной серебряной окантовкой', price: 360, art: 'A♦', image: '/assets/shop/royal-blood-card.jpg', colors: ['#c9c9c9', '#4a0707'], slot: 'deck' },
  { id: 'table-velvet', category: 'tables', name: 'Red Velvet', description: 'Luxury casino table theme', price: 320, art: '◆', colors: ['#a50916', '#22050a'] },
  { id: 'table-midnight', category: 'tables', name: 'Midnight Club', description: 'Deep navy table with glow', price: 280, art: '♣', colors: ['#272e54', '#030511'] },
  { id: 'icon-joker', category: 'icons', name: 'Joker', description: 'Rare profile icon', price: 90, art: '★', colors: ['#ffcf64', '#9a1520'] },
  { id: 'icon-ace', category: 'icons', name: 'Ace of Spades', description: 'Classic profile icon', price: 70, art: 'A♠', colors: ['#ffffff', '#121528'] },
  { id: 'bg-redline', category: 'backgrounds', name: 'Redline', description: 'Animated profile background', price: 400, art: '╱', colors: ['#f21f2d', '#080a17'], slot: 'background' },
  { id: 'boost-xp', category: 'boosters', name: 'XP Booster', description: 'Double XP for the next 24 hours', price: 100, art: '2×', colors: ['#ff8b28', '#5a1d06'] },
  { id: 'tokens-small', category: 'tokens', name: 'Token Pack S', description: 'Reserved for future rewards', price: 0, art: '◆', colors: ['#ffd36b', '#8c4f0b'], future: true },
];

export const shopCategories: Array<'all' | ShopCategory> = [
  'all', 'avatar', 'frames', 'cards', 'tables', 'icons', 'backgrounds', 'boosters', 'tokens',
];
