import type { SuggestedPartner } from "../types/element-guidance.type";

export function mergeAndFilterSuggestions(
  sourcePartners: SuggestedPartner[] = [],
  targetPartners: SuggestedPartner[] = [],
  failedPair?: { sourceId: string; targetId: string },
): SuggestedPartner[] {
  const map = new Map<string, SuggestedPartner>();

  const combined = [...sourcePartners, ...targetPartners];
  for (const partner of combined) {
    if (!partner || !partner.id) continue;

    // Exclude the exact failed pair elements
    if (failedPair && (partner.id === failedPair.sourceId || partner.id === failedPair.targetId)) {
      continue;
    }

    if (!map.has(partner.id)) {
      map.set(partner.id, partner);
    }
  }

  const result = Array.from(map.values());
  result.sort((a, b) => a.name.localeCompare(b.name));
  return result.slice(0, 4);
}
