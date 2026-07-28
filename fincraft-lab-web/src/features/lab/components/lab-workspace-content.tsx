"use client";

import { PanelLeft, PanelRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FinCraftCanvas, useCanvasNodes, type ElementCanvasNode, type SaveStatus } from "@/features/canvas/public";
import { ElementContextRail, ElementLibrary, useElementGuidance, type AvailableElement, type ContextTab, type CraftDiscoveryResult, type SuggestedPartner } from "@/features/craft/public";
import { mergeAndFilterSuggestions } from "@/features/craft/utils/merge-suggestions";
import { WorkspaceManager, type CanvasSnapshot, type WorkspaceSummary } from "@/features/workspace/public.client";
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
export type LabPanel = "library" | "context" | null;

export type LabWorkspaceContentProps = {
  isAuthenticated: boolean;
  initialWorkspace?: InitialWorkspace;
  canvas: CanvasController;
  save: SaveController;
  combine: CombineController;
  localElements: AvailableElement[];
  unavailableWorkspaceElements: string[];
  activePanel: LabPanel;
  onPanelChange: (panel: LabPanel) => void;
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

function LabPanelControls({ activePanel, compact, onPanelChange }: { activePanel: LabPanel; compact?: boolean; onPanelChange: (panel: LabPanel) => void }) {
  const containerClass = compact ? "lab-compact-bottom-toolbar" : "lab-adaptive-controls";
  const buttonClass = compact ? "lab-bottom-control" : "lab-adaptive-control";
  const toggle = (panel: Exclude<LabPanel, null>) => onPanelChange(activePanel === panel ? null : panel);

  return (
    <div className={containerClass} aria-label={compact ? "Compact Lab panels" : "Lab panels"}>
      <button type="button" aria-pressed={activePanel === "library"} onClick={() => toggle("library")} className={buttonClass}>
        <PanelLeft size={16} aria-hidden="true" /><span>Elements</span>
      </button>
      <button type="button" aria-pressed={activePanel === "context"} onClick={() => toggle("context")} className={buttonClass}>
        <PanelRight size={16} aria-hidden="true" /><span>Context</span>
      </button>
    </div>
  );
}

function WorkspaceEligibilityNotice({ elementNames }: { elementNames: string[] }) {
  if (elementNames.length === 0) return null;
  const names = elementNames.join(", ");
  return (
    <div role="status" className="rounded-xl border border-[var(--color-craft-accent)]/40 bg-[var(--color-craft-accent)]/10 px-3 py-2 text-xs text-foreground">
      <span className="font-semibold">Locked workspace element not loaded:</span> {names}. It remains stored until you explicitly save this workspace.
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
          <button key={partner.id} type="button" onClick={() => onPlaceElement({ id: partner.id, name: partner.name, slug: partner.slug, emoji: partner.emoji, iconUrl: partner.iconUrl, elementType: partner.elementType, isStarter: true, category: { id: "", name: partner.categoryName, sortOrder: 0 } })} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-[var(--color-craft-accent)]">
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
      <span>{message}</span><button type="button" onClick={onDismiss} className="font-semibold underline">Dismiss</button>
    </div>
  );
}

function useWorkspaceDiscoveryPersistence(initialDiscovery?: CraftDiscoveryResult | null, setLastDiscovery?: (discovery: CraftDiscoveryResult | null) => void) {
  useEffect(() => {
    setLastDiscovery?.(initialDiscovery?.outcome === "DISCOVERY" ? initialDiscovery : null);
  }, [initialDiscovery, setLastDiscovery]);

  useEffect(() => {
    try {
      for (let index = localStorage.length - 1; index >= 0; index--) {
        const key = localStorage.key(index);
        if (key?.startsWith("fincraft-last-discovery:")) localStorage.removeItem(key);
      }
    } catch {
      // Browser storage is optional for this cleanup.
    }
  }, []);
}

function LabCanvasSection({ props, handleNodeTap }: { props: LabWorkspaceContentProps; handleNodeTap: (node: ElementCanvasNode) => void }) {
  const { canvas, save, combine, isAuthenticated, initialWorkspace, handlePlaceElement } = props;
  return (
    <main aria-label="Infinite Craft Canvas" className="lab-canvas-slot flex min-h-0 min-w-0 flex-col overflow-hidden">
      <FinCraftCanvas nodes={canvas.nodes} edges={canvas.edges} onNodesChange={canvas.onNodesChange} onEdgesChange={canvas.onEdgesChange} onDragStopDirty={canvas.markDragStopDirty} onDropLibraryElement={combine.handleDropOnCanvas} onTargetHighlight={combine.handleTargetHighlight} onCombineNodes={combine.handleCombineNodes} onNodeTap={handleNodeTap} onClearTapSelection={combine.handleClearTapSelection} workspaceId={isAuthenticated ? initialWorkspace?.workspaceId : undefined} isDirty={canvas.isDirty} saveStatus={isAuthenticated ? save.saveStatus : undefined} saveError={isAuthenticated ? save.saveError : undefined} onSave={isAuthenticated ? save.handleSave : undefined} />
      <div className="lab-feedback-stack">
        {combine.craftError ? <InlineCraftError message={combine.craftError} onDismiss={combine.dismissError} /> : null}
        {combine.craftResult?.outcome === "NO_RECIPE" ? <CompactNoRecipeNotice failedPair={combine.lastFailedPair} onDismiss={combine.handleReset} onPlaceElement={handlePlaceElement} /> : null}
      </div>
    </main>
  );
}

export function LabWorkspaceContent(props: LabWorkspaceContentProps) {
  const { initialWorkspace, combine, localElements, activePanel, onPanelChange, unavailableWorkspaceElements, handlePlaceElement } = props;
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [userTab, setUserTab] = useState<ContextTab | null>(null);
  const { setLastDiscovery } = combine;
  useWorkspaceDiscoveryPersistence(initialWorkspace?.snapshot.lastDiscovery, setLastDiscovery);
  const activeContextTab: ContextTab = userTab ?? (combine.craftResult?.outcome === "DISCOVERY" ? "discovery" : "element");

  const handleInspectElement = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
    setUserTab("element");
    onPanelChange("context");
  }, [onPanelChange]);
  const handleNodeTap = useCallback((node: ElementCanvasNode) => {
    combine.handleNodeTap(node);
    if (node.data.elementId) handleInspectElement(node.data.elementId);
  }, [combine, handleInspectElement]);
  const closeElement = useCallback(() => setSelectedElementId(null), []);
  const closeDiscovery = useCallback(() => setLastDiscovery(null), [setLastDiscovery]);

  const library = useMemo(() => <ElementLibrary elements={localElements} selectedElementId={selectedElementId} onPlaceElement={handlePlaceElement} onInspectElement={handleInspectElement} />, [handleInspectElement, handlePlaceElement, localElements, selectedElementId]);
  const context = useMemo(() => <ElementContextRail activeTab={activeContextTab} onTabChange={setUserTab} selectedElementId={selectedElementId} lastDiscovery={combine.lastDiscovery} elements={localElements} onInspectElement={handleInspectElement} onCloseElementInspector={closeElement} onCloseDiscovery={closeDiscovery} onPlaceElement={handlePlaceElement} />, [activeContextTab, closeDiscovery, closeElement, combine.lastDiscovery, handleInspectElement, handlePlaceElement, localElements, selectedElementId]);

  return (
    <div className="lab-workspace-shell">
      <div className="lab-toolbar-row">
        <LabToolbar isAuthenticated={props.isAuthenticated} initialWorkspace={initialWorkspace} />
        <WorkspaceEligibilityNotice elementNames={unavailableWorkspaceElements} />
        <LabPanelControls activePanel={activePanel} onPanelChange={onPanelChange} />
      </div>
      <div className="lab-workspace-stage">
        <div className="lab-library-slot" data-open={activePanel === "library"}>{library}</div>
        <LabCanvasSection props={props} handleNodeTap={handleNodeTap} />
        <div className="lab-context-slot" data-open={activePanel === "context"}>{context}</div>
      </div>
      <LabPanelControls activePanel={activePanel} compact onPanelChange={onPanelChange} />
    </div>
  );
}
