"use client";

import { useState } from "react";
import { Archive, Check, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWorkspaceManager } from "../hooks/use-workspace-manager";
import type { WorkspaceSummary } from "../types/workspace.type";

type WorkspaceManagerModel = ReturnType<typeof useWorkspaceManager>;

type WorkspaceManagerProps = {
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  selectedMetrics?: { nodeCount: number; edgeCount: number };
};

type StatusRequest = {
  workspace: WorkspaceSummary;
  nextStatus: "ACTIVE" | "ARCHIVED";
};

function formatWorkspaceDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
}

function WorkspaceSelector({ manager }: { manager: WorkspaceManagerModel }) {
  return (
    <label className="grid gap-1.5 text-xs font-bold text-foreground sm:max-w-sm">
      <span>Quick switch</span>
      <select
        aria-label="Select active workspace"
        value={manager.selectedId ?? ""}
        onChange={(event) => manager.handleSwitch(event.target.value)}
        disabled={manager.isBusy || manager.workspaces.length === 0}
        className="min-h-[44px] w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-3 text-xs font-bold text-foreground outline-none transition-colors focus-visible:border-[var(--border-interactive)] focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      >
        {manager.workspaces.map((workspace) => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
      </select>
    </label>
  );
}

function WorkspaceCreateForm({ manager }: { manager: WorkspaceManagerModel }) {
  return (
    <form className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] p-4" onSubmit={(event) => { event.preventDefault(); void manager.handleCreate(); }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label htmlFor="workspace-create-name" className="grid flex-1 gap-1.5 text-xs font-bold text-foreground">
          <span>Create Workspace</span>
          <Input id="workspace-create-name" value={manager.createName} onChange={(event) => manager.setCreateName(event.target.value)} placeholder="e.g. Debt Payoff Strategy" required minLength={1} maxLength={100} disabled={manager.isBusy} className="min-h-[44px] text-xs font-medium" />
        </label>
        <Button type="submit" disabled={manager.isBusy} className="min-h-[44px] bg-[var(--brand-primary)] text-xs font-bold text-white hover:bg-[var(--accent-teal-strong)]">{manager.pendingAction === "create" ? "Creating..." : "Create Workspace"}</Button>
      </div>
    </form>
  );
}

function RenameWorkspaceForm({ manager }: { manager: WorkspaceManagerModel }) {
  if (!manager.selectedWorkspace) return null;
  return (
    <form className="grid gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end" onSubmit={(event) => { event.preventDefault(); void manager.handleRename(); }}>
      <label htmlFor="workspace-rename-name" className="grid gap-1.5 text-xs font-bold text-foreground">
        <span>Rename Selected Workspace</span>
        <Input id="workspace-rename-name" value={manager.renameName} onChange={(event) => manager.setRenameName(event.target.value)} required minLength={1} maxLength={100} disabled={manager.isBusy} className="min-h-[44px] text-xs font-medium" />
      </label>
      <Button type="submit" variant="outline" disabled={manager.isBusy} className="min-h-[44px] text-xs font-bold">{manager.pendingAction === "rename" ? "Renaming..." : "Rename"}</Button>
    </form>
  );
}

function WorkspaceRecord({ workspace, manager, selectedMetrics, onRequestStatus }: { workspace: WorkspaceSummary; manager: WorkspaceManagerModel; selectedMetrics?: { nodeCount: number; edgeCount: number }; onRequestStatus: (workspace: WorkspaceSummary, nextStatus: "ACTIVE" | "ARCHIVED") => void }) {
  const isSelected = manager.selectedId === workspace.id;
  const isArchived = workspace.status === "ARCHIVED";
  const isStatusPending = manager.pendingAction === (isArchived ? "restore" : "archive");
  return (
    <article aria-label={`Workspace record ${workspace.name}`} className={`rounded-2xl border p-4 transition-colors ${isSelected ? "border-[var(--border-selected)] bg-[var(--surface-inset)] shadow-sm" : "border-[var(--border-subtle)] bg-[var(--surface-paper)]"}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="break-words text-sm font-bold text-foreground">{workspace.name}</h3>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${isArchived ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"}`}>{isArchived ? "Archived" : "Active"}</span>
            {isSelected && <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-solid)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--accent-teal)]"><Check aria-hidden="true" className="h-3 w-3" />Current</span>}
          </div>
          <p className="text-xs text-muted-foreground">Updated {formatWorkspaceDate(workspace.updatedAt)}</p>
          <p className="text-xs text-muted-foreground">{isSelected && selectedMetrics ? <><span className="font-semibold text-foreground">{selectedMetrics.nodeCount}</span> nodes · <span className="font-semibold text-foreground">{selectedMetrics.edgeCount}</span> edges in the loaded canvas</> : "Open in Workspace to inspect this canvas's saved counts."}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <Button type="button" variant={isSelected ? "secondary" : "outline"} onClick={() => manager.handleSwitch(workspace.id)} disabled={manager.isBusy || isSelected} className="min-h-[44px] gap-2 text-xs font-bold">{isSelected ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />}<span>{isSelected ? "Current in Lab" : "Open in Lab"}</span></Button>
          <Button type="button" variant="outline" onClick={() => onRequestStatus(workspace, isArchived ? "ACTIVE" : "ARCHIVED")} disabled={manager.isBusy} className="min-h-[44px] gap-2 text-xs font-bold">{isStatusPending ? (isArchived ? "Restoring..." : "Archiving...") : isArchived ? <><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" /><span>Restore</span></> : <><Archive aria-hidden="true" className="h-3.5 w-3.5" /><span>Archive</span></>}</Button>
        </div>
      </div>
    </article>
  );
}

