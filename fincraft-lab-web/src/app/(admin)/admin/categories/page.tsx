import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminCategories } from "@/features/admin/api/get-admin-categories";
import { CategoryManagementClient } from "@/features/admin/components/category-management-client";

export const metadata: Metadata = {
  title: "Admin Category Management | FinCraft Lab",
  description: "Administrative management of element categories and taxonomy.",
};

export default async function AdminCategoriesPage() {
  const result = await getAdminCategories();

  if (!result.success && "redirectLogin" in result && result.redirectLogin) {
    redirect("/login");
  }

  const categories = result.success ? result.categories : [];
  const loadError = !result.success && "errorMessage" in result ? result.errorMessage : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <CategoryManagementClient initialCategories={categories} initialLoadError={loadError} />
    </div>
  );
}
