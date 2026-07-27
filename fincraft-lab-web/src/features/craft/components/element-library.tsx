"use client";

import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";
import type { AvailableElement } from "../types/craft-element.type";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  onPlaceElement: (element: AvailableElement) => void;
};

function LibraryTile({ element, onPlaceElement }: { element: AvailableElement; onPlaceElement: () => void }) {
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("application/fincraft-element", JSON.stringify({
      id: element.id,
      name: element.name,
      emoji: element.emoji,
      categoryName: element.elementType,
    }));
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div draggable onDragStart={handleDragStart} className="touch-manipulation cursor-grab active:cursor-grabbing">
      <SpecimenElementTile
        name={element.name}
        category={element.category?.name || element.elementType}
        visual={<span aria-hidden="true">{element.emoji || "Element"}</span>}
        supportingLabel="Drag to the Canvas or tap to place"
        onClick={onPlaceElement}
      />
    </div>
  );
}

export function ElementLibrary({ elements, onPlaceElement }: ElementLibraryProps) {
  if (elements.length === 0) {
    return (
      <div className="surface-inset rounded-xl border border-[var(--border-subtle)] p-8 text-center">
        <p className="text-sm font-semibold text-foreground">No Elements Available</p>
        <p className="mt-1 text-xs text-muted-foreground">No public or unlocked elements were found.</p>
      </div>
    );
  }

  return (
    <section aria-label="Element Library Specimen Rack" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Element Specimen ({elements.length})</h2>
        <span className="text-[11px] text-muted-foreground">Drag to Canvas or tap to place</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {elements.map((element) => (
          <LibraryTile key={element.id} element={element} onPlaceElement={() => onPlaceElement(element)} />
        ))}
      </div>
    </section>
  );
}
