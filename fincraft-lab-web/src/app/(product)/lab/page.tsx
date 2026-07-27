import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductShell } from "@/components/brand/product-shell";
import { fetchAvailableElements } from "@/features/craft/api/fetch-elements";
import { CraftLabClient } from "@/features/craft/components/craft-lab-client";
import { getSessionUser } from "@/lib/auth/session";

import { fetchUserWorkspaceCanvas } from "@/features/workspace/api/fetch-workspace";

export const metadata: Metadata = {
  title: "Craft Lab | FinCraft Lab",
  description: "Financial Literacy Discovery Craft Lab host page.",
};

export default async function CraftLabPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const [elementsResult, workspaceResult] = await Promise.all([
    fetchAvailableElements(),
    fetchUserWorkspaceCanvas(),
  ]);

  if (!elementsResult.success && "redirectLogin" in elementsResult && elementsResult.redirectLogin) {
    redirect("/login");
  }

  const elements = elementsResult.success ? elementsResult.elements : [];
  const errorMessage = !elementsResult.success && "errorMessage" in elementsResult ? elementsResult.errorMessage : undefined;
  const initialWorkspace = workspaceResult.success ? workspaceResult : undefined;

  return (
    <ProductShell activeTab="lab" user={user}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <header className="space-y-1.5 border-b border-[var(--border-subtle)] pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
              Discovery Workspace
            </p>
            <span className="text-xs text-muted-foreground font-medium">
              Signed in as <strong className="text-foreground">{user.displayName}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Craft Lab</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Combine financial elements in a controlled simulation lab to discover core financial concepts and explore trade-offs.
          </p>
        </header>

        <main aria-label="Craft Lab Selection Area">
          <CraftLabClient elements={elements} errorMessage={errorMessage} initialWorkspace={initialWorkspace} />
        </main>
      </div>
    </ProductShell>
  );
}
