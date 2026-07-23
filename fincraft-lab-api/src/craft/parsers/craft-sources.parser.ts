import type { CraftSourceResponse } from '../types/craft-response.type';

/**
 * Validates and safe-copies untrusted raw JSON sources into a typed CraftSourceResponse array.
 *
 * Rules:
 * 1. Accepts unknown input value.
 * 2. Rejects non-array input values.
 * 3. Returns a new empty array if input is an empty array.
 * 4. Rejects null, primitive, array, or non-object items.
 * 5. Requires exactly three own properties: 'title', 'organization', 'url'.
 * 6. Rejects missing fields, extra enumerable fields, or non-string values.
 * 7. Rejects empty or whitespace-only strings.
 * 8. Returns a new array of new plain objects with preserved string values.
 */
export function parseCraftSources(rawSources: unknown): CraftSourceResponse[] {
  if (!Array.isArray(rawSources)) {
    throw new Error('Invalid craft sources configuration');
  }

  const result: CraftSourceResponse[] = [];
  const sources: unknown[] = rawSources;

  for (const item of sources) {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error('Invalid craft sources configuration');
    }

    const record: Record<string, unknown> = item;
    const keys = Object.keys(record);
    if (keys.length !== 3) {
      throw new Error('Invalid craft sources configuration');
    }

    if (
      !Object.prototype.hasOwnProperty.call(record, 'title') ||
      !Object.prototype.hasOwnProperty.call(record, 'organization') ||
      !Object.prototype.hasOwnProperty.call(record, 'url')
    ) {
      throw new Error('Invalid craft sources configuration');
    }

    const title = record.title;
    const organization = record.organization;
    const url = record.url;

    if (
      typeof title !== 'string' ||
      typeof organization !== 'string' ||
      typeof url !== 'string'
    ) {
      throw new Error('Invalid craft sources configuration');
    }

    if (
      title.trim().length === 0 ||
      organization.trim().length === 0 ||
      url.trim().length === 0
    ) {
      throw new Error('Invalid craft sources configuration');
    }

    result.push({
      title,
      organization,
      url,
    });
  }

  return result;
}
