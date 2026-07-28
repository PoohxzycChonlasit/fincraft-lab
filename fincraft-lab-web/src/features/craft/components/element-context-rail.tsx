"use client";

import { Info, Sparkles, X } from "lucide-react";
import type { AvailableElement } from "../types/craft-element.type";
import type { CraftDiscoveryResult } from "../types/craft-result.type";
import { ElementInspector } from "./element-inspector";
import { CraftResultPanel } from "./craft-result-panel";

export type ContextTab = "element" | "discovery";

export type ElementContextRailProps = {
  activeTab: ContextTab;
  onTabChange: (tab: ContextTab) => void;
  selectedElementId: string | null;
  lastDiscovery: CraftDiscoveryResult | null;
  elements: AvailableElement[];
  onInspectElement: (elementId: string) => void;
  onCloseElementInspector: () => void;
  onCloseDiscovery: () => void;
  onPlaceElement: (element: AvailableElement) => void;
  onCloseRail?: () => void;
};

function ContextRailHeader({
  activeTab,
  hasDiscovery,
  onTabChange,
  onCloseRail,
}: {
  activeTab: ContextTab;
  hasDiscovery: boolean;
  onTabChange: (tab: ContextTab) => void;
  onCloseRail?: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface-card)] pb-2">
      <div role="tablist" aria-label="Context tabs" className="flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-1">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "element"}
          onClick={() => onTabChange("element")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
            activeTab === "element" ? "bg-[var(--surface-resting)] text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Info size={14} aria-hidden="true" />
          <span>Element Info</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "discovery"}
          disabled={!hasDiscovery}
          onClick={() => onTabChange("discovery")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            activeTab === "discovery" ? "bg-[var(--surface-resting)] text-[var(--color-craft-accent)] shadow-xs" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles size={14} aria-hidden="true" />
          <span>Discovery</span>
        </button>
      </div>
      {onCloseRail ? (
        <button type="button" onClick={onCloseRail} aria-label="Close context panel" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground">
          <X size={15} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

function ContextRailBody(props: ElementContextRailProps) {
  const { activeTab, selectedElementId, lastDiscovery, elements, onCloseElementInspector, onCloseDiscovery, onPlaceElement } = props;

  if (activeTab === "element") {
    if (!selectedElementId) {
      return <div className="p-4 text-center text-xs italic text-muted-foreground">Select or click any element in the library or node on the canvas to view details.</div>;
    }
    return <ElementInspector elements={elements} selectedElementId={selectedElementId} onClose={onCloseElementInspector} onPlaceElement={onPlaceElement} />;
  }

  if (activeTab === "discovery" && lastDiscovery) {
    return <CraftResultPanel result={lastDiscovery} leftElement={null} rightElement={null} onReset={onCloseDiscovery} />;
  }

  return <div className="p-4 text-center text-xs italic text-muted-foreground">No discovery yet. Combine starter elements on the workspace canvas to discover new concepts!</div>;
}

export function ElementContextRail(props: ElementContextRailProps) {
  const { activeTab, onTabChange, lastDiscovery, onCloseRail } = props;

  return (
    <aside aria-label="Context Rail" className="lab-context-rail flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-xs">
      <ContextRailHeader activeTab={activeTab} hasDiscovery={Boolean(lastDiscovery)} onTabChange={onTabChange} onCloseRail={onCloseRail} />
      <div className="min-h-0 flex-1 overflow-y-auto pt-2">
        <ContextRailBody {...props} />
      </div>
    </aside>
  );
}
