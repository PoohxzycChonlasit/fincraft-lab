import type {
  CraftDiscoveryDetailResponse,
  CraftDiscoveryResult,
  CraftElementResponse,
  CraftNoRecipeResult,
} from '../types/craft-response.type';
import { parseCraftSources } from '../parsers/craft-sources.parser';

/**
 * Structural input type for DiscoveryDetail before sources parsing.
 * Accepts unknown sources (e.g. raw JSON) while requiring all other public Detail fields.
 */
export type CraftDiscoveryDetailMapperInput = Omit<
  CraftDiscoveryDetailResponse,
  'sources'
> & {
  sources: unknown;
};

/**
 * Structural input type for mapping a DISCOVERY outcome.
 */
export interface CraftDiscoveryMapperInput {
  isNewDiscovery: boolean;
  element: CraftElementResponse;
  detail: CraftDiscoveryDetailMapperInput;
}

/**
 * Maps validated internal Craft data into a safe public CraftDiscoveryResult.
 *
 * Rules:
 * 1. Explicitly selects only declared public fields to prevent internal metadata leakage.
 * 2. Delegates sources parsing to parseCraftSources, propagating parser errors cleanly.
 * 3. Preserves exact nullability for optional/nullable fields.
 * 4. Safe-copies all object and array boundaries (returns new references without mutating inputs).
 */
export function mapCraftDiscoveryResult(
  input: CraftDiscoveryMapperInput,
): CraftDiscoveryResult {
  const sources = parseCraftSources(input.detail.sources);

  return {
    outcome: 'DISCOVERY',
    isNewDiscovery: input.isNewDiscovery,
    element: {
      id: input.element.id,
      name: input.element.name,
      slug: input.element.slug,
      iconUrl: input.element.iconUrl,
      emoji: input.element.emoji,
      elementType: input.element.elementType,
      isStarter: input.element.isStarter,
    },
    detail: {
      shortDescription: input.detail.shortDescription,
      realLesson: input.detail.realLesson,
      example: input.detail.example,
      possibleBenefit: input.detail.possibleBenefit,
      possibleTradeoff: input.detail.possibleTradeoff,
      hiddenRisk: input.detail.hiddenRisk,
      worksWhen: input.detail.worksWhen,
      becomesDifficultWhen: input.detail.becomesDifficultWhen,
      whatChangesOutcome: input.detail.whatChangesOutcome,
      realityLevel: input.detail.realityLevel,
      safetyLabel: input.detail.safetyLabel,
      sources,
    },
  };
}

/**
 * Maps a NO_RECIPE Craft outcome into a safe public CraftNoRecipeResult.
 */
export function mapCraftNoRecipeResult(): CraftNoRecipeResult {
  return {
    outcome: 'NO_RECIPE',
  };
}
