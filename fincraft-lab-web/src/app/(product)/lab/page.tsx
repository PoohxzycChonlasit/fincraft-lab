import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchAvailableElements } from "@/features/craft/api/fetch-elements";
import { CraftLabClient } from "@/features/craft/components/craft-lab-client";
import { fetchUserWorkspaceCanvas } from "@/features/workspace/api/fetch-workspace";

export const metadata: Metadata = {
  title: "Craft Lab | FinCraft Lab",
  description: "Financial Literacy Discovery Craft Lab host page.",
};

export default async function CraftLabPage() {
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="space-y-1.5 border-b border-[var(--border-subtle)] pb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
          Discovery Workspace
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Craft Lab</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Combine financial elements in a controlled simulation lab to discover core financial concepts and explore trade-offs.
        </p>
      </header>

      <main aria-label="Craft Lab Selection Area">
        <CraftLabClient elements={elements} errorMessage={errorMessage} initialWorkspace={initialWorkspace} />
      </main>
    </div>
  );
}
