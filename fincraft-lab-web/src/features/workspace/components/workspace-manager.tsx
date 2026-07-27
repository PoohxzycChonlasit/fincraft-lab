"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceManager } from "../hooks/use-workspace-manager";
import type { WorkspaceSummary } from "../types/workspace.type";

type WorkspaceManagerModel = ReturnType<typeof useWorkspaceManager>;

type WorkspaceManagerProps = {
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
};

function WorkspaceSelectorCompact({ manager, onToggleManage, isManaging }: {
  manager: WorkspaceManagerModel;
  onToggleManage: () => void;
  isManaging: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <select
        id="workspace-select-compact"
        aria-label="Select active workspace"
        value={manager.selectedId ?? ""}
        onChange={(e) => manager.handleSwitch(e.target.value)}
        disabled={manager.isBusy || manager.workspaces.length === 0}
        className="min-h-[38px] max-w-[200px] sm:max-w-[260px] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-3 text-xs font-semibold text-foreground outline-none transition-colors focus-visible:border-[var(--color-action-primary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {manager.workspaces.map((w) => (
          <option key={w.id} value={w.id}>
            Workspace: {w.name}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onToggleManage}
        className="min-h-[38px] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-[var(--surface-inset)] transition-colors"
      >
        {isManaging ? "Close" : "Manage"}
      </button>
    </div>
  );
}

function WorkspaceCreateForm({ manager }: { manager: WorkspaceManagerModel }) {
  return (
    <form
      className="space-y-2"
      onSubmit={(e) => {
        e.preventDefault();
        void manager.handleCreate();
      }}
    >
      <label htmlFor="workspace-create-name" className="text-xs font-semibold text-foreground">Create Workspace</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="workspace-create-name"
          value={manager.createName}
          onChange={(e) => manager.setCreateName(e.target.value)}
          placeholder="e.g. Emergency Fund"
          required minLength={1} maxLength={100} disabled={manager.isBusy} className="min-h-[38px] text-xs"
        />
        <Button type="submit" disabled={manager.isBusy} className="min-h-[38px] text-xs">
          {manager.pendingAction === "create" ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}

function SelectedWorkspaceActions({ manager }: { manager: WorkspaceManagerModel }) {
  if (!manager.selectedWorkspace) return null;
  return (
    <div className="grid gap-3 border-t border-[var(--border-subtle)] pt-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
      <label htmlFor="workspace-rename-name" className="space-y-1">
        <span className="block text-xs font-semibold text-foreground">Rename selected</span>
        <Input
          id="workspace-rename-name"
          value={manager.renameName}
          onChange={(e) => manager.setRenameName(e.target.value)}
          required minLength={1} maxLength={100} disabled={manager.isBusy} className="min-h-[38px] text-xs"
        />
      </label>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => void manager.handleRename()} disabled={manager.isBusy} className="min-h-[38px] text-xs">
          {manager.pendingAction === "rename" ? "Renaming..." : "Rename"}
        </Button>
        <Button type="button" variant="destructive" onClick={() => void manager.handleDelete()} disabled={manager.isBusy} className="min-h-[38px] text-xs">
          {manager.pendingAction === "delete" ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

function WorkspaceFeedback({ feedback }: { feedback: WorkspaceManagerModel["feedback"] }) {
  if (!feedback) return null;
  const className = feedback.kind === "error"
    ? "rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-2 text-xs font-semibold text-[var(--color-text-danger)]"
    : "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300";
  return <p role={feedback.kind === "error" ? "alert" : "status"} className={className}>{feedback.message}</p>;
}

export function WorkspaceManager({ workspaces, selectedWorkspace }: WorkspaceManagerProps) {
  const manager = useWorkspaceManager(workspaces, selectedWorkspace);
  const [isManaging, setIsManaging] = useState(false);

  return (
    <div className="space-y-3">
      <WorkspaceSelectorCompact manager={manager} onToggleManage={() => setIsManaging((prev) => !prev)} isManaging={isManaging} />
      {isManaging ? (
        <div className="surface-card rounded-2xl border border-[var(--border-subtle)] p-4 space-y-4 shadow-sm animate-in fade-in duration-150">
          <WorkspaceCreateForm manager={manager} />
          <SelectedWorkspaceActions manager={manager} />
          <WorkspaceFeedback feedback={manager.feedback} />
        </div>
      ) : (
        <WorkspaceFeedback feedback={manager.feedback} />
      )}
    </div>
  );
}
