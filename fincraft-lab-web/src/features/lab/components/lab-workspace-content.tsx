"use client";

import Link from "next/link";
import { Info, PanelLeft, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
import { FinCraftCanvas, useCanvasNodes, type SaveStatus } from "@/features/canvas/public";
import { CraftResultPanel, ElementInspector, ElementLibrary, useElementGuidance, type AvailableElement, type CraftDiscoveryResult, type SuggestedPartner } from "@/features/craft/public";
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
type AdaptivePanel = "elements" | "inspector" | "discovery" | null;

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

function AdaptivePanelControls({ activePanel, hasSelection, hasDiscovery, onOpenPanel }: {
  activePanel: AdaptivePanel;
  hasSelection: boolean;
  hasDiscovery: boolean;
  onOpenPanel: (panel: Exclude<AdaptivePanel, null>) => void;
}) {
  return (
    <div className="lab-adaptive-controls" aria-label="Lab panels">
      <button type="button" aria-pressed={activePanel === "elements"} onClick={() => onOpenPanel("elements")} className="lab-adaptive-control">
        <PanelLeft size={14} aria-hidden="true" /> Elements
      </button>
      {hasSelection ? <button type="button" aria-pressed={activePanel === "inspector"} onClick={() => onOpenPanel("inspector")} className="lab-adaptive-control"><Info size={14} aria-hidden="true" /> Info</button> : null}
      {hasDiscovery ? <button type="button" aria-pressed={activePanel === "discovery"} onClick={() => onOpenPanel("discovery")} className="lab-adaptive-control"><Sparkles size={14} aria-hidden="true" /> Discovery</button> : null}
    </div>
  );
}

function CompactBottomToolbar({ activePanel, hasSelection, hasDiscovery, onOpenPanel }: {
  activePanel: AdaptivePanel;
  hasSelection: boolean;
  hasDiscovery: boolean;
  onOpenPanel: (panel: Exclude<AdaptivePanel, null>) => void;
}) {
  return (
    <div className="lab-compact-bottom-toolbar" aria-label="Compact lab panels">
      <button type="button" aria-pressed={activePanel === "elements"} onClick={() => onOpenPanel("elements")} className="lab-bottom-control"><PanelLeft size={16} aria-hidden="true" /><span>Elements</span></button>
      {hasSelection ? <button type="button" aria-pressed={activePanel === "inspector"} onClick={() => onOpenPanel("inspector")} className="lab-bottom-control"><Info size={16} aria-hidden="true" /><span>Info</span></button> : null}
      {hasDiscovery ? <button type="button" aria-pressed={activePanel === "discovery"} onClick={() => onOpenPanel("discovery")} className="lab-bottom-control"><Sparkles size={16} aria-hidden="true" /><span>Discovery</span></button> : null}
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
          <button key={partner.id} type="button" onClick={() => onPlaceElement({ id: partner.id, name: partner.name, slug: partner.slug, emoji: partner.emoji, iconUrl: partner.iconUrl, elementType: partner.elementType, isStarter: false, category: { id: "", name: partner.categoryName, sortOrder: 0 } })} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-[var(--color-craft-accent)]">
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
  return <div role="alert" className="lab-inline-error flex items-center justify-between gap-3 rounded-xl border border-[var(--color-text-danger)]/30 bg-[var(--color-text-danger)]/10 px-4 py-2 text-xs text-[var(--color-text-danger)]"><span>{message}</span><button type="button" onClick={onDismiss} className="font-semibold underline">Dismiss</button></div>;
}

function DiscoveryPanel({ result, onClose, isOpen }: { result: CraftDiscoveryResult | null; onClose: () => void; isOpen: boolean }) {
  if (!result) return null;

  return (
    <aside className="lab-discovery-rail" data-open={isOpen} aria-label="Discovery result">
      <div className="surface-card flex h-full min-h-0 flex-col gap-3 rounded-2xl border border-[var(--border-subtle)] p-3 shadow-xs">
        <div className="flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-craft-accent)]">Discovery Result</h3>
          <button type="button" onClick={onClose} className="text-xs font-medium text-muted-foreground hover:text-foreground">Close</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto"><CraftResultPanel result={result} leftElement={null} rightElement={null} onReset={onClose} /></div>
      </div>
    </aside>
  );
}

function useAdaptivePanelState({ hasDiscovery, clearTapSelection, resetCraft }: { hasDiscovery: boolean; clearTapSelection: () => void; resetCraft: () => void }) {
  const [activePanel, setActivePanel] = useState<AdaptivePanel>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleOpenPanel = useCallback((panel: Exclude<AdaptivePanel, null>) => {
    if (panel === "inspector" && !selectedElementId) return;
    if (panel === "discovery" && !hasDiscovery) return;
    setActivePanel(panel);
  }, [hasDiscovery, selectedElementId]);

  const handleInspectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    setActivePanel("inspector");
  }, []);

  const handleCloseInspector = useCallback(() => {
    setSelectedElementId(null);
    setActivePanel(null);
    clearTapSelection();
  }, [clearTapSelection]);

  const handleCloseDiscovery = useCallback(() => setActivePanel(null), []);
  const handleDismissNoRecipe = useCallback(() => resetCraft(), [resetCraft]);

  const openDiscoveryPanel = useCallback(() => setActivePanel("discovery"), []);
  const closePanel = useCallback(() => setActivePanel(null), []);

  return {
    activePanel,
    selectedElementId,
    isLibraryOpen: activePanel === "elements",
    isInspectorOpen: activePanel === "inspector",
    isDiscoveryOpen: activePanel === "discovery",
    handleOpenPanel,
    handleInspectElement,
    handleCloseInspector,
    handleCloseDiscovery,
    handleDismissNoRecipe,
    openDiscoveryPanel,
    closePanel,
  };
}

