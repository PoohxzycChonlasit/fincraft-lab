"use client";

import Link from "next/link";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { FinCraftCanvas, useCanvasNodes, type SaveStatus } from "@/features/canvas/public";
import { CraftResultPanel, ElementLibrary, type AvailableElement } from "@/features/craft/public";
import type { useLabCraftCombine } from "../hooks/use-lab-craft-combine";

type InitialWorkspace = {
  workspaceId: string;
  workspaces: WorkspaceSummary[];
  selectedWorkspace: WorkspaceSummary;
  snapshot: CanvasSnapshot;
};

type CanvasController = ReturnType<typeof useCanvasNodes>;
type CombineController = ReturnType<typeof useLabCraftCombine>;
type SaveController = { saveStatus: SaveStatus; saveError: string | null; handleSave: () => Promise<void> };

export type LabWorkspaceContentProps = {
  isAuthenticated: boolean;
  initialWorkspace?: InitialWorkspace;
  canvas: CanvasController;
  save: SaveController;
  combine: CombineController;
  localElements: AvailableElement[];
  handlePlaceElement: (element: AvailableElement) => void;
};

function LabToolbar({ isAuthenticated, initialWorkspace }: { isAuthenticated: boolean; initialWorkspace?: InitialWorkspace }) {
  if (isAuthenticated && initialWorkspace) {
    return <WorkspaceManager workspaces={initialWorkspace.workspaces} selectedWorkspace={initialWorkspace.selectedWorkspace} />;
  }
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 py-2.5">
      <p role="note" className="text-xs text-muted-foreground">
        Guest mode — <Link href="/login" className="font-semibold text-[var(--color-action-primary)] underline hover:no-underline">Sign in to save your workspace.</Link>
      </p>
      <span className="text-[10px] uppercase font-semibold text-[var(--color-craft-accent)]">Guest Session</span>
    </div>
  );
}

function InlineCraftError({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="space-y-2 rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 p-3">
      <p className="text-xs font-semibold text-[var(--color-text-danger)]">{message}</p>
      <button type="button" onClick={onDismiss} className="text-xs text-[var(--color-text-danger)] underline hover:no-underline">Dismiss</button>
    </div>
  );
}

function DiscoverySidePanel({ combine }: { combine: CombineController }) {
  if (combine.craftError) return <InlineCraftError message={combine.craftError} onDismiss={combine.dismissError} />;
  if (combine.craftResult?.outcome === "NO_RECIPE") {
    return (
      <div role="status" className="surface-inset rounded-2xl border border-[var(--border-subtle)] p-4 space-y-2">
        <p className="text-xs font-bold text-foreground">No Discovery Yet</p>
        <p className="text-xs text-muted-foreground leading-relaxed">These elements don&apos;t produce a known concept. Try another pair.</p>
        <button type="button" onClick={combine.handleReset} className="text-xs font-semibold text-[var(--color-action-primary)] underline hover:no-underline">Dismiss</button>
      </div>
    );
  }
  if (combine.craftResult?.outcome === "DISCOVERY") {
    return (
      <div className="surface-card rounded-2xl border border-[var(--border-subtle)] p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-craft-accent)]">Discovery Result</h3>
          <button type="button" onClick={combine.handleReset} className="text-xs font-medium text-muted-foreground hover:text-foreground">Close</button>
        </div>
        <CraftResultPanel result={combine.craftResult} leftElement={null} rightElement={null} onReset={combine.handleReset} />
      </div>
    );
  }
  return null;
}

export function LabWorkspaceContent({
  isAuthenticated,
  initialWorkspace,
  canvas,
  save,
  combine,
  localElements,
  handlePlaceElement,
}: LabWorkspaceContentProps) {
  const hasDiscovery = Boolean(combine.craftResult || combine.craftError);

  return (
    <div className="space-y-4">
      <LabToolbar isAuthenticated={isAuthenticated} initialWorkspace={initialWorkspace} />

      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left Rail: Element Library */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0">
          <ElementLibrary elements={localElements} onPlaceElement={handlePlaceElement} />
        </aside>

        {/* Center: Infinite Canvas */}
        <main aria-label="Infinite Craft Canvas" className="w-full flex-1 min-w-0">
          <FinCraftCanvas
            nodes={canvas.nodes}
            onNodesChange={canvas.onNodesChange}
            onDropLibraryElement={combine.handleDropOnCanvas}
            onTargetHighlight={combine.handleTargetHighlight}
            onCombineNodes={combine.handleCombineNodes}
            onNodeTap={combine.handleNodeTap}
            onClearTapSelection={combine.handleClearTapSelection}
            workspaceId={isAuthenticated ? initialWorkspace?.workspaceId : undefined}
            isDirty={canvas.isDirty}
            saveStatus={isAuthenticated ? save.saveStatus : undefined}
            saveError={isAuthenticated ? save.saveError : undefined}
            onSave={isAuthenticated ? save.handleSave : undefined}
          />
        </main>

        {/* Right Rail: Discovery Details (if active) */}
        {hasDiscovery ? (
          <aside className="w-full lg:w-80 xl:w-96 shrink-0 max-h-[70vh] overflow-y-auto">
            <DiscoverySidePanel combine={combine} />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
