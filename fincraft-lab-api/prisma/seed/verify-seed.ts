import { PrismaClient } from '../../src/database/generated/prisma/client';
import { CategorySeedInput } from './content/categories';
import { EXPECTED_CATEGORY_COUNT } from './seed-manifest';

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

  for (const key of activityKeys) {
    if (currentProtectedCounts[key] !== initialProtectedCounts[key]) {
      errors.push(
        `Protected table "${key}" count changed from ${initialProtectedCounts[key]} to ${currentProtectedCounts[key]}`,
      );
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
  console.log(`Protected Activity Rows Changed: 0`);
  console.log('----------------------------------------------');
}
