import type {
  ElementType,
  RealityLevel,
  SafetyLabel,
} from '../../database/generated/prisma/client';

export interface CraftSourceResponse {
  title: string;
  organization: string;
  url: string;
}

export interface CraftElementResponse {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  emoji: string;
  elementType: ElementType;
  isStarter: boolean;
}

export interface CraftDiscoveryDetailResponse {
  shortDescription: string;
  realLesson: string;
  example: string | null;
  possibleBenefit: string | null;
  possibleTradeoff: string | null;
  hiddenRisk: string | null;
  worksWhen: string | null;
  becomesDifficultWhen: string | null;
  whatChangesOutcome: string | null;
  realityLevel: RealityLevel;
  safetyLabel: SafetyLabel;
  sources: CraftSourceResponse[];
}

export interface CraftDiscoveryResult {
  outcome: 'DISCOVERY';
  isNewDiscovery: boolean;
  element: CraftElementResponse;
  detail: CraftDiscoveryDetailResponse;
}

export interface CraftNoRecipeResult {
  outcome: 'NO_RECIPE';
}

export type CraftResult = CraftDiscoveryResult | CraftNoRecipeResult;
