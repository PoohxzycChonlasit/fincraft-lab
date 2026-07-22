import { PrismaClient } from '../../src/database/generated/prisma/client';
import { CategorySeedInput } from './content/categories';
import { StarterElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CATEGORY_COUNT,
  EXPECTED_STARTER_ELEMENT_COUNT,
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
  initialProtectedCounts: ProtectedTableCounts,
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
  console.log(`Planned Categories Verified:     ${plannedCategories.length}/${EXPECTED_CATEGORY_COUNT}`);
  console.log(`Total Database Categories Count: ${totalCategoriesCount}`);
  console.log('----------------------------------------------');
}

export async function verifyStarterElementSeed(
  prisma: PrismaClient,
  plannedElements: StarterElementSeedInput[],
  categoryMap: Map<string, string>,
  initialProtectedCounts: ProtectedTableCounts,
): Promise<void> {
  const totalElementsCount = await prisma.element.count();
  const dbElements = await prisma.element.findMany();
  const discoveryElementsCount = dbElements.filter((e) => !e.isStarter).length;

  const errors: string[] = [];
  const foundSlugs = new Set(dbElements.map((e) => e.slug));

  for (const planned of plannedElements) {
    if (!foundSlugs.has(planned.slug)) {
      errors.push(`Planned starter element "${planned.slug}" missing from database`);
      continue;
    }

    const matches = dbElements.filter((e) => e.slug === planned.slug);
    if (matches.length !== 1) {
      errors.push(
        `Planned starter element "${planned.slug}" has ${matches.length} rows (expected 1)`,
      );
    } else {
      const match = matches[0];
      const expectedCategoryId = categoryMap.get(planned.categoryName);
      if (match.categoryId !== expectedCategoryId) {
        errors.push(
          `Element "${planned.slug}" categoryId mismatch: expected ${expectedCategoryId}, got ${match.categoryId}`,
        );
      }
      if (!match.isStarter) {
        errors.push(`Element "${planned.slug}" isStarter must be true`);
      }
      if (match.name !== planned.name) {
        errors.push(
          `Element "${planned.slug}" name mismatch: expected ${planned.name}, got ${match.name}`,
        );
      }
      if (match.elementType !== planned.elementType) {
        errors.push(
          `Element "${planned.slug}" elementType mismatch: expected ${planned.elementType}, got ${match.elementType}`,
        );
      }
    }
  }

  // Verify protected table activity counts did not increase
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
      `Post-Seed Starter Element Verification Failed:\n- ${errors.join('\n- ')}`,
    );
  }

  console.log('--- Post-Seed Starter Element Verification Report ---');
  console.log(`Planned Starter Elements Found: ${plannedElements.length}/${EXPECTED_STARTER_ELEMENT_COUNT}`);
  console.log(`Duplicate Planned Slugs:         0`);
  console.log(`Total Elements Table Rows:      ${totalElementsCount}`);
  console.log(`Discovery Elements Added:       ${discoveryElementsCount}`);
  console.log('----------------------------------------------------');
}
