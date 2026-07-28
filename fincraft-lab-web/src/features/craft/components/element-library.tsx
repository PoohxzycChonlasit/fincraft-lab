"use client";

import { Info, Search, X } from "lucide-react";
import { useMemo, useState, type DragEvent, type MouseEvent } from "react";
import type { AvailableElement } from "../types/craft-element.type";
import { useElementGuidance, usePrefetchElementGuidance } from "../hooks/use-element-guidance";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  selectedElementId: string | null;
  onPlaceElement: (element: AvailableElement) => void;
  onInspectElement: (elementId: string) => void;
  onClose?: () => void;
};

type CompactTileProps = {
  element: AvailableElement;
  isHighlighted: boolean;
  isInspecting: boolean;
  onPlaceElement: () => void;
  onInspectElement: () => void;
  onPrefetch: () => void;
};

function buildTileDragData(element: AvailableElement): string {
  return JSON.stringify({
    id: element.id,
    name: element.name,
    emoji: element.emoji,
    categoryName: element.elementType,
  });
}

function CompactElementTile({ element, isHighlighted, isInspecting, onPlaceElement, onInspectElement, onPrefetch }: CompactTileProps) {
  const categoryName = element.category?.name || element.elementType;
  const highlightClass = isHighlighted
    ? "ring-2 ring-[var(--color-craft-accent)] border-[var(--color-craft-accent)] bg-[var(--color-craft-accent)]/10"
    : isInspecting
      ? "ring-2 ring-[var(--color-action-primary)] border-[var(--color-action-primary)]"
      : "border-[var(--border-subtle)] hover:border-[var(--color-craft-accent)]/60";

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("application/fincraft-element", buildTileDragData(element));
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleInspect = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onInspectElement();
  };

  return (
    <div draggable onDragStart={handleDragStart} className={`group flex min-h-[56px] items-stretch rounded-xl border bg-[var(--surface-resting)] text-left transition-all duration-150 hover:-translate-y-0.5 active:cursor-grabbing ${highlightClass}`}>
      <button
        type="button"
        onClick={onPlaceElement}
        aria-label={`Place ${element.name} on canvas`}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-l-xl p-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset"
      >
        <span className="surface-inset flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-base leading-none font-semibold">
          <span aria-hidden="true">{element.emoji || "Element"}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[9px] font-semibold uppercase tracking-wider text-[var(--color-craft-accent)]">{categoryName}</span>
          <span className="block truncate text-xs font-bold leading-snug text-foreground">{element.name}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={handleInspect}
        onMouseEnter={onPrefetch}
        onFocus={onPrefetch}
        aria-label={`About ${element.name}`}
        className="flex size-9 shrink-0 items-center justify-center self-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--surface-inset)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        <Info size={15} aria-hidden="true" />
      </button>
    </div>
  );
}

function LibraryHeader({ count, total, searchText, onSearch, onClose }: {
  count: number;
  total: number;
  searchText: string;
  onSearch: (value: string) => void;
  onClose?: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 space-y-2 bg-[var(--surface-card)] pb-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elements</h2>
          <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{count}/{total}</span>
        </div>
        {onClose ? <button type="button" onClick={onClose} aria-label="Close element library" className="lab-panel-close flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"><X size={15} aria-hidden="true" /></button> : null}
      </div>
      <label className="surface-inset flex h-9 items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-2.5">
        <Search size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Search elements</span>
        <input value={searchText} onChange={(event) => onSearch(event.target.value)} placeholder="Search name or category" className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground" />
      </label>
    </div>
  );
}

export function ElementLibrary({ elements, selectedElementId, onPlaceElement, onInspectElement, onClose }: ElementLibraryProps) {
  const [searchText, setSearchText] = useState("");
  const { data: guidance } = useElementGuidance(selectedElementId);
  const prefetch = usePrefetchElementGuidance();
  const normalizedSearch = searchText.trim().toLowerCase();
  const filteredElements = useMemo(() => {
    if (!normalizedSearch) return elements;
    return elements.filter((element) => {
      const categoryName = element.category?.name || element.elementType;
      return `${element.name} ${categoryName}`.toLowerCase().includes(normalizedSearch);
    });
  }, [elements, normalizedSearch]);
  const highlightedIds = new Set(guidance?.suggestedPartners?.map((partner) => partner.id) || []);

  return (
    <section aria-label="Element Library" className="lab-library-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-xs">
      <LibraryHeader count={filteredElements.length} total={elements.length} searchText={searchText} onSearch={setSearchText} onClose={onClose} />
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
        <div className="grid grid-cols-1 gap-1.5 min-[480px]:grid-cols-2 min-[840px]:grid-cols-1">
          {filteredElements.map((element) => (
            <CompactElementTile
              key={element.id}
              element={element}
              isHighlighted={highlightedIds.has(element.id)}
              isInspecting={selectedElementId === element.id}
              onPlaceElement={() => onPlaceElement(element)}
              onInspectElement={() => onInspectElement(element.id)}
              onPrefetch={() => prefetch(element.id)}
            />
          ))}
        </div>
        {filteredElements.length === 0 ? <p className="p-4 text-center text-xs text-muted-foreground">No elements match this search.</p> : null}
      </div>
    </section>
  );
}
