"use client";

import { ExternalLink, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { SaveStatus } from "@/features/canvas/public";
import type { WorkspaceSummary } from "@/features/workspace/public.client";

type LabWorkspaceContextProps = {
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  saveStatus: SaveStatus;
  saveError: string | null;
};

function getSaveLabel(saveStatus: SaveStatus) {
  if (saveStatus === "saving") return "Saving";
  if (saveStatus === "saved") return "Saved";
  if (saveStatus === "error") return "Save needs attention";
  return "Autosave ready";
}

function getSaveTone(saveStatus: SaveStatus) {
  if (saveStatus === "error") return "lab-workspace-context__status lab-workspace-context__status--error";
  if (saveStatus === "saved") return "lab-workspace-context__status lab-workspace-context__status--saved";
  return "lab-workspace-context__status";
}

export function LabWorkspaceContext({ workspaceId, workspaces, selectedWorkspace, saveStatus, saveError }: LabWorkspaceContextProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleWorkspaceChange = (nextWorkspaceId: string) => {
    if (!nextWorkspaceId || nextWorkspaceId === workspaceId) return;
    startTransition(() => {
      router.replace(`/lab?workspaceId=${encodeURIComponent(nextWorkspaceId)}`, { scroll: false });
    });
  };

  return (
    <section className="lab-workspace-context" aria-label="Active workspace context">
      <div className="lab-workspace-context__heading">
        <div className="min-w-0">
          <p className="lab-workspace-context__eyebrow">Workspace context</p>
          <h2 className="truncate text-sm font-bold text-[var(--color-text-primary)]" title={selectedWorkspace.name}>{selectedWorkspace.name}</h2>
        </div>
        <span className={getSaveTone(saveStatus)} aria-live="polite">
          <Save size={13} aria-hidden="true" />
          {getSaveLabel(saveStatus)}
        </span>
      </div>

      <label className="lab-workspace-context__selector">
        <span>Active workspace</span>
        <select aria-label="Switch active workspace from Craft Lab" value={workspaceId} disabled={isPending} onChange={(event) => handleWorkspaceChange(event.target.value)}>
          {workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
        </select>
      </label>

      {saveError ? <p className="lab-workspace-context__error" role="alert">{saveError}</p> : <p className="lab-workspace-context__hint">Canvas changes save automatically while you work.</p>}

      <Link href={`/workspace?workspaceId=${encodeURIComponent(workspaceId)}`} className="lab-workspace-context__manage">
        <span>Manage Workspaces</span>
        <ExternalLink size={14} aria-hidden="true" />
      </Link>
    </section>
  );
}
