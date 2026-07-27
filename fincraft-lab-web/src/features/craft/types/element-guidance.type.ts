export type SuggestedPartner = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: string;
  categoryName: string;
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
  suggestedPartners: SuggestedPartner[];
};
