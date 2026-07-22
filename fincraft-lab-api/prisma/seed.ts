import { CATEGORY_SEED_DATA } from './seed/content/categories';
import { CORE_CRAFT_RECIPE_SEED_DATA } from './seed/content/core-craft-recipes';
import { DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA } from './seed/content/discovery-element-details-batch-a';
import { DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA } from './seed/content/discovery-element-details-batch-b';
import { DISCOVERY_ELEMENT_SEED_DATA } from './seed/content/discovery-elements';
import { STARTER_ELEMENT_DETAIL_SEED_DATA } from './seed/content/starter-element-details';
import { STARTER_ELEMENT_SEED_DATA } from './seed/content/starter-elements';
import { createSeedPrismaClient } from './seed/seed-client';
import { seedCategoriesStep } from './seed/steps/seed-categories';
import { seedCraftRecipes } from './seed/steps/seed-craft-recipes';
import { seedDiscoveryDetailsStep } from './seed/steps/seed-discovery-details';
import { seedElementsStep } from './seed/steps/seed-elements';
import { validateCraftRecipeSeed } from './seed/validate-craft-recipe-seed';
import {
  validateAllDetailContent,
  validateAllElementContent,
  validateCategoryContent,
} from './seed/validate-seed';
import { verifyCraftRecipeSeed } from './seed/verify-craft-recipe-seed';
import {
  captureProtectedTableCounts,
  verifyCategorySeed,
  verifyDetailSeed,
  verifyElementSeed,
} from './seed/verify-seed';

