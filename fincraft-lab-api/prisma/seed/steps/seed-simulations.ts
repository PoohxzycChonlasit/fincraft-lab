import {
  Prisma,
  PrismaClient,
} from '../../../src/database/generated/prisma/client';
import type { SimulationSeedInput } from '../content/simulations';

export async function seedSimulationsStep(
  prisma: Prisma.TransactionClient | PrismaClient,
  simulations: SimulationSeedInput[],
): Promise<void> {
  for (const simData of simulations) {
    let linkedElementId: string | null = null;
    if (simData.linkedElementSlug) {
      const element = await prisma.element.findUnique({
        where: { slug: simData.linkedElementSlug },
        select: { id: true },
      });
      if (!element) {
        throw new Error(
          `Prerequisite Element slug '${simData.linkedElementSlug}' not found for Simulation '${simData.simulationType}'`,
        );
      }
      linkedElementId = element.id;
    }

    await prisma.simulation.upsert({
      where: { simulationType: simData.simulationType },
      create: {
        simulationType: simData.simulationType,
        name: simData.name,
        description: simData.description,
        status: simData.status,
        linkedElementId,
      },
      update: {
        name: simData.name,
        description: simData.description,
        status: simData.status,
        linkedElementId,
      },
    });
  }
}
