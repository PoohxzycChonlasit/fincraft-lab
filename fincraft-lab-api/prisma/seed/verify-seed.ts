import { PrismaClient } from '../../src/database/generated/prisma/client';
import { CategorySeedInput } from './content/categories';
import { DiscoveryElementDetailSeedInput } from './content/discovery-element-details-batch-a';
import { StarterElementDetailSeedInput } from './content/starter-element-details';
import { ElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CATEGORY_COUNT,
  EXPECTED_CORE_CRAFT_RECIPE_COUNT,
  EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT,
  EXPECTED_DISCOVERY_DETAIL_BATCH_A_COUNT,
  EXPECTED_DISCOVERY_DETAIL_BATCH_B_COUNT,
  EXPECTED_DISCOVERY_ELEMENT_COUNT,
  EXPECTED_STARTER_DETAIL_COUNT,
  EXPECTED_STARTER_ELEMENT_COUNT,
  EXPECTED_TOTAL_DETAIL_COUNT,
  EXPECTED_TOTAL_ELEMENT_COUNT,
} from './seed-manifest';

export interface ProtectedTableCounts {
  users: number;
  pets: number;
  userElements: number;
  discoveryEvents: number;
  workspaces: number;
  workspaceNodes: number;
  workspaceEdges: number;
  simulationRuns: number;
}

export async function captureProtectedTableCounts(
  prisma: PrismaClient,
): Promise<ProtectedTableCounts> {
  const [
    users,
    pets,
    userElements,
    discoveryEvents,
    workspaces,
    workspaceNodes,
    workspaceEdges,
    simulationRuns,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.pet.count(),
    prisma.userElement.count(),
    prisma.discoveryEvent.count(),
    prisma.workspace.count(),
    prisma.workspaceNode.count(),
    prisma.workspaceEdge.count(),
    prisma.simulationRun.count(),
  ]);

  return {
    users,
    pets,
    userElements,
    discoveryEvents,
    workspaces,
    workspaceNodes,
    workspaceEdges,
    simulationRuns,
  };
}

