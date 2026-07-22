import { Element, Prisma } from '../../../src/database/generated/prisma/client';
import { ElementSeedInput } from '../content/starter-elements';

export async function seedElementsStep(
  tx: Prisma.TransactionClient,
  elements: ElementSeedInput[],
  categoryMap: Map<string, string>,
): Promise<Element[]> {
  const seededElements: Element[] = [];

  for (const item of elements) {
    const categoryId = categoryMap.get(item.categoryName);
    if (!categoryId) {
      throw new Error(
        `Database Category missing for Element "${item.name}" (Category: "${item.categoryName}")`,
      );
    }

    const element = await tx.element.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        name: item.name,
        categoryId,
        elementType: item.elementType,
        emoji: item.emoji,
        isStarter: item.isStarter,
        status: item.status,
      },
      update: {
        name: item.name,
        categoryId,
        elementType: item.elementType,
        emoji: item.emoji,
        isStarter: item.isStarter,
        status: item.status,
      },
    });

    seededElements.push(element);
  }

  return seededElements;
}
