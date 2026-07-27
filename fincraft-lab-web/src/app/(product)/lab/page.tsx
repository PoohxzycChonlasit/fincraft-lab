import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { fetchAvailableElements } from "@/features/craft/api/fetch-elements";
import { FinCraftLabClient } from "@/features/lab/components/fincraft-lab-client";
import { fetchUserWorkspaceCanvas } from "@/features/workspace/public.server";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Craft Lab | FinCraft Lab",
  description: "Financial Literacy Discovery Craft Lab host page.",
};

type CraftLabPageProps = {
  searchParams: Promise<{ workspaceId?: string | string[] }>;
};

export default async function CraftLabPage({ searchParams }: CraftLabPageProps) {
  const params = await searchParams;
  const requestedWorkspaceId = Array.isArray(params.workspaceId)
    ? params.workspaceId[0]
    : params.workspaceId;
  const user = await getSessionUser();
  const isAuthenticated = Boolean(user);

  const [elementsResult, workspaceResult] = await Promise.all([
    fetchAvailableElements(isAuthenticated),
    user ? fetchUserWorkspaceCanvas(requestedWorkspaceId) : Promise.resolve(undefined),
  ]);

  if (!elementsResult.success && "redirectLogin" in elementsResult && elementsResult.redirectLogin) {
    redirect("/login");
  }

  if (user && workspaceResult && !workspaceResult.success && "redirectLogin" in workspaceResult && workspaceResult.redirectLogin) {
    redirect("/login");
  }

  const elements = elementsResult.success ? elementsResult.elements : [];
  const errorMessage = !elementsResult.success && "errorMessage" in elementsResult ? elementsResult.errorMessage : undefined;
  const workspaceErrorMessage = user && workspaceResult && !workspaceResult.success && "errorMessage" in workspaceResult
    ? workspaceResult.errorMessage
    : undefined;
  const initialWorkspace = user && workspaceResult?.success ? workspaceResult : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Craft Lab</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Combine financial elements on the workspace canvas to discover financial concepts.
          </p>
        </div>
        <span className="text-[11px] font-semibold text-[var(--color-craft-accent)] uppercase tracking-wider">
          Infinite Craft
        </span>
      </div>

      <FinCraftLabClient
        key={initialWorkspace?.workspaceId ?? "guest-lab"}
        elements={elements}
        errorMessage={errorMessage}
        workspaceErrorMessage={workspaceErrorMessage}
        initialWorkspace={initialWorkspace}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
