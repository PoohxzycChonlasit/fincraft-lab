import { RealityLevel, SafetyLabel } from '../../src/database/generated/prisma/client';
import { CategorySeedInput } from './content/categories';
import { DiscoveryElementDetailSeedInput } from './content/discovery-element-details-batch-a';
import { StarterElementDetailSeedInput } from './content/starter-element-details';
import { ElementSeedInput } from './content/starter-elements';
import {
  EXPECTED_CATEGORY_COUNT,
  EXPECTED_DISCOVERY_DETAIL_BATCH_A_COUNT,
  EXPECTED_DISCOVERY_DETAIL_BATCH_B_COUNT,
  EXPECTED_DISCOVERY_ELEMENT_COUNT,
  EXPECTED_STARTER_DETAIL_COUNT,
  EXPECTED_STARTER_ELEMENT_COUNT,
  EXPECTED_TOTAL_DETAIL_COUNT,
  EXPECTED_TOTAL_ELEMENT_COUNT,
} from './seed-manifest';
import { cleanCanonicalUrl, findTrustedAuthority } from './trusted-source-registry';

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
      const slug = elem.slug.trim().toLowerCase();
      if (!/^[a-z0-9-]+$/.test(slug)) {
        errors.push(`Element slug "${elem.slug}" has invalid format`);
      }
      if (seenSlugs.has(slug)) {
        errors.push(`Duplicate element slug detected: "${elem.slug}"`);
      }
      seenSlugs.add(slug);
    }

    if (!elem.name || elem.name.trim().length === 0) {
      errors.push(`Element "${elem.slug}" has empty name`);
    } else {
      const normalizedName = elem.name.trim().toLowerCase();
      if (seenNames.has(normalizedName)) {
        errors.push(`Duplicate element name detected: "${elem.name.trim()}"`);
      }
      seenNames.add(normalizedName);
    }

    if (!elem.categoryName || elem.categoryName.trim().length === 0) {
      errors.push(`Element "${elem.slug}" has empty categoryName`);
    } else if (!plannedCategoryNames.has(elem.categoryName)) {
      errors.push(
        `Element "${elem.slug}" references unmapped categoryName "${elem.categoryName}"`,
      );
    }

    if (elem.sortOrder === undefined || elem.sortOrder < 1) {
      errors.push(`Element "${elem.slug}" has invalid sortOrder: ${elem.sortOrder}`);
    } else if (seenSortOrders.has(elem.sortOrder)) {
      errors.push(`Element "${elem.slug}" has duplicate sortOrder: ${elem.sortOrder}`);
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

export function validateAllDetailContent(
  starterDetails: StarterElementDetailSeedInput[],
  batchADetails: DiscoveryElementDetailSeedInput[],
  batchBDetails: DiscoveryElementDetailSeedInput[],
  starters: ElementSeedInput[],
  discoveries: ElementSeedInput[],
): void {
  const errors: string[] = [];

  if (starterDetails.length !== EXPECTED_STARTER_DETAIL_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_STARTER_DETAIL_COUNT} starter details, but found ${starterDetails.length}`,
    );
  }

  if (batchADetails.length !== EXPECTED_DISCOVERY_DETAIL_BATCH_A_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_DISCOVERY_DETAIL_BATCH_A_COUNT} Batch A discovery details, but found ${batchADetails.length}`,
    );
  }

  if (batchBDetails.length !== EXPECTED_DISCOVERY_DETAIL_BATCH_B_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_DISCOVERY_DETAIL_BATCH_B_COUNT} Batch B discovery details, but found ${batchBDetails.length}`,
    );
  }

  const combinedDetails = [...starterDetails, ...batchADetails, ...batchBDetails];
  if (combinedDetails.length !== EXPECTED_TOTAL_DETAIL_COUNT) {
    errors.push(
      `Expected exactly ${EXPECTED_TOTAL_DETAIL_COUNT} combined details, but found ${combinedDetails.length}`,
    );
  }

  const starterSlugSet = new Set(starters.map((s) => s.slug));
  const batchADiscoverySlugs = discoveries.slice(0, 11).map((d) => d.slug);
  const batchBDiscoverySlugs = discoveries.slice(11).map((d) => d.slug);
  const batchADiscoverySlugSet = new Set(batchADiscoverySlugs);
  const batchBDiscoverySlugSet = new Set(batchBDiscoverySlugs);

  const seenSlugs = new Set<string>();
  const validRealityLevels = new Set(Object.values(RealityLevel));
  const validSafetyLabels = new Set(Object.values(SafetyLabel));

  for (const detail of starterDetails) {
    const slug = detail.elementSlug.trim().toLowerCase();
    if (seenSlugs.has(slug)) {
      errors.push(`Duplicate detail elementSlug detected: "${detail.elementSlug}"`);
    }
    seenSlugs.add(slug);
    if (!starterSlugSet.has(slug)) {
      errors.push(`Starter Detail elementSlug "${detail.elementSlug}" is not a recognized Starter Element`);
    }
  }

  for (const detail of batchADetails) {
    const slug = detail.elementSlug.trim().toLowerCase();
    if (seenSlugs.has(slug)) {
      errors.push(`Duplicate detail elementSlug detected: "${detail.elementSlug}"`);
    }
    seenSlugs.add(slug);
    if (!batchADiscoverySlugSet.has(slug)) {
      errors.push(`Batch A Detail elementSlug "${detail.elementSlug}" is not a recognized Batch A Discovery Element`);
    }
  }

  for (const detail of batchBDetails) {
    const slug = detail.elementSlug.trim().toLowerCase();
    if (seenSlugs.has(slug)) {
      errors.push(`Duplicate detail elementSlug detected: "${detail.elementSlug}"`);
    }
    seenSlugs.add(slug);
    if (!batchBDiscoverySlugSet.has(slug)) {
      errors.push(`Batch B Detail elementSlug "${detail.elementSlug}" is not a recognized Batch B Discovery Element`);
    }
  }

  for (const detail of combinedDetails) {
    const textFields: Array<{ name: keyof StarterElementDetailSeedInput; val: string | undefined }> = [
      { name: 'shortDescription', val: detail.shortDescription },
      { name: 'realLesson', val: detail.realLesson },
      { name: 'example', val: detail.example },
      { name: 'possibleBenefit', val: detail.possibleBenefit },
      { name: 'possibleTradeoff', val: detail.possibleTradeoff },
      { name: 'hiddenRisk', val: detail.hiddenRisk },
      { name: 'worksWhen', val: detail.worksWhen },
      { name: 'becomesDifficultWhen', val: detail.becomesDifficultWhen },
      { name: 'whatChangesOutcome', val: detail.whatChangesOutcome },
    ];

    for (const field of textFields) {
      if (!field.val || field.val.trim().length === 0) {
        errors.push(`Detail "${detail.elementSlug}" has empty field: ${field.name}`);
      } else if (field.val.includes('TODO') || field.val.includes('TBD')) {
        errors.push(`Detail "${detail.elementSlug}" has placeholder text in field ${field.name}`);
      }
    }

    if (!validRealityLevels.has(detail.realityLevel)) {
      errors.push(`Detail "${detail.elementSlug}" has invalid realityLevel: ${String(detail.realityLevel)}`);
    }

    if (!validSafetyLabels.has(detail.safetyLabel)) {
      errors.push(`Detail "${detail.elementSlug}" has invalid safetyLabel: ${String(detail.safetyLabel)}`);
    }

    if (!Array.isArray(detail.sources) || detail.sources.length === 0) {
      errors.push(`Detail "${detail.elementSlug}" must have at least one source object`);
    } else {
      const itemCanonicalUrls = new Set<string>();
      for (let j = 0; j < detail.sources.length; j++) {
        const src = detail.sources[j];
        if (!src.title || src.title.trim().length === 0) {
          errors.push(`Detail "${detail.elementSlug}" source ${j} has empty title`);
        } else if (/[\u0E00-\u0E7F]/.test(src.title)) {
          errors.push(`Detail "${detail.elementSlug}" source ${j} title contains Thai characters: "${src.title}"`);
        }

        if (!src.organization || src.organization.trim().length === 0) {
          errors.push(`Detail "${detail.elementSlug}" source ${j} has empty organization`);
        }

        if (!src.url || src.url.trim().length === 0) {
          errors.push(`Detail "${detail.elementSlug}" source ${j} has empty url`);
        } else {
          try {
            const parsedUrl = new URL(src.url);
            if (parsedUrl.protocol !== 'https:') {
              errors.push(`Detail "${detail.elementSlug}" source ${j} URL scheme must be https: (got ${parsedUrl.protocol})`);
            }
            if (parsedUrl.hostname.endsWith('.th') || /[\u0E00-\u0E7F]/.test(parsedUrl.hostname)) {
              errors.push(`Detail "${detail.elementSlug}" source ${j} has Thai domain: "${parsedUrl.hostname}"`);
            }

            const authority = findTrustedAuthority(parsedUrl.hostname);
            if (!authority) {
              errors.push(`Detail "${detail.elementSlug}" source ${j} host "${parsedUrl.hostname}" is not in trusted authority registry`);
            } else {
              if (src.organization !== authority.organization) {
                errors.push(`Detail "${detail.elementSlug}" source ${j} organization "${src.organization}" does not match registry "${authority.organization}"`);
              }
              if (src.jurisdiction && src.jurisdiction !== authority.jurisdiction) {
                errors.push(`Detail "${detail.elementSlug}" source ${j} jurisdiction "${src.jurisdiction}" does not match registry "${authority.jurisdiction}"`);
              }
              if (src.sourceType && src.sourceType !== authority.sourceType) {
                errors.push(`Detail "${detail.elementSlug}" source ${j} sourceType "${src.sourceType}" does not match registry "${authority.sourceType}"`);
              }
            }

            const cleaned = cleanCanonicalUrl(src.url);
            if (itemCanonicalUrls.has(cleaned)) {
              errors.push(`Detail "${detail.elementSlug}" source ${j} duplicate canonical URL: "${cleaned}"`);
            }
            itemCanonicalUrls.add(cleaned);
          } catch {
            errors.push(`Detail "${detail.elementSlug}" source ${j} has invalid URL syntax: "${src.url}"`);
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Detail Pre-Write Validation Failed:\n- ${errors.join('\n- ')}`,
    );
  }
}
