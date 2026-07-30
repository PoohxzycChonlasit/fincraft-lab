import type { Metadata } from "next";
import { getAdminRecipes } from "@/features/admin/api/get-admin-recipes";
import { RecipeManagementClient } from "@/features/admin/components/recipe-management-client";

export const metadata: Metadata = {
  title: "Admin Craft Recipe Management | FinCraft Lab",
  description: "Administrative management of craft recipes and element combination rules.",
};

export default async function AdminRecipesPage() {
  const recipes = await getAdminRecipes();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <RecipeManagementClient initialRecipes={recipes} />
    </div>
  );
}
