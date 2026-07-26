export function LabHeader() {
  return (
    <header className="border-b border-[var(--border-subtle)] pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div
            className="flex size-9 flex-shrink-0 items-center justify-center rounded-md border border-[var(--color-teal-600)] bg-[var(--color-teal-600)] text-sm font-bold text-white"
            style={{ boxShadow: "var(--shadow-raised)" }}
            aria-hidden
          >
            FC
          </div>
          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                FinCraft Tactile Instrument Lab
              </h1>
              <span className="inline-flex items-center rounded-full border border-[var(--color-orange-600)]/40 bg-[var(--color-orange-600)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-orange-700)]">
                DEV ONLY
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A compact tactile control console for probing FinCraft surface depth, colour semantics, and interaction feedback.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2.5 py-1.5 font-mono text-[10px] text-muted-foreground">
            INTERACTIVE MATERIAL TEST
          </span>
          <span className="rounded-md border border-[var(--color-teal-700)]/30 bg-[var(--color-teal-600)]/10 px-2.5 py-1.5 font-mono text-[10px] font-semibold text-[var(--color-teal-700)]">
            FOUNDATION
          </span>
        </div>
      </div>
    </header>
  );
}
