export type AdminCategory = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE";
  elementCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  sortOrder?: number;
  status?: "ACTIVE" | "INACTIVE";
};

export type UpdateCategoryPayload = {
  name?: string;
  description?: string;
  sortOrder?: number;
  status?: "ACTIVE" | "INACTIVE";
};
