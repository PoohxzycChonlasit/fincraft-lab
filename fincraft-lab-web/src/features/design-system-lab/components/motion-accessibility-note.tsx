export function MotionAccessibilityNote() {
  return (
    <section aria-labelledby="motion-heading" className="surface-flat border-y border-[var(--border-subtle)] py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-orange-700)]">06 / motion boundary</p>
          <h2 id="motion-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Finite, event-driven, quiet</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Hover, focus, and press feedback use short CSS transitions only. There is no JavaScript animation, loop, parallax, spring, blur layer, or animated relationship line.</p>
        </div>
        <div className="surface-resting rounded-xl border p-5">
          <h3 className="text-sm font-semibold text-foreground">Accessibility note</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
            <li>States use text, borders, markers, and focus rings, not colour alone.</li>
            <li>Controls keep a 44px target intent and visible keyboard focus.</li>
            <li><code>prefers-reduced-motion</code> removes non-essential transition and translation.</li>
            <li>Relationship meaning remains readable as text when a graph is absent.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
