import {
  Prisma,
  PrismaClient,
} from '../../../src/database/generated/prisma/client';
import { CategorySeedInput } from '../content/categories';

export async function seedCategoriesStep(
  prisma: Prisma.TransactionClient | PrismaClient,
  categories: CategorySeedInput[],
): Promise<void> {
  for (const cat of categories) {
    await prisma.elementCategory.upsert({
      where: { name: cat.name },
      create: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        status: cat.status,
      },
      update: {
        description: cat.description,
        sortOrder: cat.sortOrder,
        status: cat.status,
      },
    });
  }
}
