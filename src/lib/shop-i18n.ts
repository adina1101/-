import type { Language } from './types';
import type { ShopCategory, ShopItem } from './shop-data';

type Copy = { ru: string; en: string };
const copy = (ru: string, en: string): Copy => ({ ru, en });

const itemCopy: Record<string, { name: Copy; description: Copy }> = {
  'avatar-crown': { name: copy('Корона чемпиона', 'Champion Crown'), description: copy('Золотая корона для аватара', 'A golden crown for your avatar') },
  'avatar-cap': { name: copy('Кепка CARDIX', 'CARDIX Cap'), description: copy('Красная игровая кепка', 'A red gaming cap') },
  'avatar-glasses': { name: copy('Очки профи', 'Pro Glasses'), description: copy('Стильные тёмные очки', 'Stylish dark glasses') },
  'avatar-mask-gold': { name: copy('Золотая маска', 'Golden Mask'), description: copy('Редкая маска победителя', 'A rare winner mask') },
  'look-shadow-tank': { name: copy('Тёмный стрит', 'Shadow Street'), description: copy('Чёрный топ и широкие тёмные джинсы', 'Black tank top with wide dark jeans') },
  'look-pink-07': { name: copy('Pink 07', 'Pink 07'), description: copy('Спортивная футболка и светлые широкие джинсы', 'Sports jersey with light wide-leg jeans') },
  'look-cat-street': { name: copy('Cat Street', 'Cat Street'), description: copy('Белая футболка с котиком и чёрные джинсы', 'White cat tee with black wide-leg jeans') },
  'look-plaid-layer': { name: copy('Клетчатый слой', 'Plaid Layer'), description: copy('Рубашка в клетку, кроп-топ и широкие джинсы', 'Plaid overshirt, crop top and wide jeans') },
  'look-lace-cargo': { name: copy('Lace Cargo', 'Lace Cargo'), description: copy('Кружевная блуза и джинсы карго', 'Lace blouse with cargo jeans') },
  'look-varsity-33': { name: copy('Varsity 33', 'Varsity 33'), description: copy('Спортивная футболка и выцветшие джинсы', 'Sports tee with faded wide-leg jeans') },
  'look-cocoa-stripe': { name: copy('Cocoa Stripe', 'Cocoa Stripe'), description: copy('Полосатый свитер и чёрные джинсы клёш', 'Striped sweater with black flared jeans') },
  'look-noir-ruched': { name: copy('Noir Ruched', 'Noir Ruched'), description: copy('Чёрный топ со сборками и джинсы клёш', 'Ruched black top with flared jeans') },
  'look-cream-point': { name: copy('Cream Point', 'Cream Point'), description: copy('Кремовая кофта с фигурным краем и клёш', 'Cream pointed-hem top with flared jeans') },
  'look-burgundy-satin': { name: copy('Burgundy Satin', 'Burgundy Satin'), description: copy('Бордовый атласный топ и чёрный клёш', 'Burgundy satin top with black flared jeans') },
  'look-layered-collar': { name: copy('Layered Collar', 'Layered Collar'), description: copy('Белая рубашка, чёрный топ и тёмный клёш', 'White shirt, black layered top and dark flares') },
  'look-gray-asym': { name: copy('Gray Asym', 'Gray Asym'), description: copy('Серая асимметричная кофта и чёрный клёш', 'Gray asymmetric knit with black flared jeans') },
  'look-boy-forest-campus': { name: copy('Forest Campus', 'Forest Campus'), description: copy('Зелёное худи и широкие серые брюки', 'Green hoodie with wide gray sweatpants') },
  'look-boy-sand-layer': { name: copy('Sand Layer', 'Sand Layer'), description: copy('Бежевая куртка, клетчатая рубашка и чёрные брюки', 'Beige jacket, plaid shirt and black trousers') },
  'look-boy-noir-knit': { name: copy('Noir Knit', 'Noir Knit'), description: copy('Чёрный свитер и светлые джинсы багги', 'Black knit with light baggy jeans') },
  'look-boy-mocha-track': { name: copy('Mocha Track', 'Mocha Track'), description: copy('Коричневая олимпийка и чёрные брюки', 'Brown track top with black trousers') },
  'look-boy-leather-layer': { name: copy('Leather Layer', 'Leather Layer'), description: copy('Кожаная куртка поверх серого худи', 'Leather jacket layered over a gray hoodie') },
  'look-boy-college-gray': { name: copy('College Gray', 'College Gray'), description: copy('Серый свитшот и широкие чёрные брюки', 'Gray sweatshirt with wide black trousers') },
  'look-boy-black-bomber': { name: copy('Black Bomber', 'Black Bomber'), description: copy('Чёрный бомбер и серые брюки багги', 'Black bomber with gray baggy pants') },
  'look-boy-cardigan': { name: copy('City Cardigan', 'City Cardigan'), description: copy('Графитовый кардиган и светлые джинсы', 'Charcoal cardigan with light jeans') },
  'frame-crimson': { name: copy('Багровая рамка', 'Crimson Edge'), description: copy('Анимированная красная рамка', 'Animated red avatar frame') },
  'frame-royal': { name: copy('Королевское серебро', 'Royal Silver'), description: copy('Сияющая рамка чемпиона', 'Polished champion frame') },
  'cards-noir': { name: copy('Колода Нуар', 'Noir Deck'), description: copy('Минималистичная рубашка CARDIX', 'Minimal CARDIX card back') },
  'cards-diamond': { name: copy('Красный бриллиант', 'Red Diamond'), description: copy('Геометрическая премиальная колода', 'Geometric premium deck') },
  'cards-dice-diamonds': { name: copy('Кости и бубны', 'Dice & Diamonds'), description: copy('Бело-синяя колода с игровыми кубиками', 'A blue and white deck with gaming dice') },
  'cards-mechanical-ace': { name: copy('Механический туз', 'Mechanical Ace'), description: copy('Колода с объёмным синим орнаментом', 'A deck with dimensional blue ornament') },
  'cards-neon-ace': { name: copy('Неоновый туз', 'Neon Ace'), description: copy('Чёрная колода с голубым свечением', 'A black deck with a cyan glow') },
  'cards-vintage-spades': { name: copy('Винтажные пики', 'Vintage Spades'), description: copy('Светлая колода с синими мастями', 'A light deck with hand-drawn blue suits') },
  'cards-royal-blood': { name: copy('Королевская кровь', 'Royal Blood'), description: copy('Бордовая колода с серебряной окантовкой', 'A burgundy deck with silver trim') },
  'table-velvet': { name: copy('Красный бархат', 'Red Velvet'), description: copy('Роскошная тема игрового стола', 'Luxury casino table theme') },
  'table-midnight': { name: copy('Полуночный клуб', 'Midnight Club'), description: copy('Тёмно-синий стол с мягким свечением', 'Deep navy table with a subtle glow') },
  'icon-joker': { name: copy('Джокер', 'Joker'), description: copy('Редкая иконка профиля', 'Rare profile icon') },
  'icon-ace': { name: copy('Туз пик', 'Ace of Spades'), description: copy('Классическая иконка профиля', 'Classic profile icon') },
  'bg-redline': { name: copy('Красная линия', 'Redline'), description: copy('Анимированный фон профиля', 'Animated profile background') },
  'boost-xp': { name: copy('Усилитель опыта', 'XP Booster'), description: copy('Двойной опыт на следующие 24 часа', 'Double XP for the next 24 hours') },
  'tokens-small': { name: copy('Набор жетонов S', 'Token Pack S'), description: copy('Зарезервировано для будущих наград', 'Reserved for future rewards') },
};

