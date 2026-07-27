import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { fetchUserWorkspaceCanvas } from "@/features/workspace/public.server";
import { WorkspaceManager } from "@/features/workspace/public.client";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Workspaces | FinCraft Lab",
  description: "Manage your financial learning workspaces.",
};

type WorkspacePageProps = {
  searchParams: Promise<{ workspaceId?: string | string[] }>;
};

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const params = await searchParams;
  const requestedWorkspaceId = Array.isArray(params.workspaceId)
    ? params.workspaceId[0]
    : params.workspaceId;
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const workspaceResult = await fetchUserWorkspaceCanvas(requestedWorkspaceId);

  if (!workspaceResult || !workspaceResult.success) {
    if (workspaceResult && "redirectLogin" in workspaceResult && workspaceResult.redirectLogin) {
      redirect("/login");
    }
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <div className="surface-inset rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
          <h1 className="text-base font-semibold text-destructive">Workspace Unavailable</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {!workspaceResult ? "Workspace data could not be loaded." : ("errorMessage" in workspaceResult ? workspaceResult.errorMessage : "Error loading workspace.")}
          </p>
        </div>
      </div>
    );
  }

  const { workspaceId, workspaces, selectedWorkspace, snapshot } = workspaceResult;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Workspaces</h1>
          <p className="text-xs text-muted-foreground">
            Manage your saved discovery canvases and financial learning experiments.
          </p>
        </div>
        <Link
          href={`/lab?workspaceId=${workspaceId}`}
          className="min-h-[42px] inline-flex items-center justify-center rounded-xl bg-[var(--color-action-primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors"
        >
          Open in Lab &rarr;
        </Link>
      </div>

      <div className="space-y-6">
        <WorkspaceManager workspaces={workspaces} selectedWorkspace={selectedWorkspace} />

        <section aria-label="Workspace Canvas Preview" className="surface-card rounded-2xl border border-[var(--border-subtle)] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Canvas Summary: {selectedWorkspace.name}
            </h2>
            <span className="text-xs text-muted-foreground">{snapshot.nodes.length} nodes saved</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This workspace currently contains {snapshot.nodes.length} elements placed on the Infinite Canvas. Open in Craft Lab to combine ideas.
          </p>
        </section>
      </div>
    </div>
  );
}
