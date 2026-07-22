import { CategorySeedInput } from './content/categories';
import { EXPECTED_CATEGORY_COUNT } from './seed-manifest';

export function validateCategoryContent(categories: CategorySeedInput[]): void {
  const errors: string[] = [];

  if (categories.length !== EXPECTED_CATEGORY_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_CATEGORY_COUNT} categories, but found ${categories.length}`,
    );
  }

  const seenNames = new Set<string>();
  const seenSortOrders = new Set<number>();

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];

    if (!cat.name || cat.name.trim().length === 0) {
      errors.push(`Category index ${i} has empty name`);
    } else {
      const normalizedName = cat.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        errors.push(`Duplicate category name detected: "${cat.name.trim()}"`);
      }
      seenNames.add(normalizedName);
    }

    if (!cat.description || cat.description.trim().length === 0) {
      errors.push(`Category "${cat.name}" has empty description`);
    }

    if (cat.sortOrder === undefined || cat.sortOrder < 1) {
      errors.push(
        `Category "${cat.name}" has invalid sortOrder: ${cat.sortOrder}`,
      );
    } else if (seenSortOrders.has(cat.sortOrder)) {
      errors.push(
        `Category "${cat.name}" has duplicate sortOrder: ${cat.sortOrder}`,
      );
    } else {
      seenSortOrders.add(cat.sortOrder);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Category Pre-Write Validation Failed:\n- ${errors.join('\n- ')}`,
    );
  }
}
