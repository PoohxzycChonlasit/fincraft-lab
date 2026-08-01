export type ElementTypeEnum = "BASE" | "CONCEPT" | "COMPOSITE";
export type ContentStatusEnum = "PENDING" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
export type RealityLevelEnum = "GROUNDED" | "SIMPLIFIED_MODEL" | "SCENARIO" | "HYPOTHESIS";
export type SafetyLabelEnum = "EDUCATION_ONLY" | "SIMULATION_ONLY" | "NOT_FINANCIAL_ADVICE" | "HIGH_RISK_TOPIC" | "NEEDS_REVIEW";

export type AdminElementSummary = {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  slug: string;
  iconUrl: string | null;
  emoji: string;
  elementType: ElementTypeEnum;
  isStarter: boolean;
  status: ContentStatusEnum;
  hasDiscoveryDetail: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DiscoveryDetailSource = {
  title: string;
  organization: string;
  url: string;
};

export type AdminDiscoveryDetail = {
  id: string;
  elementId: string;
  shortDescription: string;
  realLesson: string;
  example: string | null;
  possibleBenefit: string | null;
  possibleTradeoff: string | null;
  hiddenRisk: string | null;
  worksWhen: string | null;
  becomesDifficultWhen: string | null;
  whatChangesOutcome: string | null;
  realityLevel: RealityLevelEnum;
  safetyLabel: SafetyLabelEnum;
  sources: DiscoveryDetailSource[];
  createdAt: string;
  updatedAt: string;
};

export type AdminElementDetail = AdminElementSummary & {
  discoveryDetail: AdminDiscoveryDetail | null;
};

export type AdminDiscoveryDetailPayload = {
  shortDescription: string;
  realLesson: string;
  example: string | null;
  possibleBenefit: string | null;
  possibleTradeoff: string | null;
  hiddenRisk: string | null;
  worksWhen: string | null;
  becomesDifficultWhen: string | null;
  whatChangesOutcome: string | null;
  realityLevel: RealityLevelEnum;
  safetyLabel: SafetyLabelEnum;
  sources: DiscoveryDetailSource[];
};

export type CategoryOption = {
  id: string;
  name: string;
};

export type CreateAdminElementPayload = {
  name: string;
  slug: string;
  categoryId: string;
  emoji: string;
  elementType: ElementTypeEnum;
  isStarter?: boolean;
  status?: ContentStatusEnum;
  iconUrl?: string | null;
};

export type UpdateAdminElementPayload = {
  name?: string;
  categoryId?: string;
  emoji?: string;
  status?: ContentStatusEnum;
  iconUrl?: string | null;
};
