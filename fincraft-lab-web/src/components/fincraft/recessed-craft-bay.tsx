import type { ReactNode } from "react";

export type CraftBayItem = {
  name: string;
  visual?: ReactNode;
};

export type RecessedCraftBayProps = {
  left?: CraftBayItem;
  right?: CraftBayItem;
  statusLabel: string;
  activeSlot?: "left" | "right";
  onSelectSlot?: (slot: "left" | "right") => void;
  onClearSlot?: (slot: "left" | "right") => void;
};

type SlotProps = {
  item?: CraftBayItem;
  label: string;
  slotKey: "left" | "right";
  isActive?: boolean;
  onSelectSlot?: (slot: "left" | "right") => void;
  onClearSlot?: (slot: "left" | "right") => void;
};

function SlotClearButton({ label, slotKey, onClear }: { label: string; slotKey: "left" | "right"; onClear: (slot: "left" | "right") => void }) {
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClear(slotKey); }}
      className="flex size-7 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-resting)] text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40 transition-colors"
      title={`Clear ${label} slot`}
      aria-label={`Clear ${label} slot`}
    >
      ✕
    </button>
  );
}

function CraftBaySlot({ item, label, slotKey, isActive, onSelectSlot, onClearSlot }: SlotProps) {
  const isInteractive = Boolean(onSelectSlot);
  const borderStyle = isActive
    ? "ring-2 ring-[var(--color-craft-accent)] border-[var(--color-craft-accent)] bg-[var(--surface-resting)]"
    : "border-[var(--border-subtle)] hover:border-[var(--color-craft-accent)]/60 bg-[var(--surface-flat)]/60";

  return (
    <div
      onClick={isInteractive ? () => onSelectSlot?.(slotKey) : undefined}
      className={`relative flex min-h-[68px] w-full flex-1 items-center justify-between gap-3 rounded-xl border p-3.5 transition-all ${borderStyle} ${isInteractive ? "cursor-pointer" : ""}`}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelectSlot?.(slotKey); } } : undefined}
      aria-label={`${label} slot ${isActive ? "(Active)" : ""}: ${item ? item.name : "Empty"}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
          {isActive ? <span className="rounded bg-[var(--color-craft-accent)]/15 px-1.5 py-0.5 text-[9px] font-bold text-[var(--color-craft-accent)] uppercase tracking-wider">Active</span> : null}
        </div>
        {item ? (
          <p className="mt-0.5 min-w-0 truncate text-sm font-semibold text-foreground">{item.name}</p>
        ) : (
          <span className="mt-0.5 block text-xs font-medium text-muted-foreground/70 italic">Select to place</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {item?.visual ? (
          <span className="surface-inset flex size-9 shrink-0 items-center justify-center rounded-md border border-[var(--border-subtle)] text-lg sm:text-xl leading-none font-semibold text-[var(--color-action-primary)]">
            {item.visual}
          </span>
        ) : null}
        {item && onClearSlot ? <SlotClearButton label={label} slotKey={slotKey} onClear={onClearSlot} /> : null}
      </div>
    </div>
  );
}

export function RecessedCraftBay({ left, right, statusLabel, activeSlot, onSelectSlot, onClearSlot }: RecessedCraftBayProps) {
  const isFilled = Boolean(left && right);

  return (
    <section className="surface-inset rounded-2xl p-4 sm:p-5" aria-label="Recessed craft bay specimen">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">Craft Bay</p>
        <span className="rounded-md bg-[var(--surface-resting)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground border border-[var(--border-subtle)]">{statusLabel}</span>
      </div>
      <div className="mt-4 flex flex-col items-center gap-3 sm:grid sm:grid-cols-[1fr_auto_1fr]">
        <CraftBaySlot item={left} label="Left Input" slotKey="left" isActive={activeSlot === "left"} onSelectSlot={onSelectSlot} onClearSlot={onClearSlot} />
        <span aria-hidden="true" className="surface-resting flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-xs font-bold text-[var(--color-craft-accent)] shadow-xs">+</span>
        <CraftBaySlot item={right} label="Right Input" slotKey="right" isActive={activeSlot === "right"} onSelectSlot={onSelectSlot} onClearSlot={onClearSlot} />
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        {isFilled ? "Two element specimens placed into the recessed craft bay. Ready for crafting." : "Click a slot to set it active, then select an element below to place or replace."}
      </p>
    </section>
  );
}
