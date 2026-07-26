export function CompactInspectionNotes() {
  return (
    <div className="surface-inset border border-[var(--border-subtle)] p-4 text-xs">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <p className="font-semibold uppercase tracking-wider text-[var(--color-orange-700)] text-[10px]">
            Shallow Tactile Depth
          </p>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Reading stays flat. Depth appears only when a tool well, selected card, or floating inspector earns it.
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wider text-[var(--color-teal-700)] text-[10px]">
            Zero Idle CPU
          </p>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            100–180ms CSS transitions only. No Framer Motion, GSAP, continuous animation, or background timers.
          </p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
            Accessibility & Focus
          </p>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Visible focus rings, tabular numerals, 44px touch targets, and full <code className="font-mono text-[10px]">prefers-reduced-motion</code> support.
          </p>
        </div>
      </div>
    </div>
  );
}
