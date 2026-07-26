export function TypographySpecimen() {
  return (
    <section aria-labelledby="type-heading" className="surface-flat border-t border-[var(--border-subtle)] pt-8">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-700)]">03 / hierarchy</p>
        <h2 id="type-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Typography and numerical hierarchy</h2>
      </div>
      <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <div>
            <p className="text-xs text-muted-foreground">Marketing / display sample</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">Learn the shape of a choice.</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Page heading / section heading</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">A calmer way to compare trade-offs</p>
          </div>
          <p className="max-w-[65ch] text-base leading-7 text-muted-foreground">Body copy gives a learning idea enough room to breathe, with readable contrast and no claim that the specimen is live financial advice.</p>
        </div>
        <div className="surface-inset rounded-xl border p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Fictional numeric specimen</p>
          <p className="mt-6 font-mono text-3xl font-semibold tabular-nums text-foreground">฿ 12,345.67</p>
          <p className="mt-2 text-sm text-muted-foreground">Aligned data presentation only. No return, profit, or recommendation is implied.</p>
          <p className="mt-6 text-xs font-semibold text-foreground">Compact control label</p>
          <p className="mt-1 text-xs text-muted-foreground">Supporting caption stays secondary.</p>
        </div>
      </div>
    </section>
  );
}
