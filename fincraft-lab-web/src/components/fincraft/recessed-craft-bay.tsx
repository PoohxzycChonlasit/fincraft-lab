import type { ReactNode } from "react";

export type CraftBayItem = {
  name: string;
  visual?: ReactNode;
};

export type RecessedCraftBayProps = {
  left?: CraftBayItem;
  right?: CraftBayItem;
  statusLabel: string;
};

function CraftBaySlot({ item, label }: { item?: CraftBayItem; label: string }) {
  if (!item) {
    return (
      <div className="flex min-h-[56px] w-full flex-1 items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface-flat)]/60 p-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-muted-foreground/70 italic">Empty slot</span>
      </div>
    );
  }

  return (
    <div className="surface-resting flex min-h-[56px] w-full flex-1 items-center justify-between gap-3 rounded-xl p-3.5 shadow-xs">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 min-w-0 truncate text-sm font-semibold text-foreground">{item.name}</p>
      </div>
      {item.visual ? (
        <span className="surface-inset flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] text-lg sm:text-xl leading-none font-semibold text-[var(--color-action-primary)]">
          {item.visual}
        </span>
      ) : null}
    </div>
  );
}

export function RecessedCraftBay({ left, right, statusLabel }: RecessedCraftBayProps) {
  const isFilled = Boolean(left && right);

  return (
    <section className="surface-inset rounded-2xl p-4 sm:p-5" aria-label="Recessed craft bay specimen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
          Craft Bay
        </p>
        <span className="rounded-md bg-[var(--surface-resting)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-[var(--border-subtle)]">
          {statusLabel}
        </span>
      </div>
      <div className="mt-4 flex flex-col items-center gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <CraftBaySlot item={left} label="Left input" />
        <span
          aria-hidden="true"
          className="surface-resting flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-xs font-bold text-[var(--color-craft-accent)] shadow-xs"
        >
          +
        </span>
        <CraftBaySlot item={right} label="Right input" />
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {isFilled
          ? "Two element specimens placed into the recessed craft bay."
          : "Recessed bay ready for element specimens to combine."}
      </p>
    </section>
  );
}
