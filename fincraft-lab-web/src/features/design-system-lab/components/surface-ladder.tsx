const surfaces = [
  ["surface-flat", "Flat", "Reading content and canvas background"],
  ["surface-resting", "Resting", "Low-emphasis grouped interaction"],
  ["surface-inset", "Inset", "Input, drop, or recessed experiment area"],
  ["surface-raised", "Raised", "Selected or clearly interactive control"],
  ["surface-floating", "Floating", "Overlay or inspector elevation"],
] as const;

export function SurfaceLadder() {
  return (
    <section aria-labelledby="surface-heading" className="surface-flat border-t border-[var(--border-subtle)] pt-8">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-orange-700)]">02 / tactile depth</p>
        <h2 id="surface-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Five-level surface ladder</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Depth is earned by interaction. A container stays calm and flat until its role needs a tactile state.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {surfaces.map(([token, label, description]) => (
          <div key={token} className={`${token} min-h-36 rounded-xl border p-4`}>
            <p className="font-mono text-xs text-muted-foreground">{token}</p>
            <h3 className="mt-8 text-base font-semibold text-foreground">{label}</h3>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">No glass, full neumorphism, large blur, multi-layer glow, or decorative gradient is used.</p>
    </section>
  );
}