export async function verifyCategorySeed(
  prisma: PrismaClient,
  plannedCategories: CategorySeedInput[],
): Promise<void> {
  const totalCategoriesCount = await prisma.elementCategory.count();
  const dbCategories = await prisma.elementCategory.findMany();

  const errors: string[] = [];
  const foundNames = new Set(dbCategories.map((c) => c.name));

  for (const planned of plannedCategories) {
    if (!foundNames.has(planned.name)) {
      errors.push(`Planned category "${planned.name}" missing from database`);
      continue;
    }

    const matches = dbCategories.filter((c) => c.name === planned.name);
    if (matches.length !== 1) {
      errors.push(
        `Planned category "${planned.name}" has ${matches.length} rows (expected 1)`,
      );
    } else {
      const match = matches[0];
      if (match.sortOrder !== planned.sortOrder) {
        errors.push(
          `Category "${planned.name}" sortOrder mismatch: expected ${planned.sortOrder}, got ${match.sortOrder}`,
        );
      }
      if (match.status !== planned.status) {
        errors.push(
          `Category "${planned.name}" status mismatch: expected ${planned.status}, got ${match.status}`,
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Post-Seed Category Verification Failed:\n- ${errors.join('\n- ')}`,
    );
  }

  console.log('--- Post-Seed Category Verification Report ---');
  console.log(`Planned Categories Found:       ${plannedCategories.length}/${EXPECTED_CATEGORY_COUNT}`);
  console.log(`Total Database Categories Count: ${totalCategoriesCount}`);
  console.log('----------------------------------------------');
}

export async function verifyElementSeed(
  prisma: PrismaClient,
  plannedStarters: ElementSeedInput[],
  plannedDiscoveries: ElementSeedInput[],
  categoryMap: Map<string, string>,
  initialProtectedCounts: ProtectedTableCounts,
): Promise<void> {
  const totalElementsCount = await prisma.element.count();
  const dbElements = await prisma.element.findMany();

  const errors: string[] = [];
  const foundSlugs = new Set(dbElements.map((e) => e.slug));

  let verifiedStarters = 0;
  for (const planned of plannedStarters) {
    if (!foundSlugs.has(planned.slug)) {
      errors.push(`Planned starter element "${planned.slug}" missing from database`);
      continue;
    }
    const matches = dbElements.filter((e) => e.slug === planned.slug);
    if (matches.length !== 1) {
      errors.push(`Planned starter element "${planned.slug}" has ${matches.length} rows (expected 1)`);
    } else {
      const match = matches[0];
      const expectedCatId = categoryMap.get(planned.categoryName);
      if (match.categoryId !== expectedCatId) {
        errors.push(`Starter element "${planned.slug}" categoryId mismatch`);
      }
      if (!match.isStarter) {
        errors.push(`Starter element "${planned.slug}" isStarter must be true`);
      }
      verifiedStarters++;
    }
  }

  let verifiedDiscoveries = 0;
  for (const planned of plannedDiscoveries) {
    if (!foundSlugs.has(planned.slug)) {
      errors.push(`Planned discovery element "${planned.slug}" missing from database`);
      continue;
    }
    const matches = dbElements.filter((e) => e.slug === planned.slug);
    if (matches.length !== 1) {
      errors.push(`Planned discovery element "${planned.slug}" has ${matches.length} rows (expected 1)`);
    } else {
      const match = matches[0];
      const expectedCatId = categoryMap.get(planned.categoryName);
      if (match.categoryId !== expectedCatId) {
        errors.push(`Discovery element "${planned.slug}" categoryId mismatch`);
      }
      if (match.isStarter) {
        errors.push(`Discovery element "${planned.slug}" isStarter must be false`);
      }
      verifiedDiscoveries++;
    }
  }

  // Verify protected table activity counts did not change
  const currentProtectedCounts = await captureProtectedTableCounts(prisma);
  const activityKeys: Array<keyof ProtectedTableCounts> = [
    'users',
    'pets',
    'userElements',
    'discoveryEvents',
    'workspaces',
    'workspaceNodes',
    'workspaceEdges',
    'simulationRuns',
  ];

  console.log('--- Protected Table Count Verification ---');
  for (const key of activityKeys) {
    const before = initialProtectedCounts[key];
    const after = currentProtectedCounts[key];
    const delta = after - before;
    console.log(`- ${key}: before=${before}, after=${after}, delta=${delta}`);

    if (delta !== 0) {
      errors.push(
        `Protected table "${key}" count changed from ${before} to ${after} (delta: ${delta})`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Post-Seed Element Verification Failed:\n- ${errors.join('\n- ')}`,
    );
  }

  console.log('--- Post-Seed Element Verification Report ---');
  console.log(`Planned Categories Found:        ${EXPECTED_CATEGORY_COUNT}/${EXPECTED_CATEGORY_COUNT}`);
  console.log(`Planned Starter Elements Found:   ${verifiedStarters}/${EXPECTED_STARTER_ELEMENT_COUNT}`);
  console.log(`Planned Discovery Elements Found: ${verifiedDiscoveries}/${EXPECTED_DISCOVERY_ELEMENT_COUNT}`);
  console.log(`Planned Combined Elements Found:  ${verifiedStarters + verifiedDiscoveries}/${EXPECTED_TOTAL_ELEMENT_COUNT}`);
  console.log(`Total Elements Table Rows:        ${totalElementsCount}`);
  console.log('----------------------------------------------------');
}

export async function verifyDetailSeed(
  prisma: PrismaClient,
  plannedStarterDetails: StarterElementDetailSeedInput[],
  plannedBatchADetails: DiscoveryElementDetailSeedInput[],
  plannedBatchBDetails: DiscoveryElementDetailSeedInput[],
  plannedStarters: ElementSeedInput[],
  plannedDiscoveries: ElementSeedInput[],
): Promise<void> {
  const totalDetailsCount = await prisma.discoveryDetail.count();
  const dbDetails = await prisma.discoveryDetail.findMany({
    include: { element: true },
  });

  const errors: string[] = [];

  const starterSlugSet = new Set(plannedStarters.map((s) => s.slug));
  const batchADiscoverySlugs = plannedDiscoveries.slice(0, 11).map((d) => d.slug);
  const batchBDiscoverySlugs = plannedDiscoveries.slice(11).map((d) => d.slug);
  const batchADiscoverySlugSet = new Set(batchADiscoverySlugs);
  const batchBDiscoverySlugSet = new Set(batchBDiscoverySlugs);

  // Helper to verify fields and sources of a detail
  const verifyDetailFields = (
    match: typeof dbDetails[0],
    planned: StarterElementDetailSeedInput | DiscoveryElementDetailSeedInput,
  ) => {
    if (match.shortDescription !== planned.shortDescription) {
      errors.push(`Detail "${planned.elementSlug}" shortDescription mismatch`);
    }
    if (match.realLesson !== planned.realLesson) {
      errors.push(`Detail "${planned.elementSlug}" realLesson mismatch`);
    }
    if (match.example !== planned.example) {
      errors.push(`Detail "${planned.elementSlug}" example mismatch`);
    }
    if (match.possibleBenefit !== planned.possibleBenefit) {
      errors.push(`Detail "${planned.elementSlug}" possibleBenefit mismatch`);
    }
    if (match.possibleTradeoff !== planned.possibleTradeoff) {
      errors.push(`Detail "${planned.elementSlug}" possibleTradeoff mismatch`);
    }
    if (match.hiddenRisk !== planned.hiddenRisk) {
      errors.push(`Detail "${planned.elementSlug}" hiddenRisk mismatch`);
    }
    if (match.worksWhen !== planned.worksWhen) {
      errors.push(`Detail "${planned.elementSlug}" worksWhen mismatch`);
    }
    if (match.becomesDifficultWhen !== planned.becomesDifficultWhen) {
      errors.push(`Detail "${planned.elementSlug}" becomesDifficultWhen mismatch`);
    }
    if (match.whatChangesOutcome !== planned.whatChangesOutcome) {
      errors.push(`Detail "${planned.elementSlug}" whatChangesOutcome mismatch`);
    }
    if (match.realityLevel !== planned.realityLevel) {
      errors.push(`Detail "${planned.elementSlug}" realityLevel mismatch`);
    }
    if (match.safetyLabel !== planned.safetyLabel) {
      errors.push(`Detail "${planned.elementSlug}" safetyLabel mismatch`);
    }

    // Safe runtime narrowing for Prisma JsonValue sources
    const rawSources = match.sources;
    if (!Array.isArray(rawSources)) {
      errors.push(`Detail "${planned.elementSlug}" sources is not an array`);
    } else {
      if (rawSources.length !== planned.sources.length) {
        errors.push(
          `Detail "${planned.elementSlug}" sources count mismatch: expected ${planned.sources.length}, got ${rawSources.length}`,
        );
      }
      for (let i = 0; i < rawSources.length; i++) {
        const item = rawSources[i];
        const expectedSrc = planned.sources[i];

        if (
          item === null ||
          typeof item !== 'object' ||
          Array.isArray(item)
        ) {
          errors.push(`Detail "${planned.elementSlug}" source ${i} is not a valid non-null object`);
          continue;
        }

        const requiredKeys = ['organization', 'title', 'url'];
        const hasAllRequired = requiredKeys.every((k) => k in (item as Record<string, unknown>));
        if (!hasAllRequired) {
          errors.push(
            `Detail "${planned.elementSlug}" source ${i} missing required keys (organization, title, url)`,
          );
        }

        const srcObj = item as Record<string, unknown>;
        if (
          typeof srcObj.title !== 'string' ||
          typeof srcObj.organization !== 'string' ||
          typeof srcObj.url !== 'string'
        ) {
          errors.push(`Detail "${planned.elementSlug}" source ${i} has non-string properties`);
        } else {
          if (srcObj.title !== expectedSrc.title) {
            errors.push(
              `Detail "${planned.elementSlug}" source ${i} title mismatch: expected "${expectedSrc.title}", got "${srcObj.title}"`,
            );
          }
          if (srcObj.organization !== expectedSrc.organization) {
            errors.push(
              `Detail "${planned.elementSlug}" source ${i} organization mismatch: expected "${expectedSrc.organization}", got "${srcObj.organization}"`,
            );
          }
          if (srcObj.url !== expectedSrc.url) {
            errors.push(
              `Detail "${planned.elementSlug}" source ${i} url mismatch: expected "${expectedSrc.url}", got "${srcObj.url}"`,
            );
          }
        }
      }
    }
  };

  let verifiedStarterDetails = 0;
  for (const planned of plannedStarterDetails) {
    const matches = dbDetails.filter((d) => d.element.slug === planned.elementSlug);
    if (matches.length === 0) {
      errors.push(`Planned detail for starter element "${planned.elementSlug}" missing from database`);
    } else if (matches.length > 1) {
      errors.push(`Duplicate detail rows found for starter element "${planned.elementSlug}" (${matches.length} rows)`);
    } else {
      const match = matches[0];
      if (!match.element.isStarter) {
        errors.push(`Starter detail "${planned.elementSlug}" attached to an element where isStarter is false`);
      }
      verifyDetailFields(match, planned);
      verifiedStarterDetails++;
    }
  }

  let verifiedBatchADetails = 0;
  for (const planned of plannedBatchADetails) {
    const matches = dbDetails.filter((d) => d.element.slug === planned.elementSlug);
    if (matches.length === 0) {
      errors.push(`Planned detail for Batch A discovery element "${planned.elementSlug}" missing from database`);
    } else if (matches.length > 1) {
      errors.push(`Duplicate detail rows found for Batch A discovery element "${planned.elementSlug}" (${matches.length} rows)`);
    } else {
      const match = matches[0];
      if (match.element.isStarter) {
        errors.push(`Batch A detail "${planned.elementSlug}" attached to a Starter element (expected isStarter false)`);
      }
      if (!batchADiscoverySlugSet.has(planned.elementSlug)) {
        errors.push(`Batch A detail "${planned.elementSlug}" is not in Batch A discovery set`);
      }
      verifyDetailFields(match, planned);
      verifiedBatchADetails++;
    }
  }

  let verifiedBatchBDetails = 0;
  for (const planned of plannedBatchBDetails) {
    const matches = dbDetails.filter((d) => d.element.slug === planned.elementSlug);
    if (matches.length === 0) {
      errors.push(`Planned detail for Batch B discovery element "${planned.elementSlug}" missing from database`);
    } else if (matches.length > 1) {
      errors.push(`Duplicate detail rows found for Batch B discovery element "${planned.elementSlug}" (${matches.length} rows)`);
    } else {
      const match = matches[0];
      if (match.element.isStarter) {
        errors.push(`Batch B detail "${planned.elementSlug}" attached to a Starter element (expected isStarter false)`);
      }
      if (!batchBDiscoverySlugSet.has(planned.elementSlug)) {
        errors.push(`Batch B detail "${planned.elementSlug}" is not in Batch B discovery set`);
      }
      verifyDetailFields(match, planned);
      verifiedBatchBDetails++;
    }
  }

  if (totalDetailsCount !== EXPECTED_TOTAL_DETAIL_COUNT) {
    errors.push(
      `Total details count mismatch: expected ${EXPECTED_TOTAL_DETAIL_COUNT}, got ${totalDetailsCount}`,
    );
  }

  // Confirm non-detail core models match expected task state
  const [recipes, recipeInputs, relationships, simulations] = await Promise.all([
    prisma.craftRecipe.count(),
    prisma.craftRecipeInput.count(),
    prisma.elementRelationship.count(),
    prisma.simulation.count(),
  ]);

  if (
    recipes !== EXPECTED_CORE_CRAFT_RECIPE_COUNT ||
    recipeInputs !== EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT ||
    relationships !== 0 ||
    simulations !== 1
  ) {
    errors.push(
      `Unexpected core task data counts: recipes=${recipes} (expected ${EXPECTED_CORE_CRAFT_RECIPE_COUNT}), recipeInputs=${recipeInputs} (expected ${EXPECTED_CORE_CRAFT_RECIPE_INPUT_COUNT}), relationships=${relationships} (expected 0), simulations=${simulations} (expected 1)`,
    );
  }

  if (errors.length > 0) {
    throw new Error(
      `Post-Seed DiscoveryDetail Verification Failed:\n- ${errors.join('\n- ')}`,
    );
  }

  console.log('--- Post-Seed DiscoveryDetail Verification Report ---');
  console.log(`Planned Starter Details Found:   ${verifiedStarterDetails}/${EXPECTED_STARTER_DETAIL_COUNT}`);
  console.log(`Planned Batch A Details Found:   ${verifiedBatchADetails}/${EXPECTED_DISCOVERY_DETAIL_BATCH_A_COUNT}`);
  console.log(`Planned Batch B Details Found:   ${verifiedBatchBDetails}/${EXPECTED_DISCOVERY_DETAIL_BATCH_B_COUNT}`);
  console.log(`Total Database Detail Rows:      ${totalDetailsCount}/${EXPECTED_TOTAL_DETAIL_COUNT}`);
  console.log('----------------------------------------------------');
}
