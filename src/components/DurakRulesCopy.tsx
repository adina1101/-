import { useApp } from '../lib/app-context';

export function DurakRulesCopy({ transfer }: { transfer: boolean }) {
  const { language, t } = useApp();
  const ru = language === 'ru';
  return <>
    <h2>{t('goal')}</h2>
    <p>{ru
      ? 'Избавьтесь от всех карт после окончания колоды. Последний игрок с картами остаётся дураком.'
      : 'Get rid of all cards after the deck runs out. The last player holding cards is the Durak.'}</p>
    <h2>{t('preparation')}</h2>
    <p>{ru
      ? 'Играют колодой из 36 карт. Каждый получает по 6 карт. Открытая нижняя карта задаёт козырь и забирается последней. Первым атакует владелец младшего козыря.'
      : 'Use a 36-card deck. Each player gets 6 cards. The exposed bottom card sets trump and is drawn last. The lowest trump attacks first.'}</p>
    <h2>{t('rules')}</h2>
    <ol>
      <li>{ru ? 'Атакуют картой или картами одного достоинства.' : 'Attack with one or more cards of the same rank.'}</li>
      <li>{ru ? 'Карту бьют старшей картой той же масти или козырем. Козырь бьётся только старшим козырем.' : 'Beat with a higher card of the same suit or a trump. A trump is beaten only by a higher trump.'}</li>
      {transfer && <li>{ru
        ? 'До начала отбоя защитник может добавить карту достоинства атакующих карт и перевести всю атаку следующему активному игроку.'
        : 'Before beating any card, the defender may add a card matching the attacking rank and transfer the whole attack to the next active player.'}</li>}
      {transfer && <li>{ru
        ? 'Перевод запрещён, если следующий игрок держит меньше карт, чем окажется в атаке после перевода.'
        : 'A transfer is forbidden when the next player holds fewer cards than the resulting attack.'}</li>}
      <li>{ru ? 'Подкидывать можно только достоинства, уже лежащие на столе. За заход — не больше 6 атакующих карт и не больше начальной руки защитника.' : 'Throw in only ranks already on the table. A bout is limited to 6 attacks and to the defender’s starting hand size.'}</li>
      <li>{ru ? 'Отбившийся игрок атакует следующим. Взявший пропускает атаку; атакует следующий игрок по кругу.' : 'A successful defender attacks next. A defender who takes skips the attack; the next player attacks.'}</li>
      <li>{ru ? 'После захода карты добирают до шести: сначала атакующий и остальные по кругу, защитник — последним.' : 'After each bout, refill to six starting with the attacker, around the table, and the defender last.'}</li>
    </ol>
  </>;
}
