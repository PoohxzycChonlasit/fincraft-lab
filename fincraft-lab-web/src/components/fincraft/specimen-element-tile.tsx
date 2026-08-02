import type { ReactNode } from "react";

export type SpecimenElementTileProps = {
  name: string;
  category: string;
  visual: ReactNode;
  supportingLabel?: string;
  state?: "resting" | "selected";
  onClick?: () => void;
};

export function SpecimenElementTile({
  name,
  category,
  visual,
  supportingLabel,
  state = "resting",
  onClick,
}: SpecimenElementTileProps) {
  const isSelected = state === "selected";

  const containerClasses = isSelected
    ? "surface-raised rounded-xl p-4 transition-all duration-150 motion-reduce:transition-none text-left w-full ring-2 ring-(--color-craft-accent)"
    : "surface-resting rounded-xl p-4 transition-all duration-150 motion-reduce:transition-none hover:-translate-y-0.5 text-left w-full cursor-pointer hover:border-(--color-craft-accent)/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-craft-accent)";

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-craft-accent)">
            {category}
          </p>
          <h3 className="mt-1.5 text-base sm:text-lg font-semibold text-foreground truncate">{name}</h3>
        </div>
        <div className="surface-inset flex size-11 shrink-0 items-center justify-center rounded-lg border border-(--border-subtle) text-xl sm:text-2xl leading-none font-semibold text-foreground">
          {visual}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span
          aria-hidden="true"
          className={
            isSelected
              ? "size-2 shrink-0 rounded-full bg-(--color-craft-accent)"
              : "size-2 shrink-0 rounded-full border border-(--border-subtle)"
          }
        />
        <span className="font-medium text-foreground">{isSelected ? "Selected specimen" : "Resting specimen"}</span>
      </div>
      {supportingLabel ? (
        <p className="mt-2 text-xs leading-5 text-muted-foreground">{supportingLabel}</p>
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={containerClasses}
        aria-label={`${name} element specimen${isSelected ? ", selected" : ""}`}
      >
        {content}
      </button>
    );
  }

  return (
    <article className={containerClasses} aria-label={`${name} element specimen${isSelected ? ", selected" : ""}`}>
      {content}
    </article>
  );
}
