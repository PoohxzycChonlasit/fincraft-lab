import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../src/database/generated/prisma/client';

export function createSeedPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required for seeding');
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}
