import type { CraftSourceResponse } from '../types/craft-response.type';

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseCraftSources(rawSources: unknown): CraftSourceResponse[] {
  if (!Array.isArray(rawSources)) {
    throw new Error('Invalid craft sources configuration');
  }

  const result: CraftSourceResponse[] = [];
  const sources: unknown[] = rawSources;

  for (const item of sources) {
    if (!isObjectRecord(item)) {
      throw new Error('Invalid craft sources configuration');
    }

    if (
      !Object.prototype.hasOwnProperty.call(item, 'title') ||
      !Object.prototype.hasOwnProperty.call(item, 'organization') ||
      !Object.prototype.hasOwnProperty.call(item, 'url')
    ) {
      throw new Error('Invalid craft sources configuration');
    }

    const title = item.title;
    const organization = item.organization;
    const url = item.url;
    const jurisdiction =
      typeof item.jurisdiction === 'string' ? item.jurisdiction : undefined;
    const sourceType =
      typeof item.sourceType === 'string' ? item.sourceType : undefined;

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
      ...(jurisdiction ? { jurisdiction } : {}),
      ...(sourceType ? { sourceType } : {}),
    });
  }

  return result;
}
