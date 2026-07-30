import type { Metadata } from "next";
import { getAdminCategories } from "@/features/admin/api/get-admin-categories";
import { CategoryManagementClient } from "@/features/admin/components/category-management-client";

export const metadata: Metadata = {
  title: "Admin Category Management | FinCraft Lab",
  description: "Administrative management of element categories and taxonomy.",
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <CategoryManagementClient initialCategories={categories} />
    </div>
  );
}
