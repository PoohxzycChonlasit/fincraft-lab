"use client";

import type { AvailableElement } from "../types/craft-element.type";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  onPlaceElement: (element: AvailableElement) => void;
};

function CompactElementTile({ element, onPlaceElement }: { element: AvailableElement; onPlaceElement: () => void }) {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData(
      "application/fincraft-element",
      JSON.stringify({
        id: element.id,
        name: element.name,
        emoji: element.emoji,
        categoryName: element.elementType,
      }),
    );
    event.dataTransfer.effectAllowed = "copy";
  };

  const categoryName = element.category?.name || element.elementType;

  return (
    <button
      type="button"
      draggable
      onDragStart={handleDragStart}
      onClick={onPlaceElement}
      className="group w-full min-h-[64px] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-resting)] p-2.5 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-[var(--color-craft-accent)]/60 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-craft-accent)] active:cursor-grabbing cursor-grab"
      aria-label={`Place ${element.name} on canvas`}
    >
      <div className="flex items-center gap-2.5">
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
    </button>
  );
}

export function ElementLibrary({ elements, onPlaceElement }: ElementLibraryProps) {
  if (elements.length === 0) {
    return (
      <div className="surface-inset rounded-xl border border-[var(--border-subtle)] p-4 text-center">
        <p className="text-xs font-semibold text-foreground">No Elements</p>
        <p className="mt-1 text-[11px] text-muted-foreground">No starter elements found.</p>
      </div>
    );
  }

  return (
    <section aria-label="Element Library" className="flex flex-col h-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elements</h2>
          <span className="rounded-full bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-[var(--border-subtle)]">
            {elements.length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">Drag or tap to place</span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[460px] sm:max-h-[66vh] pr-1 space-y-2">
        <div className="grid grid-cols-1 gap-2">
          {elements.map((element) => (
            <CompactElementTile key={element.id} element={element} onPlaceElement={() => onPlaceElement(element)} />
          ))}
        </div>
      </div>
    </section>
  );
}
