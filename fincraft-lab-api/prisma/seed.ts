import { CATEGORY_SEED_DATA } from './seed/content/categories';
import { DISCOVERY_ELEMENT_SEED_DATA } from './seed/content/discovery-elements';
import { STARTER_ELEMENT_SEED_DATA } from './seed/content/starter-elements';
import { createSeedPrismaClient } from './seed/seed-client';
import { seedCategoriesStep } from './seed/steps/seed-categories';
import { seedElementsStep } from './seed/steps/seed-elements';
import {
  validateAllElementContent,
  validateCategoryContent,
} from './seed/validate-seed';
import {
  captureProtectedTableCounts,
  verifyCategorySeed,
  verifyElementSeed,
} from './seed/verify-seed';

async function main(): Promise<void> {
  console.log('--- FinCraft Lab Seed v1 (Complete Elements Slice) ---');

  // 1. In-memory pre-write validation before DB connection
  console.log('1. Validating Category and 36 Element seed content in memory...');
  validateCategoryContent(CATEGORY_SEED_DATA);
  validateAllElementContent(
    STARTER_ELEMENT_SEED_DATA,
    DISCOVERY_ELEMENT_SEED_DATA,
    CATEGORY_SEED_DATA,
  );
  console.log('   Pre-write content validation passed.');

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

    // 5. Query and resolve Category IDs from database using Map<string, string>
    console.log('4. Querying and resolving Category IDs from database...');
    const dbCategories = await prisma.elementCategory.findMany();
    const categoryMap = new Map<string, string>();
    for (const cat of dbCategories) {
      categoryMap.set(cat.name, cat.id);
    }

    // Mode B check: verify all required planned categories exist in DB Map
    const allElements = [
      ...STARTER_ELEMENT_SEED_DATA,
      ...DISCOVERY_ELEMENT_SEED_DATA,
    ];
    const missingCategoryNames: string[] = [];
    for (const elem of allElements) {
      if (!categoryMap.has(elem.categoryName)) {
        missingCategoryNames.push(elem.categoryName);
      }
    }

    if (missingCategoryNames.length > 0) {
      throw new Error(
        `Database missing required Categories for Elements: ${Array.from(
          new Set(missingCategoryNames),
        ).join(', ')}`,
      );
    }
    console.log('   Category resolution complete.');

    // 6. Run all 36 Element upserts in transaction
    console.log('5. Upserting 36 Elements (14 Starter + 22 Discovery)...');
    await prisma.$transaction(async (tx) => {
      await seedElementsStep(tx, allElements, categoryMap);
    });
    console.log('   Element upserts complete.');

    // 7. Run post-seed verification
    console.log('6. Verifying database state...');
    await verifyCategorySeed(prisma, CATEGORY_SEED_DATA);
    await verifyElementSeed(
      prisma,
      STARTER_ELEMENT_SEED_DATA,
      DISCOVERY_ELEMENT_SEED_DATA,
      categoryMap,
      initialCounts,
    );
    console.log('--- Seed execution finished successfully ---');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  console.error('SEED_FATAL_ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
