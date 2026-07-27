"use client";

import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";
import type { AvailableElement } from "../types/craft-element.type";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  onPlaceElement: (element: AvailableElement) => void;
};

function LibraryTile({ element, onPlaceElement }: { element: AvailableElement; onPlaceElement: () => void }) {
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

  return (
    <div draggable onDragStart={handleDragStart} className="touch-manipulation cursor-grab active:cursor-grabbing">
      <SpecimenElementTile
        name={element.name}
        category={element.category?.name || element.elementType}
        visual={<span aria-hidden="true">{element.emoji || "📄"}</span>}
        supportingLabel="Drag to Canvas or tap"
        onClick={onPlaceElement}
      />
    </div>
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
    <section aria-label="Element Library" className="flex flex-col h-full space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Elements</h2>
          <span className="rounded-full bg-[var(--surface-inset)] px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-[var(--border-subtle)]">
            {elements.length}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground hidden sm:inline">Drag to canvas</span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[400px] sm:max-h-[600px] pr-1 space-y-2">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-1">
          {elements.map((element) => (
            <LibraryTile key={element.id} element={element} onPlaceElement={() => onPlaceElement(element)} />
          ))}
        </div>
      </div>
    </section>
  );
}
