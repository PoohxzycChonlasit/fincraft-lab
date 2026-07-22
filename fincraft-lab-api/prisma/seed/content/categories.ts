import { ActiveStatus } from '../../../src/database/generated/prisma/client';

export interface CategorySeedInput {
  name: string;
  description: string;
  sortOrder: number;
  status: ActiveStatus;
}

export const CATEGORY_SEED_DATA: CategorySeedInput[] = [
  {
    name: 'Money Flow',
    description: 'Core concepts of cash inflows, outflows, and net income tracking.',
    sortOrder: 1,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Saving & Financial Safety',
    description: 'Building emergency buffers, liquidity, and capital preservation.',
    sortOrder: 2,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Debt & Credit',
    description: 'Understanding borrowing costs, credit mechanisms, and debt pressure.',
    sortOrder: 3,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Cost of Living',
    description: 'Managing fixed and variable living expenses, inflation, and essentials.',
    sortOrder: 4,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Financial Behavior',
    description: 'Psychological spending drivers, impulse control, and decision biases.',
    sortOrder: 5,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Life Events & Risk',
    description: 'Unplanned financial shocks, job loss, emergency events, and risk mitigation.',
    sortOrder: 6,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Planning Tools',
    description: 'Budgeting frameworks, financial tracking, and decision-making tools.',
    sortOrder: 7,
    status: ActiveStatus.ACTIVE,
  },
  {
    name: 'Digital Financial Safety',
    description: 'Online financial hygiene, fraud prevention, and digital security.',
    sortOrder: 8,
    status: ActiveStatus.ACTIVE,
  },
];
