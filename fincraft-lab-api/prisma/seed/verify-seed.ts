import { PrismaClient } from '../../src/database/generated/prisma/client';
import { CategorySeedInput } from './content/categories';
import { ElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CATEGORY_COUNT,
  EXPECTED_DISCOVERY_ELEMENT_COUNT,
  EXPECTED_STARTER_ELEMENT_COUNT,
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
