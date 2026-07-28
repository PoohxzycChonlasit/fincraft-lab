"use client";

import { ChevronDown, ChevronRight, GripVertical, Info, Plus, Search, X } from "lucide-react";
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

type ElementTileProps = {
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
    categoryName: element.category?.name || element.elementType,
  });
}

function TileActionButtons({ name, onInspect, onPlace }: { name: string; onInspect: (e: MouseEvent<HTMLButtonElement>) => void; onPlace: (e: MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" onClick={onInspect} aria-label={`Inspect ${name}`} className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--surface-inset)] hover:text-foreground">
        <Info size={14} aria-hidden="true" />
      </button>
      <button type="button" onClick={onPlace} aria-label={`Place ${name} on canvas`} className="flex size-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-inset)] text-[var(--color-action-primary)] transition-colors hover:bg-[var(--color-action-primary)] hover:text-white">
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

function ElementTile({ element, isHighlighted, isInspecting, onPlaceElement, onInspectElement, onPrefetch }: ElementTileProps) {
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

  return (
    <div draggable onDragStart={handleDragStart} onMouseEnter={onPrefetch} onFocus={onPrefetch} className={`group flex min-h-[52px] items-center justify-between rounded-xl border bg-[var(--surface-resting)] p-2 text-left transition-all duration-150 active:cursor-grabbing ${highlightClass}`}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span title="Drag to canvas" aria-label="Drag handle" className="flex cursor-grab items-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing">
          <GripVertical size={14} aria-hidden="true" />
        </span>
        <button type="button" onClick={(e) => { e.stopPropagation(); onInspectElement(); }} aria-label={`View ${element.name} details`} className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none">
          <span className="surface-inset flex size-7 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-sm leading-none font-semibold">
            <span aria-hidden="true">{element.emoji || "Element"}</span>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[9px] font-semibold uppercase tracking-wider text-[var(--color-craft-accent)]">{categoryName}</span>
            <span className="block truncate text-xs font-bold leading-snug text-foreground">{element.name}</span>
          </span>
        </button>
      </div>
      <TileActionButtons name={element.name} onInspect={(e) => { e.stopPropagation(); onInspectElement(); }} onPlace={(e) => { e.stopPropagation(); onPlaceElement(); }} />
    </div>
  );
}

function CategoryFolder({ categoryName, elements, selectedElementId, onPlaceElement, onInspectElement, isAutoExpanded }: {
  categoryName: string;
  elements: AvailableElement[];
  selectedElementId: string | null;
  onPlaceElement: (element: AvailableElement) => void;
  onInspectElement: (elementId: string) => void;
  isAutoExpanded: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const open = isAutoExpanded || isExpanded;
  const { data: guidance } = useElementGuidance(selectedElementId);
  const prefetch = usePrefetchElementGuidance();
  const highlightedIds = new Set(guidance?.suggestedPartners?.map((p) => p.id) || []);

  return (
    <div className="space-y-1 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-1.5">
      <button type="button" aria-expanded={open} onClick={() => setIsExpanded((curr) => !curr)} className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--surface-card)]">
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={14} className="text-muted-foreground" /> : <ChevronRight size={14} className="text-muted-foreground" />}
          <span className="text-xs font-bold text-foreground">{categoryName}</span>
        </div>
        <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-resting)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{elements.length}</span>
      </button>

      {open ? (
        <div className="space-y-1 pt-1">
          {elements.map((element) => (
            <ElementTile key={element.id} element={element} isHighlighted={highlightedIds.has(element.id)} isInspecting={selectedElementId === element.id} onPlaceElement={() => onPlaceElement(element)} onInspectElement={() => onInspectElement(element.id)} onPrefetch={() => prefetch(element.id)} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ElementLibrary({ elements, selectedElementId, onPlaceElement, onInspectElement, onClose }: ElementLibraryProps) {
  const [searchText, setSearchText] = useState("");
  const normalizedSearch = searchText.trim().toLowerCase();

  const groupedCategories = useMemo(() => {
    const map = new Map<string, AvailableElement[]>();
    for (const el of elements) {
      const cat = el.category?.name || el.elementType || "Uncategorized";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)?.push(el);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [elements]);

  const filteredGroups = useMemo(() => {
    if (!normalizedSearch) return groupedCategories;
    return groupedCategories
      .map(([cat, list]) => [cat, list.filter((el) => `${el.name} ${cat}`.toLowerCase().includes(normalizedSearch))] as [string, AvailableElement[]])
      .filter(([, list]) => list.length > 0);
  }, [groupedCategories, normalizedSearch]);

  return (
    <section aria-label="Element Library" className="lab-library-panel flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-2 shadow-xs">
      <div className="sticky top-0 z-10 space-y-2 bg-[var(--surface-card)] pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elements</h2>
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{elements.length}</span>
          </div>
          {onClose ? <button type="button" onClick={onClose} aria-label="Close element library" className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground"><X size={15} aria-hidden="true" /></button> : null}
        </div>
        <label className="surface-inset flex h-9 items-center gap-2 rounded-lg border border-[var(--border-subtle)] px-2.5">
          <Search size={14} className="shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search elements</span>
          <input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search name or category" className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground" />
        </label>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5">
        {filteredGroups.map(([catName, items]) => (
          <CategoryFolder key={catName} categoryName={catName} elements={items} selectedElementId={selectedElementId} onPlaceElement={onPlaceElement} onInspectElement={onInspectElement} isAutoExpanded={Boolean(normalizedSearch)} />
        ))}
        {filteredGroups.length === 0 ? <p className="p-4 text-center text-xs text-muted-foreground">No elements match this search.</p> : null}
      </div>
    </section>
  );
}
