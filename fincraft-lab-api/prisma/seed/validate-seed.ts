import { CategorySeedInput } from './content/categories';
import { StarterElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CATEGORY_COUNT,
  EXPECTED_STARTER_ELEMENT_COUNT,
} from './seed-manifest';

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

export function validateStarterElementContent(
  elements: StarterElementSeedInput[],
  plannedCategories: CategorySeedInput[],
): void {
  const errors: string[] = [];

  if (elements.length !== EXPECTED_STARTER_ELEMENT_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_STARTER_ELEMENT_COUNT} starter elements, but found ${elements.length}`,
    );
  }

  const plannedCategoryNames = new Set(plannedCategories.map((c) => c.name));
  const seenSlugs = new Set<string>();
  const seenNames = new Set<string>();

  for (let i = 0; i < elements.length; i++) {
    const elem = elements[i];

    if (!elem.slug || elem.slug.trim().length === 0) {
      errors.push(`Starter element index ${i} has empty slug`);
    } else {
      const normalizedSlug = elem.slug.trim().toLowerCase();
      if (seenSlugs.has(normalizedSlug)) {
        errors.push(`Duplicate starter element slug detected: "${elem.slug}"`);
      }
      seenSlugs.add(normalizedSlug);
    }

    if (!elem.name || elem.name.trim().length === 0) {
      errors.push(`Starter element index ${i} has empty name`);
    } else {
      const normalizedName = elem.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        errors.push(`Duplicate starter element name detected: "${elem.name}"`);
      }
      seenNames.add(normalizedName);
    }

    if (!elem.emoji || elem.emoji.trim().length === 0) {
      errors.push(`Starter element "${elem.slug}" has empty emoji`);
    }

    if (elem.isStarter !== true) {
      errors.push(`Starter element "${elem.slug}" must have isStarter: true`);
    }

    if (!plannedCategoryNames.has(elem.categoryName)) {
      errors.push(
        `Starter element "${elem.slug}" references unknown category name: "${elem.categoryName}"`,
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Starter Element Pre-Write Validation Failed:\n- ${errors.join('\n- ')}`,
    );
  }
}
