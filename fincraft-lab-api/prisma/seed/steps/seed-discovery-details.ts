import {
  DiscoveryDetail,
  Prisma,
} from '../../../src/database/generated/prisma/client';
import { StarterElementDetailSeedInput } from '../content/starter-element-details';
import { cleanCanonicalUrl, findTrustedAuthority } from '../trusted-source-registry';

export async function seedDiscoveryDetailsStep(
  tx: Prisma.TransactionClient,
  details: StarterElementDetailSeedInput[],
  elementMap: Map<string, string>,
): Promise<DiscoveryDetail[]> {
  const seededDetails: DiscoveryDetail[] = [];

  for (const detail of details) {
    const elementId = elementMap.get(detail.elementSlug);
    if (!elementId) {
      throw new Error(
        `Starter Element not found for Detail: ${detail.elementSlug}`,
      );
    }

    const sourcesPayload = detail.sources.map((s) => {
      let hostname = '';
      try {
        hostname = new URL(s.url).hostname;
      } catch {
        hostname = '';
      }
      const authority = findTrustedAuthority(hostname);
      return {
        title: s.title,
        organization: s.organization,
        url: cleanCanonicalUrl(s.url),
        jurisdiction: s.jurisdiction || authority?.jurisdiction || 'GLOBAL',
        sourceType: s.sourceType || authority?.sourceType || 'International organisation',
      };
    });

    const result = await tx.discoveryDetail.upsert({
      where: { elementId },
      create: {
        elementId,
        shortDescription: detail.shortDescription,
        realLesson: detail.realLesson,
        example: detail.example,
        possibleBenefit: detail.possibleBenefit,
        possibleTradeoff: detail.possibleTradeoff,
        hiddenRisk: detail.hiddenRisk,
        worksWhen: detail.worksWhen,
        becomesDifficultWhen: detail.becomesDifficultWhen,
        whatChangesOutcome: detail.whatChangesOutcome,
        realityLevel: detail.realityLevel,
        safetyLabel: detail.safetyLabel,
        sources: sourcesPayload,
      },
      update: {
        shortDescription: detail.shortDescription,
        realLesson: detail.realLesson,
        example: detail.example,
        possibleBenefit: detail.possibleBenefit,
        possibleTradeoff: detail.possibleTradeoff,
        hiddenRisk: detail.hiddenRisk,
        worksWhen: detail.worksWhen,
        becomesDifficultWhen: detail.becomesDifficultWhen,
        whatChangesOutcome: detail.whatChangesOutcome,
        realityLevel: detail.realityLevel,
        safetyLabel: detail.safetyLabel,
        sources: sourcesPayload,
      },
    });

    seededDetails.push(result);
  }

  return seededDetails;
}
