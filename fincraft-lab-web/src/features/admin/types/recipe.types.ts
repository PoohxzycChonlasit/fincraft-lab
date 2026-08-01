export type AdminElementRef = {
  id: string;
  slug: string;
  name: string;
  categoryId: string | null;
  status: string;
  emoji?: string;
};

export type AdminRecipeInput = {
  id: string;
  recipeId: string;
  elementId: string;
  inputOrder: number;
  createdAt: string;
  element: AdminElementRef;
};

export type AdminRecipe = {
  id: string;
  outputElementId: string;
  ruleType: "COMMUTATIVE" | "ORDERED" | "SELF_COMBINE" | "BLOCKED";
  status: "ACTIVE" | "INACTIVE" | "PENDING" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  outputElement: AdminElementRef;
  inputs: AdminRecipeInput[];
};

export type AdminRecipeListEnvelope = {
  data: AdminRecipe[];
};

export type AdminRecipeDetailEnvelope = {
  data: AdminRecipe;
};
