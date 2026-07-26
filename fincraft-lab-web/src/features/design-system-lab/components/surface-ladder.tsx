export function SurfaceLadder() {
  return (
    <section aria-labelledby="surface-heading" className="h-full">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-orange-700)]">
            Material stage
          </p>
          <h2 id="surface-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            One field, five earned depths
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          The field stays flat; test materials introduce depth only where their role needs it.
        </p>
      </div>
      <div className="surface-flat mt-5 border border-[var(--border-subtle)] p-4 sm:p-6">
        <p className="text-xs font-medium text-muted-foreground">Flat workbench field</p>
        <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_12rem] lg:items-center">
          <div className="surface-resting border p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-teal-700)]">
                  Resting plate
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Stable grouped interaction sits one step above the field.
                </p>
              </div>
              <span
                aria-hidden="true"
                className="size-3 shrink-0 border border-[var(--border-subtle)] bg-[var(--surface-flat)]"
              />
            </div>
            <div className="surface-inset mt-6 border p-5">
              <p className="text-xs font-semibold text-foreground">Inset well</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                A recessed area for a focused test or input.
              </p>
              <button type="button" className="state-sample state-sample-selected mt-5 w-full text-left">
                Raised control
                <span className="ml-2 text-xs font-normal text-muted-foreground">Selected material</span>
              </button>
            </div>
          </div>
          <aside className="surface-floating border p-4 lg:-ml-8" aria-label="Floating inspector">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-teal-700)]">
              Floating inspector
            </p>
            <p className="mt-3 text-sm font-semibold text-foreground">Depth check</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              A compact layer above the material plate.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
