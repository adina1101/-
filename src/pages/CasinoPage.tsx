import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { PageHeader } from '../components/PageHeader';
import { SlotReel } from '../components/SlotReel';
import { useEconomy } from '../lib/economy-context';
import { calculatePayout, slotSymbols, spinReels } from '../lib/slot-engine';

const bets = [5, 10, 25, 50];

export function CasinoPage() {
  const { tokens, stats, history, hasFreeSpin, startSpin, finishSpin } = useEconomy();
  const [bet, setBet] = useState(10);
  const [reels, setReels] = useState(() => [slotSymbols[1], slotSymbols[5], slotSymbols[8]]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(0);
  const [lastLoss, setLastLoss] = useState(0);
  const timer = useRef<number>();
  const jackpot = useMemo(() => 25000 + stats.totalSpins * 17, [stats.totalSpins]);
  useEffect(() => () => window.clearInterval(timer.current), []);

  const spin = (free = false) => {
    if (spinning || !startSpin(bet, free)) return;
    setSpinning(true); setLastWin(0); setLastLoss(0);
    timer.current = window.setInterval(() => setReels(spinReels()), 90);
    window.setTimeout(() => {
      window.clearInterval(timer.current);
      const result = spinReels();
      const win = calculatePayout(result, free ? 10 : bet);
      const lossPenalty = !free && win === 0 ? bet : 0;
      setReels(result); setLastWin(win); setLastLoss(lossPenalty ? bet * 2 : 0); setSpinning(false);
      finishSpin(result.map((symbol) => symbol.glyph), free ? 0 : bet, win, lossPenalty);
    }, 1450);
  };

  return (
    <div className="screen casino-screen">
      <PageHeader title="Casino" subtitle="Tokens only · play for fun" />
      <section className="casino-balance"><div><small>Balance</small><strong><Icon name="token" /> {tokens}</strong></div><div><small>Jackpot</small><strong className="jackpot">♛ {jackpot.toLocaleString()}</strong></div></section>
      <section className={lastWin > 0 ? 'slot-machine winner' : lastLoss > 0 ? 'slot-machine loser' : 'slot-machine'}>
        <div className="machine-lights">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
        <header><span>♠</span><strong>LUCKY SPIN</strong><span>♥</span></header>
        <div className="reels-window">{reels.map((symbol, index) => <SlotReel key={index} symbol={symbol} spinning={spinning} delay={index * 80} />)}</div>
        <div className="win-display">{spinning ? 'GOOD LUCK' : lastWin ? `YOU WON ${lastWin} ◆` : lastLoss ? `ПРОИГРЫШ −${lastLoss} ◆` : 'MATCH 3 TO WIN'}</div>
        {lastWin > 0 && <div className="casino-confetti">{Array.from({ length: 16 }, (_, index) => <i key={index} />)}</div>}
      </section>
      <section className="casino-rules">
        <h2>Правила выигрыша</h2>
        <div><span className="rule-symbols bonus">A 6 ♠</span><p><strong>Туз + шестёрка — ×4</strong><small>Третий символ: любая масть, ещё один туз или шестёрка; цвет не важен</small></p></div>
        <div><span className="rule-symbols mixed">♥ K J</span><p><strong>Один цвет — ×2</strong><small>Все три символа красные или чёрные</small></p></div>
        <div><span className="rule-symbols exact">♦ ♦ ♦</span><p><strong>Одинаковые — ×3</strong><small>Совпали символ, масть и цвет</small></p></div>
        <div><span className="rule-symbols lose">A ♥ ♣</span><p><strong>Проигрыш — ставка ×2</strong><small>Любая другая комбинация</small></p></div>
      </section>
      <section className="bet-panel"><span>Bet</span><div>{bets.map((value) => <button className={bet === value ? 'active' : ''} disabled={spinning} onClick={() => setBet(value)} key={value}>{value}</button>)}</div></section>
      <button className="spin-button" disabled={spinning || tokens < bet * 2} onClick={() => spin()}>{spinning ? 'SPINNING…' : 'LUCKY SPIN'}<small>{tokens < bet * 2 ? `Нужно минимум ${bet * 2}` : `${bet} Tokens`}</small></button>
      <button className="free-spin" disabled={!hasFreeSpin || spinning} onClick={() => spin(true)}>✦ {hasFreeSpin ? 'Daily free spin available' : 'Free spin used today'}</button>
      <section className="casino-stats"><article><strong>{stats.totalSpins}</strong><span>Total spins</span></article><article><strong>{stats.totalWon}</strong><span>Total won</span></article><article><strong>{stats.biggestWin}</strong><span>Biggest win</span></article></section>
      <div className="section-heading"><h2>Spin history</h2></div>
      <section className="spin-history">{history.length === 0 ? <p>Your spins will appear here</p> : history.slice(0, 6).map((spin) => <article key={spin.id}><span>{spin.symbols.join(' ')}</span><small>{spin.bet ? `Bet ${spin.bet}` : 'Free spin'}</small><strong className={spin.win ? 'won' : ''}>{spin.win ? `+${spin.win}` : '—'}</strong></article>)}</section>
    </div>
  );
}
