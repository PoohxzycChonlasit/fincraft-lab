"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { FinCraftCanvas, useCanvasNodes, type ElementCanvasNode, type SaveStatus } from "@/features/canvas/public";
import { ElementContextRail, ElementLibrary, useElementGuidance, type AvailableElement, type ContextTab, type CraftDiscoveryResult, type SuggestedPartner } from "@/features/craft/public";
import { mergeAndFilterSuggestions } from "@/features/craft/utils/merge-suggestions";
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
    return <div className="lab-session-toolbar"><WorkspaceManager workspaces={initialWorkspace.workspaces} selectedWorkspace={initialWorkspace.selectedWorkspace} /></div>;
  }

  return (
    <div className="lab-session-toolbar flex items-center justify-between gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3 py-2">
      <p role="note" className="truncate text-xs text-muted-foreground">
        Guest mode — <Link href="/login" className="font-semibold text-[var(--color-action-primary)] underline hover:no-underline">Sign in to save your workspace.</Link>
      </p>
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-craft-accent)]">Guest Session</span>
    </div>
  );
}

function SuggestionButtonList({ suggestions, onPlaceElement }: { suggestions: SuggestedPartner[]; onPlaceElement: (element: AvailableElement) => void }) {
  if (suggestions.length === 0) return <p className="text-[11px] italic text-muted-foreground">Try combining starter elements from the Library or inspect Info for connection hints.</p>;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-1">
      <span className="text-[11px] font-semibold text-foreground">Try one of these suggested connections:</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {suggestions.map((partner) => (
          <button
            key={partner.id}
            type="button"
            onClick={() => onPlaceElement({ id: partner.id, name: partner.name, slug: partner.slug, emoji: partner.emoji, iconUrl: partner.iconUrl, elementType: partner.elementType, isStarter: false, category: { id: "", name: partner.categoryName, sortOrder: 0 } })}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-[var(--color-craft-accent)]"
          >
            <span>{partner.emoji || "Element"}</span><span>{partner.name}</span><span className="text-[10px] font-bold text-[var(--color-action-primary)]">+ Place</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CompactNoRecipeNotice({ failedPair, onDismiss, onPlaceElement }: { failedPair: { sourceId: string; targetId: string } | null; onDismiss: () => void; onPlaceElement: (element: AvailableElement) => void }) {
  const { data: sourceGuidance } = useElementGuidance(failedPair?.sourceId || null);
  const { data: targetGuidance } = useElementGuidance(failedPair?.targetId || null);
  const suggestions = mergeAndFilterSuggestions(sourceGuidance?.suggestedPartners, targetGuidance?.suggestedPartners, failedPair || undefined);

  return (
    <div role="status" className="lab-no-recipe surface-card flex flex-col gap-2.5 rounded-xl p-3 text-xs text-muted-foreground">
      <div className="flex items-center justify-between gap-3">
        <div><span className="font-bold text-[var(--color-craft-accent)]">No discovery yet: </span><span>These elements do not have an approved discovery recipe in the current lab.</span></div>
        <button type="button" onClick={onDismiss} className="shrink-0 font-semibold text-foreground hover:underline">Dismiss</button>
      </div>
      <SuggestionButtonList suggestions={suggestions} onPlaceElement={onPlaceElement} />
    </div>
  );
}

function InlineCraftError({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div role="alert" className="lab-inline-error flex items-center justify-between gap-3 rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 px-4 py-2 text-xs text-[var(--color-text-danger)]">
      <span>{message}</span>
      <button type="button" onClick={onDismiss} className="font-semibold underline">Dismiss</button>
    </div>
  );
}

function useWorkspaceDiscoveryPersistence(
  initialDiscovery?: CraftDiscoveryResult | null,
  setLastDiscovery?: (discovery: CraftDiscoveryResult | null) => void,
) {
  useEffect(() => {
    if (initialDiscovery && initialDiscovery.outcome === "DISCOVERY") {
      setLastDiscovery?.(initialDiscovery);
    } else {
      setLastDiscovery?.(null);
    }
  }, [initialDiscovery, setLastDiscovery]);

  useEffect(() => {
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith("fincraft-last-discovery:")) {
          localStorage.removeItem(key);
        }
      }
    } catch {
      // Ignore storage error
    }
  }, []);
}

function LabCanvasSection({
  canvas,
  save,
  combine,
  isAuthenticated,
  initialWorkspace,
  handleNodeTap,
  handlePlaceElement,
}: {
  canvas: CanvasController;
  save: SaveController;
  combine: CombineController;
  isAuthenticated: boolean;
  initialWorkspace?: InitialWorkspace;
  handleNodeTap: (node: ElementCanvasNode) => void;
  handlePlaceElement: (element: AvailableElement) => void;
}) {
  return (
    <main aria-label="Infinite Craft Canvas" className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <FinCraftCanvas
        nodes={canvas.nodes}
        edges={canvas.edges}
        onNodesChange={canvas.onNodesChange}
        onEdgesChange={canvas.onEdgesChange}
        onDragStopDirty={canvas.markDragStopDirty}
        onDropLibraryElement={combine.handleDropOnCanvas}
        onTargetHighlight={combine.handleTargetHighlight}
        onCombineNodes={combine.handleCombineNodes}
        onNodeTap={handleNodeTap}
        onClearTapSelection={combine.handleClearTapSelection}
        workspaceId={isAuthenticated ? initialWorkspace?.workspaceId : undefined}
        isDirty={canvas.isDirty}
        saveStatus={isAuthenticated ? save.saveStatus : undefined}
        saveError={isAuthenticated ? save.saveError : undefined}
        onSave={isAuthenticated ? save.handleSave : undefined}
      />
      <div className="lab-feedback-stack absolute inset-x-2 bottom-2 z-20 space-y-2 pointer-events-none *:pointer-events-auto">
        {combine.craftError ? <InlineCraftError message={combine.craftError} onDismiss={combine.dismissError} /> : null}
        {combine.craftResult?.outcome === "NO_RECIPE" ? (
          <CompactNoRecipeNotice failedPair={combine.lastFailedPair} onDismiss={combine.handleReset} onPlaceElement={handlePlaceElement} />
        ) : null}
      </div>
    </main>
  );
}

function LabWorkspaceLayout(props: {
  isAuthenticated: boolean;
  initialWorkspace?: InitialWorkspace;
  canvas: CanvasController;
  save: SaveController;
  combine: CombineController;
  localElements: AvailableElement[];
  handlePlaceElement: (element: AvailableElement) => void;
  selectedElementId: string | null;
  activeContextTab: ContextTab;
  setActiveContextTab: (tab: ContextTab) => void;
  handleInspectElement: (elementId: string) => void;
  handleNodeTap: (node: ElementCanvasNode) => void;
  setSelectedElementId: (id: string | null) => void;
}) {
  const {
    isAuthenticated,
    initialWorkspace,
    canvas,
    save,
    combine,
    localElements,
    handlePlaceElement,
    selectedElementId,
    activeContextTab,
    setActiveContextTab,
    handleInspectElement,
    handleNodeTap,
    setSelectedElementId,
  } = props;

  return (
    <div className="lab-workspace-stage grid min-h-0 flex-1 grid-cols-1 gap-3 min-[1280px]:grid-cols-[272px_minmax(0,1fr)_360px]">
      <div className="hidden min-h-0 min-w-0 min-[1280px]:block">
        <ElementLibrary elements={localElements} selectedElementId={selectedElementId} onPlaceElement={handlePlaceElement} onInspectElement={handleInspectElement} />
      </div>

      <LabCanvasSection
        canvas={canvas}
        save={save}
        combine={combine}
        isAuthenticated={isAuthenticated}
        initialWorkspace={initialWorkspace}
        handleNodeTap={handleNodeTap}
        handlePlaceElement={handlePlaceElement}
      />

      <div className="hidden min-h-0 min-w-0 min-[1280px]:block">
        <ElementContextRail
          activeTab={activeContextTab}
          onTabChange={setActiveContextTab}
          selectedElementId={selectedElementId}
          lastDiscovery={combine.lastDiscovery}
          elements={localElements}
          onInspectElement={handleInspectElement}
          onCloseElementInspector={() => setSelectedElementId(null)}
          onCloseDiscovery={() => combine.setLastDiscovery(null)}
          onPlaceElement={handlePlaceElement}
        />
      </div>
    </div>
  );
}

export function LabWorkspaceContent(props: LabWorkspaceContentProps) {
  const { isAuthenticated, initialWorkspace, combine } = props;
  const initialDiscovery = initialWorkspace?.snapshot.lastDiscovery;
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [userTab, setUserTab] = useState<ContextTab | null>(null);

  useWorkspaceDiscoveryPersistence(initialDiscovery, combine.setLastDiscovery);

  const activeContextTab: ContextTab = userTab ?? (combine.craftResult?.outcome === "DISCOVERY" ? "discovery" : "element");

  const handleInspectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    setUserTab("element");
  }, []);

  const handleNodeTap = useCallback((node: ElementCanvasNode) => {
    combine.handleNodeTap(node);
    if (node.data.elementId) {
      setSelectedElementId(node.data.elementId);
      setUserTab("element");
    }
  }, [combine]);

  return (
    <div className="lab-workspace-shell flex h-full min-h-0 w-full flex-1 flex-col gap-2">
      <div className="lab-toolbar-row">
        <LabToolbar isAuthenticated={isAuthenticated} initialWorkspace={initialWorkspace} />
      </div>
      <LabWorkspaceLayout
        {...props}
        selectedElementId={selectedElementId}
        activeContextTab={activeContextTab}
        setActiveContextTab={setUserTab}
        handleInspectElement={handleInspectElement}
        handleNodeTap={handleNodeTap}
        setSelectedElementId={setSelectedElementId}
      />
    </div>
  );
}
