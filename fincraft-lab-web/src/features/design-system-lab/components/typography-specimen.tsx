export function TypographySpecimen() {
  return (
    <section aria-labelledby="type-heading" className="surface-inset h-full border p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-orange-700)">
        Type and number readout
      </p>
      <h2 id="type-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Sans keeps the tool legible
      </h2>
      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs text-muted-foreground">Product heading</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            Make the material easy to inspect.
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Section heading</p>
          <p className="mt-1 text-xl font-semibold text-foreground">
            Clear hierarchy, quiet supporting copy
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Body text supports inspection without implying a return, recommendation, or live financial
          result.
        </p>
      </div>
      <div className="surface-resting mt-6 border p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Tabular numerical specimen
        </p>
        <p className="mt-4 text-4xl font-semibold tabular-nums text-foreground">£12,345.67</p>
        <p className="mt-4 text-xs font-semibold text-foreground">Compact control label</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Supporting caption remains secondary and readable.
        </p>
      </div>
    </section>
  );
}
