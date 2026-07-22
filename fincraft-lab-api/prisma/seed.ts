import { CATEGORY_SEED_DATA } from './seed/content/categories';
import { createSeedPrismaClient } from './seed/seed-client';
import { seedCategoriesStep } from './seed/steps/seed-categories';
import { validateCategoryContent } from './seed/validate-seed';
import {
  captureProtectedTableCounts,
  verifyCategorySeed,
} from './seed/verify-seed';

async function main(): Promise<void> {
  console.log('--- FinCraft Lab Seed v1 (Category Slice) ---');

  // 1. In-memory pre-write validation
  console.log('1. Validating Category seed content in memory...');
  validateCategoryContent(CATEGORY_SEED_DATA);
  console.log('   Category pre-write validation passed.');

  // 2. Connect standalone Prisma Client
  console.log('2. Connecting Prisma client...');
  const prisma = createSeedPrismaClient();

  try {
    // 3. Capture protected table baseline counts
    const initialCounts = await captureProtectedTableCounts(prisma);

    // 4. Run category upserts in transaction
    console.log('3. Upserting 8 Element Categories...');
    await prisma.$transaction(async (tx) => {
      await seedCategoriesStep(tx, CATEGORY_SEED_DATA);
    });
    console.log('   Category upserts complete.');

    // 5. Run post-seed verification
    console.log('4. Verifying database state...');
    await verifyCategorySeed(prisma, CATEGORY_SEED_DATA, initialCounts);
    console.log('--- Seed execution finished successfully ---');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  console.error('SEED_FATAL_ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
