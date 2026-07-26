import type { ReactNode } from "react";

export type SpecimenElementTileProps = {
  name: string;
  category: string;
  visual: ReactNode;
  supportingLabel?: string;
  state?: "resting" | "selected";
};

export function SpecimenElementTile({
  name,
  category,
  visual,
  supportingLabel,
  state = "resting",
}: SpecimenElementTileProps) {
  const isSelected = state === "selected";

  return (
    <article
      className={isSelected ? "surface-raised border p-4" : "surface-resting border p-4"}
      aria-label={`${name} element specimen${isSelected ? ", selected" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-teal-700)]">
            {category}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-foreground">{name}</h3>
        </div>
        <div className="surface-inset flex size-12 shrink-0 items-center justify-center border text-sm font-semibold text-foreground">
          {visual}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className={isSelected ? "size-2 shrink-0 bg-[var(--color-orange-600)]" : "size-2 shrink-0 border border-[var(--border-subtle)]"}
        />
        <span>{isSelected ? "Selected specimen" : "Resting specimen"}</span>
      </div>
      {supportingLabel ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{supportingLabel}</p> : null}
    </article>
  );
}
