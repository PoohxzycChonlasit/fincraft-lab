"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceManager } from "../hooks/use-workspace-manager";
import type { WorkspaceSummary } from "../types/workspace.type";

type WorkspaceManagerModel = ReturnType<typeof useWorkspaceManager>;

type WorkspaceManagerProps = {
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
};

function WorkspaceHeader({ manager }: { manager: WorkspaceManagerModel }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">Workspace desk</p>
        <h2 id="workspace-manager-title" className="text-lg font-semibold text-foreground">{manager.selectedWorkspace?.name ?? "Workspace"}</h2>
        <p className="text-xs text-muted-foreground">Keep each Canvas focused on a different learning experiment.</p>
      </div>
      <span className="text-xs text-muted-foreground">{manager.workspaces.length} available</span>
    </header>
  );
}

function WorkspaceSelection({ manager }: { manager: WorkspaceManagerModel }) {
  return (
    <div className="space-y-2">
      <label htmlFor="workspace-select" className="text-xs font-semibold text-foreground">Active Workspace</label>
      <select
        id="workspace-select"
        value={manager.selectedId ?? ""}
        onChange={(event) => manager.handleSwitch(event.target.value)}
        disabled={manager.isBusy || manager.workspaces.length === 0}
        className="min-h-[44px] w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3 text-sm text-foreground outline-none transition-colors focus-visible:border-[var(--color-action-primary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {manager.workspaces.length === 0 ? <option value="">Preparing a default workspace...</option> : null}
        {manager.workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
      </select>
      <p className="text-[0.7rem] text-muted-foreground">Switching updates the URL and loads that Workspace&apos;s Canvas.</p>
    </div>
  );
}

function WorkspaceCreateForm({ manager }: { manager: WorkspaceManagerModel }) {
  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        void manager.handleCreate();
      }}
    >
      <label htmlFor="workspace-create-name" className="text-xs font-semibold text-foreground">Create Workspace</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="workspace-create-name"
          value={manager.createName}
          onChange={(event) => manager.setCreateName(event.target.value)}
          placeholder="e.g. Emergency Fund"
          required
          minLength={1}
          maxLength={100}
          disabled={manager.isBusy}
          className="min-h-[44px]"
        />
        <Button type="submit" disabled={manager.isBusy} className="min-h-[44px]">{manager.pendingAction === "create" ? "Creating..." : "Create"}</Button>
      </div>
    </form>
  );
}

function SelectedWorkspaceActions({ manager }: { manager: WorkspaceManagerModel }) {
  if (!manager.selectedWorkspace) return null;
  return (
    <div className="grid gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <label htmlFor="workspace-rename-name" className="space-y-2">
        <span className="block text-xs font-semibold text-foreground">Rename selected Workspace</span>
        <Input
          id="workspace-rename-name"
          value={manager.renameName}
          onChange={(event) => manager.setRenameName(event.target.value)}
          required
          minLength={1}
          maxLength={100}
          disabled={manager.isBusy}
          className="min-h-[44px]"
        />
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="outline" onClick={() => void manager.handleRename()} disabled={manager.isBusy} className="min-h-[44px]">{manager.pendingAction === "rename" ? "Renaming..." : "Rename"}</Button>
        <Button type="button" variant="destructive" onClick={() => void manager.handleDelete()} disabled={manager.isBusy} className="min-h-[44px]">{manager.pendingAction === "delete" ? "Deleting..." : "Delete"}</Button>
      </div>
    </div>
  );
}

function WorkspaceFeedback({ feedback }: { feedback: WorkspaceManagerModel["feedback"] }) {
  if (!feedback) return null;
  const className = feedback.kind === "error"
    ? "rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3 text-xs font-semibold text-[var(--color-text-danger)]"
    : "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300";
  return <p role={feedback.kind === "error" ? "alert" : "status"} className={className}>{feedback.message}</p>;
}

export function WorkspaceManager({ workspaces, selectedWorkspace }: WorkspaceManagerProps) {
  const manager = useWorkspaceManager(workspaces, selectedWorkspace);
  return (
    <section aria-labelledby="workspace-manager-title" className="surface-card rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-5 space-y-5">
      <WorkspaceHeader manager={manager} />
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)]">
        <WorkspaceSelection manager={manager} />
        <WorkspaceCreateForm manager={manager} />
      </div>
      <SelectedWorkspaceActions manager={manager} />
      <WorkspaceFeedback feedback={manager.feedback} />
    </section>
  );
}
