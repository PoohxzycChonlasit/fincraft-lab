export type ElementTypeEnum = "BASE" | "CONCEPT" | "COMPOSITE";
export type ContentStatusEnum = "PENDING" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

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