function useWorkspaceDiscoveryPersistence(
  initialDiscovery?: CraftDiscoveryResult | null,
  setLastDiscovery?: (discovery: CraftDiscoveryResult | null) => void,
  craftResultOutcome?: string,
  openDiscoveryPanel?: () => void,
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

  useEffect(() => {
    if (craftResultOutcome === "DISCOVERY") openDiscoveryPanel?.();
  }, [craftResultOutcome, openDiscoveryPanel]);
}

export function LabWorkspaceContent({ isAuthenticated, initialWorkspace, canvas, save, combine, localElements, handlePlaceElement }: LabWorkspaceContentProps) {
  const initialDiscovery = initialWorkspace?.snapshot.lastDiscovery;
  const { lastDiscovery, setLastDiscovery } = combine;
  const hasDiscovery = Boolean(lastDiscovery);

  const panels = useAdaptivePanelState({
    hasDiscovery,
    clearTapSelection: combine.handleClearTapSelection,
    resetCraft: combine.handleReset,
  });

  useWorkspaceDiscoveryPersistence(
    initialDiscovery,
    setLastDiscovery,
    combine.craftResult?.outcome,
    panels.openDiscoveryPanel,
  );

  return (
    <div className="lab-workspace-shell">
      <div className="lab-toolbar-row">
        <LabToolbar isAuthenticated={isAuthenticated} initialWorkspace={initialWorkspace} />
        <AdaptivePanelControls activePanel={panels.activePanel} hasSelection={Boolean(panels.selectedElementId)} hasDiscovery={hasDiscovery} onOpenPanel={panels.handleOpenPanel} />
      </div>

      <div className="lab-workspace-stage" data-discovery-open={panels.isDiscoveryOpen}>
        <main aria-label="Infinite Craft Canvas" className="lab-canvas-slot">
          <FinCraftCanvas
            nodes={canvas.nodes}
            edges={canvas.edges}
            onNodesChange={canvas.onNodesChange}
            onEdgesChange={canvas.onEdgesChange}
            onDragStopDirty={canvas.markDragStopDirty}
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

        <div className="lab-feedback-stack">
          {combine.craftError ? <InlineCraftError message={combine.craftError} onDismiss={combine.dismissError} /> : null}
          {combine.craftResult?.outcome === "NO_RECIPE" ? <CompactNoRecipeNotice failedPair={combine.lastFailedPair} onDismiss={panels.handleDismissNoRecipe} onPlaceElement={handlePlaceElement} /> : null}
        </div>

        <div className="lab-library-rail" data-open={panels.isLibraryOpen}>
          <ElementLibrary elements={localElements} selectedElementId={panels.selectedElementId} onPlaceElement={handlePlaceElement} onInspectElement={panels.handleInspectElement} onClose={panels.closePanel} />
        </div>

        <div className="lab-inspector-slot" data-open={panels.isInspectorOpen}>
          <ElementInspector elements={localElements} selectedElementId={panels.selectedElementId} onClose={panels.handleCloseInspector} onPlaceElement={handlePlaceElement} />
        </div>

        <DiscoveryPanel result={lastDiscovery} onClose={panels.handleCloseDiscovery} isOpen={panels.isDiscoveryOpen} />
      </div>

      <CompactBottomToolbar activePanel={panels.activePanel} hasSelection={Boolean(panels.selectedElementId)} hasDiscovery={hasDiscovery} onOpenPanel={panels.handleOpenPanel} />
    </div>
  );
}
