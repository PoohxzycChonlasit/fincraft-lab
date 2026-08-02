import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchAdminElements } from "@/features/admin-elements/api/fetch-admin-elements";
import { AdminElementManager } from "@/features/admin-elements/components/admin-element-manager";

export const metadata: Metadata = {
  title: "Admin Element Management | FinCraft Lab",
  description: "Teacher Admin Element Master Data Management.",
};

function LoadErrorBanner({ message }: { message: string }) {
  return (
    <div className="surface-inset rounded-2xl p-6 border border-destructive/30 bg-destructive/5 space-y-2">
      <h2 className="text-base font-semibold text-destructive">Unable to Load Admin Elements</h2>
      <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
    </div>
  );
}

export default async function AdminElementsPage() {
  const result = await fetchAdminElements();

  if (!result.success && "redirectLogin" in result && result.redirectLogin) {
    redirect("/login");
  }

  const elements = result.success ? result.elements : [];
  const errorMessage = !result.success && "errorMessage" in result ? result.errorMessage : undefined;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="space-y-1.5 border-b border-(--border-subtle) pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-craft-accent)">
          Teacher Administration
        </p>
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
  );
}
