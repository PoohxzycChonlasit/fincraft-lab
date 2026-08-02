import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminRecipes } from "@/features/admin/api/get-admin-recipes";
import { RecipeManagementClient } from "@/features/admin/components/recipe-management-client";

export const metadata: Metadata = {
  title: "Admin Craft Recipe Management | FinCraft Lab",
  description: "Administrative management of craft recipes and element combination rules.",
};

export default async function AdminRecipesPage() {
  const result = await getAdminRecipes();

  if (!result.success && "redirectLogin" in result && result.redirectLogin) {
    redirect("/login");
  }

  const recipes = result.success ? result.recipes : [];
  const loadError = !result.success && "errorMessage" in result ? result.errorMessage : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <RecipeManagementClient initialRecipes={recipes} initialLoadError={loadError} />
    </div>
  );
}
