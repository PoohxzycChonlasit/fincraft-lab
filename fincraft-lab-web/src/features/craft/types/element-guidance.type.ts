export type SuggestedPartner = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: string;
  categoryName: string;
};

export type ElementLearningDetail = {
  shortDescription: string;
  realLesson: string;
  example?: string;
  possibleBenefit?: string;
  possibleTradeoff?: string;
  hiddenRisk?: string;
  worksWhen?: string;
  becomesDifficultWhen?: string;
  whatChangesOutcome?: string;
  sources?: Array<Record<string, unknown>>;
};

export type ElementGuidance = {
  element: {
    id: string;
    name: string;
    slug: string;
    emoji: string;
    iconUrl: string | null;
    elementType: string;
    category: {
      id: string;
      name: string;
    };
    description: string;
  };
  learningDetail?: ElementLearningDetail;
  suggestedPartners: SuggestedPartner[];
};
