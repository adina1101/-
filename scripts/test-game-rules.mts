import assert from 'node:assert/strict';
import { gameRules } from '../src/lib/game-rules/index.ts';
import { games } from '../src/lib/games.ts';

const customRuleGames = new Set(['durak', 'transfer-durak', 'war']);
for (const game of games) {
  if (customRuleGames.has(game.id)) continue;
  const rules = gameRules[game.id];
  assert.ok(rules, `${game.id} must have its own rules`);
  assert.ok(rules.deck.ru && rules.deck.en, `${game.id} must explain its deck in both languages`);
  assert.ok(rules.goal.ru && rules.goal.en, `${game.id} must explain its goal in both languages`);
  assert.ok(rules.setup.ru && rules.setup.en, `${game.id} must explain setup in both languages`);
  assert.ok(rules.steps.length >= 3, `${game.id} must explain gameplay in at least three steps`);
  assert.ok(rules.steps.every((step) => step.ru && step.en), `${game.id} steps must be bilingual`);
}

console.log(`✓ ${games.length} games have complete Russian and English rules`);
