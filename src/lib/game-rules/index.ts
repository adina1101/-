import { pokerCasinoRules } from './poker-casino.ts';
import { popularRules } from './popular.ts';
import { solitaireRules } from './solitaire.ts';
import type { GameRule } from './types.ts';

export const gameRules: Record<string, GameRule> = {
  ...popularRules,
  ...pokerCasinoRules,
  ...solitaireRules,
};

export type { GameRule } from './types.ts';
