import { CategorySeedInput } from './content/categories';
import { ElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CATEGORY_COUNT,
  EXPECTED_DISCOVERY_ELEMENT_COUNT,
  EXPECTED_STARTER_ELEMENT_COUNT,
  EXPECTED_TOTAL_ELEMENT_COUNT,
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

export function validateAllElementContent(
  starters: ElementSeedInput[],
  discoveries: ElementSeedInput[],
  plannedCategories: CategorySeedInput[],
): void {
  const errors: string[] = [];

  if (starters.length !== EXPECTED_STARTER_ELEMENT_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_STARTER_ELEMENT_COUNT} starter elements, but found ${starters.length}`,
    );
  }

  if (discoveries.length !== EXPECTED_DISCOVERY_ELEMENT_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_DISCOVERY_ELEMENT_COUNT} discovery elements, but found ${discoveries.length}`,
    );
  }

  const combined = [...starters, ...discoveries];
  if (combined.length !== EXPECTED_TOTAL_ELEMENT_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_TOTAL_ELEMENT_COUNT} total elements, but found ${combined.length}`,
    );
  }

  const plannedCategoryNames = new Set(plannedCategories.map((c) => c.name));
  const seenSlugs = new Set<string>();
  const seenNames = new Set<string>();
  const seenSortOrders = new Set<number>();

  for (const elem of starters) {
    if (elem.isStarter !== true) {
      errors.push(`Starter element "${elem.slug}" must have isStarter: true`);
    }
  }

  for (const elem of discoveries) {
    if (elem.isStarter !== false) {
      errors.push(`Discovery element "${elem.slug}" must have isStarter: false`);
    }
  }

  for (let i = 0; i < combined.length; i++) {
    const elem = combined[i];

    if (!elem.slug || elem.slug.trim().length === 0) {
      errors.push(`Element index ${i} has empty slug`);
    } else {
      const normalizedSlug = elem.slug.trim().toLowerCase();
      if (seenSlugs.has(normalizedSlug)) {
        errors.push(`Duplicate element slug detected: "${elem.slug}"`);
      }
      seenSlugs.add(normalizedSlug);
    }

    if (!elem.name || elem.name.trim().length === 0) {
      errors.push(`Element index ${i} has empty name`);
    } else {
      const normalizedName = elem.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        errors.push(`Duplicate element name detected: "${elem.name}"`);
      }
      seenNames.add(normalizedName);
    }

    if (!elem.emoji || elem.emoji.trim().length === 0) {
      errors.push(`Element "${elem.slug}" has empty emoji`);
    }

    if (!plannedCategoryNames.has(elem.categoryName)) {
      errors.push(
        `Element "${elem.slug}" references unknown category name: "${elem.categoryName}"`,
      );
    }

    if (elem.sortOrder === undefined || elem.sortOrder < 1) {
      errors.push(`Element "${elem.slug}" has invalid sortOrder: ${elem.sortOrder}`);
    } else if (seenSortOrders.has(elem.sortOrder)) {
      errors.push(`Duplicate element sortOrder detected: ${elem.sortOrder} on "${elem.slug}"`);
    } else {
      seenSortOrders.add(elem.sortOrder);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Element Pre-Write Validation Failed:\n- ${errors.join('\n- ')}`,
    );
  }
}
