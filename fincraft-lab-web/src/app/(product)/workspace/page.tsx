import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Layers, Sparkles } from "lucide-react";

import { fetchUserWorkspaceCanvas } from "@/features/workspace/public.server";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { getSessionUser } from "@/lib/auth/session";
import { getInitialPet } from "@/features/pet/api/get-initial-pet";
import { CompanionWidget } from "@/features/pet/components/companion-widget";

export const metadata: Metadata = {
  title: "Workspaces | FinCraft Lab",
  description: "Personal financial learning world archive.",
};

type WorkspacePageProps = {
  searchParams: Promise<{ workspaceId?: string | string[] }>;
};

function WorkspaceErrorAlert({ error }: { error?: string }) {
  return (
    <div data-document-page="workspace" className="mx-auto max-w-4xl space-y-4">
      <div role="alert" className="surface-solid rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h1 className="font-section-title text-destructive">Workspace Unavailable</h1>
        <p className="font-body-small mt-1 text-muted-foreground">
          {error || "Workspace data could not be loaded."}
        </p>
      </div>
    </div>
  );
}

function WorkspacePageHeader({ workspaceId }: { workspaceId: string }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-orange)]">
          <Sparkles size={14} aria-hidden="true" />
          <span>Personal World Archive</span>
        </div>
        <h1 className="font-page-title text-foreground">Saved Financial Worlds</h1>
        <p className="font-body-small text-muted-foreground">
          Every workspace preserves the concepts, positions, and lineage relationships you build in the Craft Lab.
        </p>
      </div>

      <Link
        href={`/lab?workspaceId=${workspaceId}`}
        className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[var(--accent-teal-strong)] transition-colors"
      >
        <span>Open in Lab</span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </header>
  );
}

function ActiveWorkspaceCard({ selectedWorkspace, snapshot, workspaceId }: {
  selectedWorkspace: WorkspaceSummary;
  snapshot: CanvasSnapshot;
  workspaceId: string;
}) {
  const nodeCount = snapshot.nodes.length;
  const edgeCount = snapshot.edges?.length ?? 0;
  const isArchived = selectedWorkspace.status === "ARCHIVED";

  return (
    <section aria-label="Active Workspace Summary" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-[var(--accent-teal)]" aria-hidden="true" />
          <h2 className="font-section-title text-foreground">Current World: {selectedWorkspace.name}</h2>
        </div>
        <span className={`font-caption rounded-full border px-3 py-1 font-bold ${isArchived ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-[var(--border-subtle)] bg-[var(--surface-solid)] text-[var(--accent-orange)]"}`}>
          {isArchived ? "Archived" : "Active"}
        </span>
      </div>

      <p className="font-body text-muted-foreground">
        This {isArchived ? "archived world contains" : "experiment contains"} <strong className="text-foreground">{nodeCount}</strong> concept node{nodeCount === 1 ? "" : "s"} and <strong className="text-foreground">{edgeCount}</strong> lineage connection{edgeCount === 1 ? "" : "s"} saved on your infinite canvas.
      </p>

      <div className="flex items-center justify-between pt-2">
        <span className="font-caption text-muted-foreground">
          Last updated: {new Date(selectedWorkspace.updatedAt).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" })}
        </span>
        <Link
          href={`/lab?workspaceId=${workspaceId}`}
          className="font-caption font-bold text-[var(--brand-primary)] hover:underline inline-flex items-center gap-1"
        >
          <span>Resume Experiment</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default async function WorkspacePage({ searchParams }: WorkspacePageProps) {
  const params = await searchParams;
  const requestedWorkspaceId = Array.isArray(params.workspaceId) ? params.workspaceId[0] : params.workspaceId;
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const [workspaceResult, pet] = await Promise.all([
    fetchUserWorkspaceCanvas(requestedWorkspaceId),
    getInitialPet(),
  ]);

  if (!workspaceResult || !workspaceResult.success) {
    if (workspaceResult && "redirectLogin" in workspaceResult && workspaceResult.redirectLogin) {
      redirect("/login");
    }
    const err = workspaceResult && "errorMessage" in workspaceResult ? workspaceResult.errorMessage : undefined;
    return <WorkspaceErrorAlert error={err} />;
  }

  const { workspaceId, workspaces, selectedWorkspace, snapshot } = workspaceResult;

  return (
    <div data-document-page="workspace" className="mx-auto max-w-5xl space-y-6">
      <WorkspacePageHeader workspaceId={workspaceId} />
      <CompanionWidget pet={pet} />
      <ActiveWorkspaceCard selectedWorkspace={selectedWorkspace} snapshot={snapshot} workspaceId={workspaceId} />
      <section aria-label="Workspace Manager" className="surface-solid space-y-4 rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-6">
        <div className="space-y-1">
          <h2 className="font-section-title text-foreground">Workspace records</h2>
          <p className="font-body-small text-muted-foreground">Create, rename, open, and archive saved financial worlds. Archived records keep their canvas until you restore them.</p>
        </div>
        <WorkspaceManager workspaces={workspaces} selectedWorkspace={selectedWorkspace} selectedMetrics={{ nodeCount: snapshot.nodes.length, edgeCount: snapshot.edges?.length ?? 0 }} />
      </section>
    </div>
  );
}
