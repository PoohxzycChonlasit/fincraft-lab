const STEPS = [
  {
    step: "1",
    title: "Place Elements",
    description: "Choose starter financial ideas from the library rack and place them on the interactive Canvas.",
  },
  {
    step: "2",
    title: "Combine",
    description: "Drag one Element specimen directly onto another to craft a new financial concept discovery.",
  },
  {
    step: "3",
    title: "Learn",
    description: "Explore practical lessons, trade-offs, hidden risks, and real-world financial behavior notes.",
  },
];

export function HomeHowItWorks() {
  return (
    <section aria-label="How FinCraft Lab Works" className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center sm:text-left">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((s) => (
          <div key={s.step} className="surface-resting rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--color-craft-accent)]/10 text-xs font-bold text-[var(--color-craft-accent)] border border-[var(--border-subtle)]">
              {s.step}
            </span>
            <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
