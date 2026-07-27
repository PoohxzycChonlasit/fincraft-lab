"use client";

import { useCallback } from "react";
import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";
import type { AvailableElement } from "../types/craft-element.type";
import type { CanvasElementInput } from "@/features/canvas/types/canvas-node.type";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  selectedLeftId: string | null;
  selectedRightId: string | null;
  onSelectElement: (element: AvailableElement) => void;
  onDragStart?: (element: CanvasElementInput) => void;
};

function LibraryTile({
  element,
  isLeft,
  isRight,
  onSelect,
  onDragStart,
}: {
  element: AvailableElement;
  isLeft: boolean;
  isRight: boolean;
  onSelect: () => void;
  onDragStart?: (el: CanvasElementInput) => void;
}) {
  const isSelected = isLeft || isRight;

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      const payload: CanvasElementInput = {
        id: element.id,
        name: element.name,
        emoji: element.emoji,
        categoryName: element.elementType,
      };
      e.dataTransfer.setData("application/fincraft-element", JSON.stringify(payload));
      e.dataTransfer.effectAllowed = "copy";
      onDragStart?.(payload);
    },
    [element, onDragStart],
  );

  return (
    <div draggable onDragStart={handleDragStart} className="cursor-grab active:cursor-grabbing touch-none">
      <SpecimenElementTile
        name={element.name}
        category={element.category?.name || element.elementType}
        visual={<span aria-hidden="true">{element.emoji || "📄"}</span>}
        supportingLabel={
          isSelected
            ? `Placed in ${isLeft ? "Left" : "Right"} Craft Bay slot`
            : element.isStarter
              ? "Starter financial element"
              : "Discovered financial element"
        }
        state={isSelected ? "selected" : "resting"}
        onClick={onSelect}
      />
    </div>
  );
}

export function ElementLibrary({
  elements,
  selectedLeftId,
  selectedRightId,
  onSelectElement,
  onDragStart,
}: ElementLibraryProps) {
  if (elements.length === 0) {
    return (
      <div className="surface-inset rounded-xl p-8 text-center border border-[var(--border-subtle)]">
        <p className="text-sm font-semibold text-foreground">No Elements Available</p>
        <p className="mt-1 text-xs text-muted-foreground">
          No starter or unlocked elements were found for your account.
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Element Library Specimen Rack" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Available Element Specimen ({elements.length})
        </h2>
        <span className="text-[11px] text-muted-foreground">
          Drag to canvas or tap to select
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {elements.map((element) => (
          <LibraryTile
            key={element.id}
            element={element}
            isLeft={selectedLeftId === element.id}
            isRight={selectedRightId === element.id}
            onSelect={() => onSelectElement(element)}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </section>
  );
}
