import {
  ContentStatus,
  ElementType,
} from '../../../src/database/generated/prisma/client';

export interface StarterElementSeedInput {
  slug: string;
  name: string;
  categoryName: string;
  elementType: ElementType;
  emoji: string;
  isStarter: boolean;
  status: ContentStatus;
}

export const STARTER_ELEMENT_SEED_DATA: StarterElementSeedInput[] = [
  {
    slug: 'income',
    name: 'Earned Income',
    categoryName: 'Money Flow',
    elementType: ElementType.BASE,
    emoji: '💵',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'expense',
    name: 'General Expense',
    categoryName: 'Cost of Living',
    elementType: ElementType.BASE,
    emoji: '💳',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'saving',
    name: 'Basic Savings',
    categoryName: 'Saving & Financial Safety',
    elementType: ElementType.BASE,
    emoji: '🏦',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'debt',
    name: 'Borrowed Debt',
    categoryName: 'Debt & Credit',
    elementType: ElementType.BASE,
    emoji: '📝',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'interest',
    name: 'Interest Rate',
    categoryName: 'Debt & Credit',
    elementType: ElementType.TOOL,
    emoji: '📈',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'inflation',
    name: 'Market Inflation',
    categoryName: 'Cost of Living',
    elementType: ElementType.RISK,
    emoji: '🎈',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'emergency-fund',
    name: 'Emergency Fund',
    categoryName: 'Saving & Financial Safety',
    elementType: ElementType.TOOL,
    emoji: '🛡️',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'food',
    name: 'Food & Groceries',
    categoryName: 'Cost of Living',
    elementType: ElementType.BASE,
    emoji: '🍲',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'rent',
    name: 'Shelter Rent',
    categoryName: 'Cost of Living',
    elementType: ElementType.BASE,
    emoji: '🏠',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'budget',
    name: 'Budget Plan',
    categoryName: 'Planning Tools',
    elementType: ElementType.TOOL,
    emoji: '📊',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'needs',
    name: 'Essential Needs',
    categoryName: 'Cost of Living',
    elementType: ElementType.CONCEPT,
    emoji: '🧱',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'wants',
    name: 'Discretionary Wants',
    categoryName: 'Financial Behavior',
    elementType: ElementType.CONCEPT,
    emoji: '🎁',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'fomo',
    name: 'Social Pressure / FOMO',
    categoryName: 'Financial Behavior',
    elementType: ElementType.RISK,
    emoji: '📱',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
  {
    slug: 'job-loss',
    name: 'Unexpected Job Loss',
    categoryName: 'Life Events & Risk',
    elementType: ElementType.RISK,
    emoji: '⚡',
    isStarter: true,
    status: ContentStatus.ACTIVE,
  },
];
