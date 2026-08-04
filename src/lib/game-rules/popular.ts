import { text as t, type GameRule } from './types.ts';

export const popularRules: Record<string, GameRule> = {
  thousand: {
    deck: t('24 карты', '24 cards'), goal: t('Первым набрать 1000 очков.', 'Be the first to score 1,000 points.'),
    setup: t('Используются карты 9–A. Игрокам раздают руки и прикуп; победитель торгов забирает прикуп и назначает контракт.', 'Use cards 9–A. Deal hands and a widow; the highest bidder takes the widow and declares a contract.'),
    steps: [t('Игроки по возможности кладут карту в масть хода, затем козырь.', 'Follow the led suit when possible, then play trump if required.'), t('Взятку получает старшая карта масти хода или старший козырь.', 'The highest trump, or highest card of the led suit, wins the trick.'), t('Король и дама одной масти объявляют марьяж и назначают козырь. После раздачи считают стоимость взяток.', 'A king-queen marriage declares trump and scores a bonus. Card points are counted after the deal.')],
  },
  bura: {
    deck: t('36 карт', '36 cards'), goal: t('Первым набрать 31 или больше очков во взятках.', 'Be first to collect at least 31 trick points.'),
    setup: t('Каждому дают по 3 карты, открывают козырь. Туз стоит 11, десятка 10, король 4, дама 3, валет 2.', 'Deal 3 cards each and reveal trump. A=11, 10=10, K=4, Q=3 and J=2 points.'),
    steps: [t('Ходят одной картой или несколькими картами одной масти.', 'Lead one card or several cards of one suit.'), t('Для победы нужно ответить тем же числом карт и перебить каждую; козырь бьёт некозырную карту.', 'To win, answer with the same number of cards and beat each one; trumps beat non-trumps.'), t('Победитель забирает взятку, добор начинается с него.', 'The winner takes the trick and draws first.')],
  },
  'twenty-one': {
    deck: t('52 карты', '52 cards'), goal: t('Набрать ближе к 21, чем соперник, не превысив 21.', 'Finish closer to 21 than the opponent without going over.'),
    setup: t('Каждый получает две карты. Числовые карты стоят по номиналу, картинки — 10, туз — 1 или 11.', 'Each player receives two cards. Number cards use face value, faces count 10, and aces count 1 or 11.'),
    steps: [t('В свой ход выберите «Ещё» или «Хватит».', 'Choose Hit or Stand on your turn.'), t('Перебор больше 21 означает немедленное поражение.', 'Going over 21 loses immediately.'), t('После остановки всех игроков побеждает ближайшая к 21 рука.', 'After everyone stands, the hand closest to 21 wins.')],
  },
  ochko: {
    deck: t('36 карт', '36 cards'), goal: t('Собрать ровно 21 очко или оказаться ближе всех к 21.', 'Make exactly 21, or finish closest to it.'),
    setup: t('Карты 6–10 стоят по номиналу, валет — 2, дама — 3, король — 4, туз — 11.', 'Cards 6–10 use face value; J=2, Q=3, K=4 and A=11.'),
    steps: [t('Получив карту, игрок решает взять ещё или остановиться.', 'After each card, choose whether to draw again or stop.'), t('Сумма выше 21 — перебор и поражение.', 'A total above 21 is a bust and loses.'), t('При равенстве действует ничья, если условия стола не задают преимущество ведущему.', 'Equal totals tie unless the table rules give the dealer priority.')],
  },
  kozel: {
    deck: t('36 карт', '36 cards'), goal: t('Набрать большинство очков во взятках и не стать «козлом».', 'Win most trick points and avoid becoming the “goat”.'),
    setup: t('Карты раздаются поровну; при четырёх игроках партнёры сидят напротив. Туз и десятка самые ценные.', 'Deal evenly; with four players, opposite seats are partners. Aces and tens carry most points.'),
    steps: [t('Нужно класть карту в масть; при её отсутствии — козырь, затем любую карту.', 'Follow suit; if unable, play trump, otherwise any card.'), t('Старший козырь или старшая карта масти хода забирает взятку.', 'Highest trump, or highest card of the led suit, takes the trick.'), t('После всех взяток команда или игрок с большинством очков выигрывает сдачу.', 'After all tricks, the side with most card points wins the deal.')],
  },
  terz: {
    deck: t('36 карт', '36 cards'), goal: t('Собрать сильнейшую комбинацию из трёх карт.', 'Build the strongest three-card combination.'),
    setup: t('Каждому раздают по 3 карты. Терц — три последовательные карты одной масти.', 'Deal 3 cards each. A terz is three consecutive cards of one suit.'),
    steps: [t('Игроки по кругу меняют карту или оставляют руку.', 'Players take turns exchanging a card or keeping their hand.'), t('Терц старше пары и одиночных карт; между терцами сравнивают старшую карту.', 'A terz beats a pair or high cards; tied combinations compare their highest card.'), t('После завершения обменов все вскрываются, лучшая рука выигрывает.', 'After exchanges end, reveal all hands; the strongest wins.')],
  },
  seven: {
    deck: t('32 карты', '32 cards'), goal: t('Выиграть больше взяток с семёрками.', 'Win tricks by controlling the sevens.'),
    setup: t('Используются карты 7–A, карты раздаются поровну. Семёрки имеют особую силу.', 'Use cards 7–A and deal evenly. Sevens have special capturing power.'),
    steps: [t('Игроки кладут по одной карте; масть соблюдать не обязательно.', 'Players contribute one card; following suit is not required.'), t('Взятку берёт последняя семёрка либо последняя карта того же достоинства, что первая.', 'The last seven, or last card matching the lead rank, captures the trick.'), t('Побеждает игрок или команда с большим числом очковых карт.', 'The player or team with the most card points wins.')],
  },
  nine: {
    deck: t('36 карт', '36 cards'), goal: t('Первым избавиться от всех карт, строя ряды по мастям.', 'Be first to empty your hand by building suit rows.'),
    setup: t('Все карты раздают участникам. Ряды начинаются с девяток каждой масти.', 'Deal all cards. Each suit row begins with its nine.'),
    steps: [t('Положите девятку или соседнюю по достоинству карту в подходящий ряд.', 'Play a nine, or the next adjacent rank in the matching suit row.'), t('Если допустимой карты нет, игрок пасует.', 'Pass when no legal card is available.'), t('Первый игрок без карт побеждает.', 'The first player with no cards wins.')],
  },
};