async function main(): Promise<void> {
  console.log('--- FinCraft Lab Seed v1 (Starter + Details + Core Recipes) ---');

  // 1. In-memory pre-write validation before DB connection
  console.log('1. Validating Category, Element, Detail, and Core Recipe seed content in memory...');
  validateCategoryContent(CATEGORY_SEED_DATA);
  validateAllElementContent(
    STARTER_ELEMENT_SEED_DATA,
    DISCOVERY_ELEMENT_SEED_DATA,
    CATEGORY_SEED_DATA,
  );
  validateAllDetailContent(
    STARTER_ELEMENT_DETAIL_SEED_DATA,
    DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA,
    DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA,
    STARTER_ELEMENT_SEED_DATA,
    DISCOVERY_ELEMENT_SEED_DATA,
  );
  validateCraftRecipeSeed(
    CORE_CRAFT_RECIPE_SEED_DATA,
    STARTER_ELEMENT_SEED_DATA,
    DISCOVERY_ELEMENT_SEED_DATA,
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

    // 7. Resolve 14 Starter Element IDs by Slug and verify isStarter true
    console.log('6. Resolving 14 Starter Element IDs and verifying isStarter status...');
    const starterSlugs = STARTER_ELEMENT_SEED_DATA.map((s) => s.slug);
    const dbStarters = await prisma.element.findMany({
      where: { slug: { in: starterSlugs } },
      select: { id: true, slug: true, isStarter: true },
    });

    if (dbStarters.length !== STARTER_ELEMENT_SEED_DATA.length) {
      throw new Error(
        `Expected ${STARTER_ELEMENT_SEED_DATA.length} Starter Elements in DB, found ${dbStarters.length}`,
      );
    }

    const starterElementMap = new Map<string, string>();
    for (const elem of dbStarters) {
      if (!elem.isStarter) {
        throw new Error(
          `Target Element "${elem.slug}" is not a Starter Element (isStarter is false)`,
        );
      }
      starterElementMap.set(elem.slug, elem.id);
    }
    console.log('   Starter Element resolution complete.');

    // 8. Run 14 Starter Detail upserts in transaction
    console.log('7. Upserting 14 Starter Element DiscoveryDetails...');
    await prisma.$transaction(async (tx) => {
      await seedDiscoveryDetailsStep(
        tx,
        STARTER_ELEMENT_DETAIL_SEED_DATA,
        starterElementMap,
      );
    });
    console.log('   Starter Element DiscoveryDetail upserts complete.');

    // 9. Resolve 11 Batch A Discovery Element IDs by Slug and verify isStarter false
    console.log('8. Resolving 11 Batch A Discovery Element IDs and verifying isStarter status...');
    const batchASlugs = DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA.map((d) => d.elementSlug);
    const dbBatchADiscoveries = await prisma.element.findMany({
      where: { slug: { in: batchASlugs } },
      select: { id: true, slug: true, isStarter: true },
    });

    if (dbBatchADiscoveries.length !== DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA.length) {
      throw new Error(
        `Expected ${DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA.length} Batch A Discovery Elements in DB, found ${dbBatchADiscoveries.length}`,
      );
    }

    const batchADiscoveryElementMap = new Map<string, string>();
    for (const elem of dbBatchADiscoveries) {
      if (elem.isStarter) {
        throw new Error(
          `Target Batch A Element "${elem.slug}" is a Starter Element (isStarter is true)`,
        );
      }
      batchADiscoveryElementMap.set(elem.slug, elem.id);
    }
    console.log('   Batch A Discovery Element resolution complete.');

    // 10. Run 11 Batch A Discovery Detail upserts in transaction
    console.log('9. Upserting 11 Batch A Discovery Element DiscoveryDetails...');
    await prisma.$transaction(async (tx) => {
      await seedDiscoveryDetailsStep(
        tx,
        DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA,
        batchADiscoveryElementMap,
      );
    });
    console.log('   Batch A Discovery Element DiscoveryDetail upserts complete.');

    // 11. Resolve 11 Batch B Discovery Element IDs by Slug and verify isStarter false
    console.log('10. Resolving 11 Batch B Discovery Element IDs and verifying isStarter status...');
    const batchBSlugs = DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA.map((d) => d.elementSlug);
    const dbBatchBDiscoveries = await prisma.element.findMany({
      where: { slug: { in: batchBSlugs } },
      select: { id: true, slug: true, isStarter: true },
    });

    if (dbBatchBDiscoveries.length !== DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA.length) {
      throw new Error(
        `Expected ${DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA.length} Batch B Discovery Elements in DB, found ${dbBatchBDiscoveries.length}`,
      );
    }

    const batchBDiscoveryElementMap = new Map<string, string>();
    for (const elem of dbBatchBDiscoveries) {
      if (elem.isStarter) {
        throw new Error(
          `Target Batch B Element "${elem.slug}" is a Starter Element (isStarter is true)`,
        );
      }
      batchBDiscoveryElementMap.set(elem.slug, elem.id);
    }
    console.log('   Batch B Discovery Element resolution complete.');

    // 12. Run 11 Batch B Discovery Detail upserts in transaction
    console.log('11. Upserting 11 Batch B Discovery Element DiscoveryDetails...');
    await prisma.$transaction(async (tx) => {
      await seedDiscoveryDetailsStep(
        tx,
        DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA,
        batchBDiscoveryElementMap,
      );
    });
    console.log('   Batch B Discovery Element DiscoveryDetail upserts complete.');

    // 13. Run Core Craft Recipe preflight check & upserts
    console.log('12. Running preflight check and upserting 22 Core Craft Recipes (44 Inputs)...');
    await seedCraftRecipes(prisma);
    console.log('   Core Craft Recipe upserts complete.');

    // 14. Run post-seed verifications
    console.log('13. Verifying database state...');
    await verifyCategorySeed(prisma, CATEGORY_SEED_DATA);
    await verifyElementSeed(
      prisma,
      STARTER_ELEMENT_SEED_DATA,
      DISCOVERY_ELEMENT_SEED_DATA,
      categoryMap,
      initialCounts,
    );
    await verifyDetailSeed(
      prisma,
      STARTER_ELEMENT_DETAIL_SEED_DATA,
      DISCOVERY_ELEMENT_DETAIL_BATCH_A_SEED_DATA,
      DISCOVERY_ELEMENT_DETAIL_BATCH_B_SEED_DATA,
      STARTER_ELEMENT_SEED_DATA,
      DISCOVERY_ELEMENT_SEED_DATA,
    );
    await verifyCraftRecipeSeed(prisma);
    console.log('--- Seed execution finished successfully ---');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err: unknown) => {
  console.error('SEED_FATAL_ERROR:', err instanceof Error ? err.message : err);
  process.exit(1);
});
