export function MotionAccessibilityNote() {
  return (
    <section aria-labelledby="motion-heading" className="grid gap-8 border-y border-[var(--border-subtle)] py-8 md:grid-cols-[0.8fr_1.2fr]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-orange-700)]">
          Inspection note
        </p>
        <h2 id="motion-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Finite feedback, quiet idle state
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Hover, focus, and press feedback use short CSS transitions only. The workbench has no
          JavaScript animation, loop, parallax, blur layer, or animated relationship line.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border-l-2 border-[var(--color-teal-600)] pl-4">
          <h3 className="text-sm font-semibold text-foreground">Accessible states</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Text, borders, markers, and focus rings reinforce each status.
          </p>
        </div>
        <div className="border-l-2 border-[var(--color-orange-600)] pl-4">
          <h3 className="text-sm font-semibold text-foreground">Reduced motion</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            <code>prefers-reduced-motion</code> removes non-essential transition and translation.
          </p>
        </div>
      </div>
    </section>
  );
}
