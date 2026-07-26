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
  return (
    <div className="surface-resting min-w-0 border p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <div className="mt-4 flex min-h-12 items-center gap-3">
        {item?.visual ? <span className="text-sm font-semibold text-[var(--color-teal-700)]">{item.visual}</span> : null}
        <p className="min-w-0 text-base font-semibold text-foreground">{item?.name ?? "Open slot"}</p>
      </div>
    </div>
  );
}

export function RecessedCraftBay({ left, right, statusLabel }: RecessedCraftBayProps) {
  return (
    <section className="surface-inset border p-4 sm:p-5" aria-label="Recessed craft bay specimen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-orange-700)]">
          Craft bay
        </p>
        <p className="text-xs font-medium text-muted-foreground">{statusLabel}</p>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <CraftBaySlot item={left} label="Left slot" />
        <span aria-hidden="true" className="text-xl font-semibold text-[var(--color-orange-700)]">+</span>
        <CraftBaySlot item={right} label="Right slot" />
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">Two readable materials, one illustrative combination marker.</p>
    </section>
  );
}