export const shopCategoryCopy: Record<'all' | ShopCategory, Copy> = {
  all: copy('Все', 'All'), avatar: copy('Для аватара', 'Avatar'), frames: copy('Рамки', 'Frames'),
  cards: copy('Колоды', 'Decks'), tables: copy('Столы', 'Tables'), icons: copy('Иконки', 'Icons'),
  backgrounds: copy('Фоны', 'Backgrounds'), boosters: copy('Усилители', 'Boosters'), tokens: copy('Жетоны', 'Token packs'),
};

const ui = {
  title: copy('Магазин', 'Shop'), subtitle: copy('Сделай CARDIX своим', 'Make CARDIX yours'),
  balance: copy('Ваш баланс', 'Your balance'), earn: copy('Зарабатывайте жетоны в играх и заданиях', 'Earn tokens by playing and completing missions'),
  comingSoon: copy('Скоро', 'Coming soon'), equipped: copy('Надето', 'Equipped'), equip: copy('Надеть', 'Equip'),
  owned: copy('Куплено', 'Owned'), locked: copy('Закрыто', 'Locked'), buy: copy('Купить', 'Buy'),
  fitting: copy('Примерка', 'Try on'), remove: copy('Снять', 'Remove'), buyEquip: copy('Купить и надеть', 'Buy & equip'),
  confirm: copy('Подтвердите покупку', 'Confirm purchase'), unlock: copy('Открыть навсегда?', 'Unlock permanently?'),
  alreadyOwned: copy('Этот предмет уже куплен', 'This item is already owned'), tokens: copy('жетонов', 'Tokens'),
  close: copy('Закрыть', 'Close'), unlocked: copy('Открыто!', 'Unlocked!'), yours: copy('теперь ваш', 'is now yours'),
  purchased: copy('Куплено', 'Owned'), free: copy('Бесплатно', 'Free'),
  editAvatar: copy('Изменить аватар', 'Edit avatar'), boy: copy('Мальчик', 'Boy'), girl: copy('Девочка', 'Girl'),
  wardrobe: copy('Гардероб', 'Wardrobe'), wardrobeHint: copy('Нажмите на вещь, чтобы примерить', 'Tap an item to try it on'),
  currentlyEquipped: copy('Сейчас надето', 'Currently equipped'), done: copy('Готово', 'Done'),
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
