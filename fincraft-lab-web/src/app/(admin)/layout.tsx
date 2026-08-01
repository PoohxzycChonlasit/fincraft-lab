import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { AdminRouteNav } from "@/features/admin/components/admin-route-nav";
import { getSessionUser } from "@/lib/auth/session";

function ForbiddenBanner() {
  return (
    <div className="surface-inset rounded-2xl p-8 border border-destructive/30 bg-destructive/5 space-y-3 text-center">
      <h2 className="text-lg font-bold text-destructive">Access Restricted</h2>
      <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
        Your account role does not have permission to view or manage master elements. Admin or Super Admin role is required.
      </p>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const isAuthorized = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  if (!isAuthorized) {
    return (
      <ProductShell activeTab="home" user={user}>
        <div className="max-w-4xl mx-auto py-8">
          <ForbiddenBanner />
        </div>
      </ProductShell>
    );
  }

  return (
    <ProductShell activeTab="admin" user={user}>
      <div className="space-y-6">
        <AdminRouteNav />
        {children}
      </div>
    </ProductShell>
  );
}
