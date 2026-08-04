import assert from 'node:assert/strict';
import {
  applyDurakAction, chooseDurakAction, createMultiplayerDurak, getDefenderCardOptions, getDurakActionAvailability, getDurakCardError,
} from '../src/lib/multiplayer-durak-engine.ts';

interface Scenario { label: string; count: number; humanIds: number[]; seed: number; rules?: 'throw-in' | 'transfer' }

const scenarios: Scenario[] = [
  { label: '2 players: human + AI', count: 2, humanIds: [0], seed: 21 },
  { label: '3 players: human + 2 AI', count: 3, humanIds: [0], seed: 32 },
  { label: '4 players: 4 AI', count: 4, humanIds: [], seed: 43 },
  { label: '6 players: human + 5 AI', count: 6, humanIds: [0], seed: 65 },
  { label: 'Transfer Durak: 3 players', count: 3, humanIds: [0], seed: 76, rules: 'transfer' },
  { label: 'Transfer Durak: 6 players', count: 6, humanIds: [0], seed: 87, rules: 'transfer' },
];

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

const baseTransfer = createMultiplayerDurak(['Attacker', 'Defender', 'Next'], () => 0.42, 'transfer');
const allCards = [...baseTransfer.deck, ...baseTransfer.players.flatMap((player) => player.hand)];
const attackCard = allCards.find((card) => card.suit !== baseTransfer.trump)!;
const choiceCard = allCards.find((card) => card.suit === baseTransfer.trump && card.rank === attackCard.rank)!;
const receiverCards = allCards.filter((card) => card.id !== attackCard.id && card.id !== choiceCard.id).slice(0, 6);
const choiceGame = {
  ...baseTransfer,
  players: [
    { ...baseTransfer.players[0], hand: [receiverCards[0]] },
    { ...baseTransfer.players[1], hand: [choiceCard] },
    { ...baseTransfer.players[2], hand: receiverCards.slice(1) },
  ],
  table: [{ attack: attackCard }], attacker: 0, defender: 1, actor: 1,
  phase: 'defend' as const, defenderStartCards: 1,
};
assert.deepEqual(getDefenderCardOptions(choiceGame, choiceCard), { canDefend: true, canTransfer: true });
const defended = applyDurakAction(choiceGame, { type: 'defend', cardId: choiceCard.id });
assert.equal(defended.table[0].defense?.id, choiceCard.id, 'Beat must cover the attacking card');
assert.equal(defended.defender, 1, 'Beat must keep the current defender');
const transferred = applyDurakAction(choiceGame, { type: 'transfer', cardId: choiceCard.id });
assert.equal(transferred.table.length, 2, 'Transfer must add the selected card to the attack');
assert.equal(transferred.attacker, 1, 'The previous defender becomes the attacker');
assert.equal(transferred.defender, 2, 'Transfer must target the next active player');
assert.equal(transferred.actor, 2, 'The new defender must act immediately');
assert.equal(getDurakActionAvailability(choiceGame, 1).canTake, true, 'Transfer defender must be able to take');
const taking = applyDurakAction(choiceGame, { type: 'take' });
assert.equal(taking.phase, 'taking', 'Take button must start the taking phase');
assert.equal(getDurakActionAvailability(taking, taking.actor).canPass, true, 'Thrower must be able to pass after take');
assert.equal(getDurakActionAvailability(defended, defended.actor).canPass, true, 'First thrower must be able to pass');
const afterFirstPass = applyDurakAction(defended, { type: 'pass' });
assert.equal(getDurakActionAvailability(afterFirstPass, afterFirstPass.actor).canFinishBout, true,
  'Last thrower must be able to press Done');
const finishedBout = applyDurakAction(afterFirstPass, { type: 'pass' });
assert.equal(finishedBout.table.length, 0, 'Done button must clear the table');
console.log('✓ transfer choice: both Beat and Transfer actions work');

function cardIds(game: ReturnType<typeof createMultiplayerDurak>) {
  return [
    ...game.deck,
    ...game.discarded,
    ...game.players.flatMap((player) => player.hand),
    ...game.table.flatMap((pair) => pair.defense ? [pair.attack, pair.defense] : [pair.attack]),
  ].map((card) => card.id);
}

for (const scenario of scenarios) {
  const names = Array.from({ length: scenario.count }, (_, id) =>
    scenario.humanIds.includes(id) ? `Human ${id}` : `AI ${id}`);
  let game = createMultiplayerDurak(names, seededRandom(scenario.seed), scenario.rules);
  const actors = new Set<number>();
  const aiVsAi = new Set<string>();
  let turns = 0;

  while (!game.result && turns < 50_000) {
    assert.ok(game.actor >= 0 && game.actor < scenario.count, 'actor must be an existing player');
    assert.notEqual(game.attacker, game.defender, 'an attacker cannot target itself');
    if (game.phase === 'attack' && game.table.length === 0) {
      assert.ok(game.players[game.defender].hand.length > 0, 'a new target must be an active player');
    }
    if (game.phase !== 'defend') assert.notEqual(game.actor, game.defender, 'the defender cannot act as an attacker');
    actors.add(game.actor);
    if (!scenario.humanIds.includes(game.attacker) && !scenario.humanIds.includes(game.defender)) {
      aiVsAi.add(`${game.attacker}->${game.defender}`);
    }

    const ids = cardIds(game);
    assert.equal(ids.length, 36, 'all cards must remain in the game');
    assert.equal(new Set(ids).size, 36, 'a card cannot belong to two players');
    for (const card of game.players[game.actor].hand) {
      const error = getDurakCardError(game, card);
      const attempted = applyDurakAction(game, { type: 'play', cardId: card.id });
      assert.equal(attempted === game, Boolean(error), 'the dialog and engine must agree about every card');
    }

    const action = chooseDurakAction(game);
    assert.ok(action, 'the active player must always have a legal action');
    const before = JSON.stringify(game);
    game = applyDurakAction(game, action);
    assert.notEqual(JSON.stringify(game), before, 'a legal action must change the state');
    turns += 1;
  }

  assert.ok(game.result, `${scenario.label} must finish`);
  assert.equal(actors.size, scenario.count, `${scenario.label}: every player must receive a turn`);
  if (scenario.count >= 3) {
    assert.ok(aiVsAi.size > 0, `${scenario.label}: AI players must interact with other AI players`);
  }
  console.log(`✓ ${scenario.label}: ${turns} turns, ${aiVsAi.size} AI↔AI matchups`);
}
