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
    <div className="lab-page-frame">
      <div className="lab-page-heading flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Craft Lab <span className="text-xs font-semibold text-[var(--color-craft-accent)] font-mono">Discovery Workspace</span>
        </h1>
        <p className="lab-page-description text-xs text-muted-foreground hidden sm:block">
          Drag elements onto the canvas to discover financial concepts.
        </p>
      </div>

      <div className="lab-page-content">
        <FinCraftLabClient
          key={initialWorkspace?.workspaceId ?? "guest-lab"}
          elements={elements}
          errorMessage={errorMessage}
          workspaceErrorMessage={workspaceErrorMessage}
          initialWorkspace={initialWorkspace}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  );
}
