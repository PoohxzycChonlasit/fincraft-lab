const FEATURES = [
  {
    title: "Infinite Crafting",
    description: "Combine financial ideas through direct drag-to-combine interaction on an infinite workspace canvas.",
  },
  {
    title: "Discovery Learning",
    description: "Understand financial lessons, real-world consequences, structural trade-offs, and hidden risks.",
  },
  {
    title: "Personal Workspace",
    description: "Sign in to save canvas element layouts, track unlocked discoveries, and retain progress across sessions.",
  },
];

export function HomeCoreExperiences() {
  return (
    <section aria-label="Core Lab Experiences" className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center sm:text-left">
        Core Lab Capabilities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="surface-resting rounded-2xl border border-[var(--border-subtle)] p-5 space-y-2">
            <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
