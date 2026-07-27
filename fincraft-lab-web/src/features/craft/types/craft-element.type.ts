export type AvailableElementCategory = {
  id: string;
  name: string;
  sortOrder: number;
};

export type AvailableElement = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  iconUrl: string | null;
  elementType: string;
  isStarter: boolean;
  category: AvailableElementCategory;
};

export type ActiveSlot = "left" | "right";
