import assert from 'node:assert/strict';
import { createDeck } from '../src/lib/card-engine.ts';
import { createWarGame, playWarRound, type WarGame } from '../src/lib/war-engine.ts';

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function ownedIds(game: WarGame) {
  return [...game.players.flatMap((player) => player.deck), ...game.pot].map((card) => card.id);
}

const finishingSeeds = new Map([[2, 2], [3, 5], [4, 3]]);
for (const count of [2, 3, 4]) {
  let game = createWarGame(Array.from({ length: count }, (_, index) => `Player ${index + 1}`), seededRandom(finishingSeeds.get(count)!));
  assert.equal(ownedIds(game).length, 36, 'the whole deck must be dealt');
  assert.equal(new Set(ownedIds(game)).size, 36, 'every card must have one owner');
  assert.ok(Math.max(...game.players.map((player) => player.deck.length))
    - Math.min(...game.players.map((player) => player.deck.length)) <= 1, 'the deal must be even');

  let turns = 0;
  while (!game.result && turns < 100_000) {
    game = playWarRound(game);
    const ids = ownedIds(game);
    assert.equal(ids.length, 36, 'cards on the table must stay in the pot or a player pile');
    assert.equal(new Set(ids).size, 36, 'cards cannot be duplicated');
    turns += 1;
  }
  assert.ok(game.result, `${count}-player game must finish`);
  assert.equal(game.players[game.winnerId!].deck.length, 36, 'winner must collect the full deck');
  console.log(`✓ ${count} players: all 36 hidden cards dealt, game finished in ${turns} reveals`);
}

const cards = createDeck(() => 0.5);
const take = (suit: string, rank: string) => cards.find((card) => card.suit === suit && card.rank === rank)!;
let dispute: WarGame = {
  players: [
    { id: 0, name: 'One', deck: [take('♠', '6'), take('♠', 'A'), take('♠', 'K')] },
    { id: 1, name: 'Two', deck: [take('♥', '6'), take('♥', 'Q'), take('♥', 'J')] },
  ],
  pot: [], table: [], contenders: [], round: 0, message: '',
};
dispute = playWarRound(dispute);
assert.deepEqual(dispute.contenders, [0, 1], 'equal ranks must start a dispute');
assert.equal(dispute.pot.length, 2, 'first equal cards must stay in the pot');
dispute = playWarRound(dispute);
assert.equal(dispute.winnerId, 0, 'the higher open card must win the dispute');
assert.equal(dispute.players[0].deck.length, 6, 'winner must collect open and face-down cards');
console.log('✓ dispute: one face-down and one face-up card per tied player');

const fullWar = createWarGame(['One', 'Two', 'Three', 'Four'], seededRandom(12), 52);
assert.equal(ownedIds(fullWar).length, 52, '52-card War must deal the full selected deck');
assert.deepEqual(fullWar.players.map((player) => player.deck.length), [13, 13, 13, 13]);
assert.ok(ownedIds(fullWar).some((id) => id.endsWith('2')), '52-card deck must contain low cards');
console.log('✓ 52-card deck: all cards are dealt into hidden piles');
