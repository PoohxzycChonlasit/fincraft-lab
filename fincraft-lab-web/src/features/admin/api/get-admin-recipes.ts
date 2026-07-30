import { backendFetch } from "@/lib/api/backend-fetch.server";
import type { AdminRecipe } from "../types/recipe.types";

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === "object" && val !== null && !Array.isArray(val);
}

export async function getAdminRecipes(): Promise<AdminRecipe[]> {
  const res = await backendFetch("/admin/recipes", {
    method: "GET",
    requireAuth: true,
  });

  if (!res.ok) {
    return [];
  }

  if (isRecord(res.data) && Array.isArray(res.data.data)) {
    return res.data.data as AdminRecipe[];
  }

  return [];
}
