import {
  ContentStatus,
  CraftRuleType,
} from '../../../src/database/generated/prisma/client';

export interface CraftRecipeSeedInput {
  recipeOrder: number;
  inputElementSlugs: [string, string];
  outputElementSlug: string;
  ruleType: CraftRuleType;
  status: ContentStatus;
}

export const CORE_CRAFT_RECIPE_SEED_DATA: CraftRecipeSeedInput[] = [
  {
    recipeOrder: 1,
    inputElementSlugs: ['income', 'expense'],
    outputElementSlug: 'cash-flow',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 2,
    inputElementSlugs: ['debt', 'interest'],
    outputElementSlug: 'debt-pressure',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 3,
    inputElementSlugs: ['expense', 'inflation'],
    outputElementSlug: 'cost-pressure',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 4,
    inputElementSlugs: ['wants', 'fomo'],
    outputElementSlug: 'impulse-spending',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 5,
    inputElementSlugs: ['needs', 'rent'],
    outputElementSlug: 'essential-baseline',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 6,
    inputElementSlugs: ['wants', 'food'],
    outputElementSlug: 'discretionary-leakage',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 7,
    inputElementSlugs: ['fomo', 'inflation'],
    outputElementSlug: 'digital-scam-risk',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 8,
    inputElementSlugs: ['budget', 'income'],
    outputElementSlug: 'spending-plan',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 9,
    inputElementSlugs: ['budget', 'fomo'],
    outputElementSlug: 'digital-hygiene',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 10,
    inputElementSlugs: ['income', 'wants'],
    outputElementSlug: 'lifestyle-creep',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 11,
    inputElementSlugs: ['saving', 'interest'],
    outputElementSlug: 'savings-growth',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 12,
    inputElementSlugs: ['debt', 'fomo'],
    outputElementSlug: 'debt-trap',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 13,
    inputElementSlugs: ['cash-flow', 'saving'],
    outputElementSlug: 'emergency-resilience',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 14,
    inputElementSlugs: ['cost-pressure', 'inflation'],
    outputElementSlug: 'purchasing-power-loss',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 15,
    inputElementSlugs: ['saving', 'job-loss'],
    outputElementSlug: 'emergency-liquidity',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 16,
    inputElementSlugs: ['impulse-spending', 'needs'],
    outputElementSlug: 'mindful-spending',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 17,
    inputElementSlugs: ['debt-pressure', 'budget'],
    outputElementSlug: 'debt-payoff-strategy',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 18,
    inputElementSlugs: ['spending-plan', 'cost-pressure'],
    outputElementSlug: 'budget-optimizing',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 19,
    inputElementSlugs: ['debt-trap', 'debt-pressure'],
    outputElementSlug: 'debt-overload',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 20,
    inputElementSlugs: ['emergency-liquidity', 'job-loss'],
    outputElementSlug: 'emergency-survival',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 21,
    inputElementSlugs: ['emergency-resilience', 'essential-baseline'],
    outputElementSlug: 'financial-stability',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
  {
    recipeOrder: 22,
    inputElementSlugs: ['financial-stability', 'savings-growth'],
    outputElementSlug: 'financial-freedom-foundation',
    ruleType: CraftRuleType.COMMUTATIVE,
    status: ContentStatus.ACTIVE,
  },
];
