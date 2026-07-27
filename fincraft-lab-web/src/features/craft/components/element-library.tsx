"use client";

import { useState } from "react";
import type { AvailableElement } from "../types/craft-element.type";
import { useElementGuidance } from "../hooks/use-element-guidance";
import { ElementLearningPanel } from "./element-learning-panel";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  onPlaceElement: (element: AvailableElement) => void;
};

type CompactTileProps = {
  element: AvailableElement;
  isHighlighted: boolean;
  isInspecting: boolean;
  onPlaceElement: () => void;
  onToggleInspect: (e: React.MouseEvent) => void;
};

function buildTileDragData(element: AvailableElement): string {
  return JSON.stringify({
    id: element.id,
    name: element.name,
    emoji: element.emoji,
    categoryName: element.elementType,
  });
}

function CompactElementTile({
  element,
  isHighlighted,
  isInspecting,
  onPlaceElement,
  onToggleInspect,
}: CompactTileProps) {
  const categoryName = element.category?.name || element.elementType;
  const highlightClass = isHighlighted
    ? "ring-2 ring-[var(--color-craft-accent)] border-[var(--color-craft-accent)] bg-[var(--color-craft-accent)]/10"
    : isInspecting
      ? "ring-2 ring-[var(--color-action-primary)] border-[var(--color-action-primary)]"
      : "border-[var(--border-subtle)] hover:border-[var(--color-craft-accent)]/60";

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("application/fincraft-element", buildTileDragData(element));
        e.dataTransfer.effectAllowed = "copy";
      }}
      onClick={onPlaceElement}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPlaceElement();
        }
      }}
      className={`group relative w-full min-h-[64px] rounded-xl border bg-[var(--surface-resting)] p-2.5 text-left transition-all duration-150 hover:-translate-y-0.5 cursor-grab active:cursor-grabbing ${highlightClass}`}
      aria-label={`Place ${element.name} on canvas`}
    >
      <div className="flex items-center gap-2.5 pr-6">
        <div className="surface-inset flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-lg leading-none font-semibold text-foreground group-hover:scale-105 transition-transform">
          <span aria-hidden="true">{element.emoji || "📄"}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-craft-accent)]">
            {categoryName}
          </p>
          <h3 className="text-xs font-bold text-foreground leading-snug line-clamp-2">
            {element.name}
          </h3>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleInspect}
        aria-label={`About ${element.name}`}
        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-md text-xs font-bold text-muted-foreground hover:bg-[var(--surface-inset)] hover:text-foreground transition-colors"
      >
        ℹ️
      </button>
    </div>
  );
}

function LibraryHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elements</h2>
        <span className="rounded-full bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-[var(--border-subtle)]">
          {count}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground">Drag, tap or ℹ️ for info</span>
    </div>
  );
}

export function ElementLibrary({ elements, onPlaceElement }: ElementLibraryProps) {
  const [inspectingId, setInspectingId] = useState<string | null>(null);
  const { data: guidance, isLoading } = useElementGuidance(inspectingId);

  const inspectingElement = elements.find((e) => e.id === inspectingId) || null;

  const handleToggleInspect = (elementId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setInspectingId((prev) => (prev === elementId ? null : elementId));
  };

  const highlightedIds = new Set(guidance?.suggestedPartners?.map((p) => p.id) || []);

  return (
    <section aria-label="Element Library" className="relative flex flex-col h-full space-y-2 min-h-0">
      <LibraryHeader count={elements.length} />

      {inspectingElement ? (
        <div className="fixed inset-x-3 bottom-3 z-50 lg:absolute lg:left-[calc(100%+12px)] lg:top-0 lg:inset-auto lg:z-40 lg:w-80 shadow-2xl">
          <ElementLearningPanel
            element={inspectingElement}
            guidance={guidance || null}
            isLoading={isLoading}
            onClose={() => setInspectingId(null)}
            onPlaceElement={onPlaceElement}
          />
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto min-h-0 pr-1 space-y-2">
        <div className="grid grid-cols-1 gap-2">
          {elements.map((element) => (
            <CompactElementTile
              key={element.id}
              element={element}
              isHighlighted={highlightedIds.has(element.id)}
              isInspecting={inspectingId === element.id}
              onPlaceElement={() => onPlaceElement(element)}
              onToggleInspect={(e) => handleToggleInspect(element.id, e)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
