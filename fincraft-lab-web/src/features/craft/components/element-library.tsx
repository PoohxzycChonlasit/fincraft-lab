import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";
import type { AvailableElement } from "../types/craft-element.type";

export type ElementLibraryProps = {
  elements: AvailableElement[];
  selectedLeftId: string | null;
  selectedRightId: string | null;
  onSelectElement: (element: AvailableElement) => void;
};

export function ElementLibrary({
  elements,
  selectedLeftId,
  selectedRightId,
  onSelectElement,
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
          Click an element to place into active slot
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {elements.map((element) => {
          const isLeft = selectedLeftId === element.id;
          const isRight = selectedRightId === element.id;
          const isSelected = isLeft || isRight;

          return (
            <SpecimenElementTile
              key={element.id}
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
              onClick={() => onSelectElement(element)}
            />
          );
        })}
      </div>
    </section>
  );
}