function WorkspaceFeedback({ feedback }: { feedback: WorkspaceManagerModel["feedback"] }) {
  if (!feedback) return null;
  const className = feedback.kind === "error" ? "rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3 text-xs font-semibold text-[var(--color-text-danger)]" : "rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300";
  return <p role={feedback.kind === "error" ? "alert" : "status"} className={className}>{feedback.message}</p>;
}

function StatusDialog({ request, manager, onClose }: { request: StatusRequest | null; manager: WorkspaceManagerModel; onClose: () => void }) {
  const isArchive = request?.nextStatus === "ARCHIVED";
  const confirm = async () => {
    if (!request) return;
    const succeeded = await manager.handleStatusChange(request.workspace, request.nextStatus);
    if (succeeded) onClose();
  };
  return (
    <Dialog open={Boolean(request)} onOpenChange={(open) => { if (!open && !manager.isBusy) onClose(); }}>
      <DialogContent>
        <DialogHeader><DialogTitle>{isArchive ? "Archive workspace?" : "Restore workspace?"}</DialogTitle><DialogDescription>{isArchive ? `"${request?.workspace.name}" will leave the active set but its canvas remains available for restoration.` : `"${request?.workspace.name}" will return to the active workspace set.`}</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline" disabled={manager.isBusy}>Cancel</Button></DialogClose><Button type="button" onClick={() => void confirm()} disabled={manager.isBusy} className="min-h-[44px] text-xs font-bold">{manager.pendingAction === (isArchive ? "archive" : "restore") ? (isArchive ? "Archiving..." : "Restoring...") : isArchive ? "Archive Workspace" : "Restore Workspace"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WorkspaceManager({ workspaces, selectedWorkspace, selectedMetrics }: WorkspaceManagerProps) {
  const manager = useWorkspaceManager(workspaces, selectedWorkspace);
  const [statusRequest, setStatusRequest] = useState<StatusRequest | null>(null);
  return (
    <div aria-busy={manager.isBusy} className="space-y-4">
      <WorkspaceSelector manager={manager} />
      <WorkspaceCreateForm manager={manager} />
      <RenameWorkspaceForm manager={manager} />
      <WorkspaceFeedback feedback={manager.feedback} />
      {manager.workspaces.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--border-subtle)] p-6 text-center text-xs text-muted-foreground">No workspace records yet. Create your first workspace above.</div> : <div role="list" aria-label="Workspace records" className="space-y-3">{manager.workspaces.map((workspace) => <WorkspaceRecord key={workspace.id} workspace={workspace} manager={manager} selectedMetrics={selectedMetrics} onRequestStatus={(record, nextStatus) => setStatusRequest({ workspace: record, nextStatus })} />)}</div>}
      <StatusDialog request={statusRequest} manager={manager} onClose={() => setStatusRequest(null)} />
    </div>
  );
}
