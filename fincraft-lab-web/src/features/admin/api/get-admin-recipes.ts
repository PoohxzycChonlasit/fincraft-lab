import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AdminRecipe } from "../types/recipe.types";

export type GetAdminRecipesResult =
  | { success: true; recipes: AdminRecipe[] }
  | { success: false; redirectLogin: true }
  | { success: false; errorMessage: string };

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getAdminRecipes(): Promise<GetAdminRecipesResult> {
  const res = await backendFetch("/admin/recipes", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    if (res.status === 401) {
      return { success: false, redirectLogin: true };
    }

    return {
      success: false,
      errorMessage: getRecipeLoadError(res.status),
    };
  }

  if (isRecord(res.data) && Array.isArray(res.data.data)) {
    return { success: true, recipes: res.data.data as AdminRecipe[] };
  }

  return {
    success: false,
    errorMessage: "The Recipe catalogue returned an incomplete response.",
  };
}

function getRecipeLoadError(status: number): string {
  if (status === 403) return "You do not have permission to view Recipes.";
  if (status >= 500) return "The Recipe catalogue is temporarily unavailable. Try again.";
  return "We could not load Recipes. Try again.";
}
