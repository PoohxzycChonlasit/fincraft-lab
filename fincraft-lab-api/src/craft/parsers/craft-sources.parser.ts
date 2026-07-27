import {
  cleanCanonicalUrl,
  findTrustedAuthority,
} from '../../reference/trusted-source-registry';
import type { CraftSourceResponse } from '../types/craft-response.type';

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseCraftSources(rawSources: unknown): CraftSourceResponse[] {
  if (!Array.isArray(rawSources)) {
    throw new Error('Invalid craft sources configuration');
  }

  const result: CraftSourceResponse[] = [];
  for (const item of rawSources) {
    if (
      !isObjectRecord(item) ||
      typeof item.title !== 'string' ||
      typeof item.organization !== 'string' ||
      typeof item.url !== 'string'
    ) {
      throw new Error('Invalid craft sources configuration');
    }

    if (
      item.title.trim().length === 0 ||
      item.organization.trim().length === 0 ||
      item.url.trim().length === 0
    ) {
      throw new Error('Invalid craft sources configuration');
    }

    let hostname = '';
    try {
      hostname = new URL(item.url).hostname;
    } catch {
      throw new Error('Invalid craft source URL syntax');
    }

    const authority = findTrustedAuthority(hostname);
    const jurisdiction =
      (typeof item.jurisdiction === 'string' ? item.jurisdiction : undefined) ||
      authority?.jurisdiction ||
      'GLOBAL';
    const sourceType =
      (typeof item.sourceType === 'string' ? item.sourceType : undefined) ||
      authority?.sourceType ||
      'International organisation';

    result.push({
      title: item.title,
      organization: item.organization,
      url: cleanCanonicalUrl(item.url),
      jurisdiction,
      sourceType,
    });
  }

  return result;
}
