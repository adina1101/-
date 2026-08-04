import assert from 'node:assert/strict';
import { calculatePayout, slotSymbols } from '../src/lib/slot-engine.ts';

const symbol = (id: string) => slotSymbols.find((item) => item.id === id)!;
const payout = (ids: string[]) => calculatePayout(ids.map(symbol), 10);

assert.equal(payout(['ace-black', 'six-red', 'heart']), 40, 'ace + six + suit must pay x4');
assert.equal(payout(['six-black', 'ace-red', 'ace-black']), 40, 'ace + six + ace must pay x4');
assert.equal(payout(['six-red', 'six-black', 'ace-red']), 40, 'ace + six + six must pay x4');
assert.equal(payout(['heart', 'heart', 'heart']), 30, 'three exact symbols must still pay x3');
assert.equal(payout(['heart', 'diamond', 'king']), 20, 'three red symbols must still pay x2');
assert.equal(payout(['ace-black', 'six-red', 'king']), 0, 'a face card is not a valid x4 third symbol');
assert.ok(slotSymbols.some((item) => item.glyph === '6'), 'six must be available on reels');

console.log('✓ casino payouts: x4 bonus, x3 exact match, x2 color match and loss');
