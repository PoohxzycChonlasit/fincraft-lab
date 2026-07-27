export type SuggestedPartnerSummary = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: string;
  categoryName: string;
};

export type ElementGuidanceResponse = {
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
  suggestedPartners: SuggestedPartnerSummary[];
};
