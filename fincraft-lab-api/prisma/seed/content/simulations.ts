import { ActiveStatus } from '../../../src/database/generated/prisma/client';

export interface SimulationSeedInput {
  simulationType: string;
  name: string;
  description: string;
  status: ActiveStatus;
  linkedElementSlug?: string;
}

export const SIMULATION_SEED_DATA: SimulationSeedInput[] = [
  {
    simulationType: 'survival-months',
    name: 'Survival Months',
    description:
      'Calculates runway in months by dividing total emergency savings by essential monthly living costs.',
    status: ActiveStatus.ACTIVE,
    linkedElementSlug: 'emergency-fund',
  },
];
