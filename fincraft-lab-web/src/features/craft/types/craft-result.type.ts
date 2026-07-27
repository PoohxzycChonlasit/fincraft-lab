export type CraftElementResult = {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  emoji: string;
  elementType: string;
  isStarter: boolean;
};

export type CraftDiscoverySource = {
  title: string;
  organization: string;
  url: string;
  jurisdiction?: string;
  sourceType?: string;
};

export type CraftDiscoveryDetail = {
  shortDescription: string;
  realLesson: string;
  example: string | null;
  possibleBenefit: string | null;
  possibleTradeoff: string | null;
  hiddenRisk: string | null;
  worksWhen: string | null;
  becomesDifficultWhen: string | null;
  whatChangesOutcome: string | null;
  realityLevel: string;
  safetyLabel: string;
  sources: CraftDiscoverySource[];
};

export type CraftDiscoveryResult = {
  outcome: "DISCOVERY";
  isNewDiscovery: boolean;
  element: CraftElementResult;
  detail: CraftDiscoveryDetail;
};

export type CraftNoRecipeResult = {
  outcome: "NO_RECIPE";
};

export type CraftResult = CraftDiscoveryResult | CraftNoRecipeResult;
