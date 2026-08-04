export interface RuleText { ru: string; en: string }
export interface GameRule {
  deck: RuleText;
  goal: RuleText;
  setup: RuleText;
  steps: RuleText[];
}

export const text = (ru: string, en: string): RuleText => ({ ru, en });
