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
      className={
        isSelected
          ? "surface-raised rounded-xl p-4 transition-all duration-150 motion-reduce:transition-none"
          : "surface-resting rounded-xl p-4 transition-all duration-150 motion-reduce:transition-none hover:-translate-y-0.5"
      }
      aria-label={`${name} element specimen${isSelected ? ", selected" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
            {category}
          </p>
          <h3 className="mt-1.5 text-base sm:text-lg font-semibold text-foreground truncate">{name}</h3>
        </div>
        <div className="surface-inset flex size-11 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-xl sm:text-2xl leading-none font-semibold text-foreground">
          {visual}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className={
            isSelected
              ? "size-2 shrink-0 rounded-full bg-[var(--color-craft-accent)]"
              : "size-2 shrink-0 rounded-full border border-[var(--border-subtle)]"
          }
        />
        <span className="font-medium text-foreground">{isSelected ? "Selected specimen" : "Resting specimen"}</span>
      </div>
      {supportingLabel ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{supportingLabel}</p>
      ) : null}
    </article>
  );
}
