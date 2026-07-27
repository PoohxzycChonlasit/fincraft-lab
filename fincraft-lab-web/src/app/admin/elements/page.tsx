import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { getSessionUser } from "@/lib/auth/session";
import { fetchAdminElements } from "@/features/admin-elements/api/fetch-admin-elements";
import { AdminElementManager } from "@/features/admin-elements/components/admin-element-manager";

export const metadata: Metadata = {
  title: "Admin Element Management | FinCraft Lab",
  description: "Teacher Admin Element Master Data Management.",
};

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

function LoadErrorBanner({ message }: { message: string }) {
  return (
    <div className="surface-inset rounded-2xl p-6 border border-destructive/30 bg-destructive/5 space-y-2">
      <h2 className="text-base font-semibold text-destructive">Unable to Load Admin Elements</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
    </div>
  );
}

export default async function AdminElementsPage() {
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

  const result = await fetchAdminElements();

  if (!result.success && "redirectLogin" in result && result.redirectLogin) {
    redirect("/login");
  }

  const elements = result.success ? result.elements : [];
  const errorMessage = !result.success && "errorMessage" in result ? result.errorMessage : undefined;

  return (
    <ProductShell activeTab="admin-elements" user={user}>
      <div className="space-y-6 max-w-5xl mx-auto">
        <header className="space-y-1.5 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
              Teacher Administration
            </p>
            <span className="text-xs text-muted-foreground font-medium">
              Role: <strong className="text-foreground">{user.role}</strong> ({user.displayName})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Element Master Data
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Manage financial element specimens, status lifecycle, types, and categories.
          </p>
        </header>

        <main aria-label="Admin Element Management Area">
          {errorMessage ? (
            <LoadErrorBanner message={errorMessage} />
          ) : (
            <AdminElementManager initialElements={elements} />
          )}
        </main>
      </div>
    </ProductShell>
  );
}
