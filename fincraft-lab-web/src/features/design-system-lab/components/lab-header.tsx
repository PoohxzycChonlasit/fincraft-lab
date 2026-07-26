export function LabHeader() {
  return (
    <header className="border-b border-[var(--border-subtle)] pb-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-md border border-[var(--color-teal-600)] bg-[var(--color-teal-600)] text-xs font-bold text-white shadow-xs">
            FC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                FinCraft Tactile Instrument Lab
              </h1>
              <span className="inline-flex items-center rounded-full border border-[var(--color-orange-600)]/30 bg-[var(--color-orange-600)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-orange-700)]">
                DEV ONLY
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              A compact tactile control console for probing surface depth, color semantics, and interaction feedback.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 py-1 font-mono text-[11px] text-muted-foreground">
            INTERACTIVE MATERIAL TEST
          </span>
          <span className="inline-flex items-center rounded-md border border-[var(--color-teal-700)]/30 bg-[var(--color-teal-600)]/10 px-2 py-1 font-mono text-[11px] text-[var(--color-teal-700)] font-medium">
            FOUNDATION
          </span>
        </div>
      </div>
    </header>
  );
}
