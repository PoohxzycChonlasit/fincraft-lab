const relationships = [
  ["relation-recipe", "relation-solid", true, "Recipe provenance", "Concept A crafts into Concept B"],
  ["relation-support", "relation-solid", true, "Supports", "Concept A supports Concept B"],
  ["relation-reduce", "relation-dashed", true, "May reduce", "Concept A may reduce Concept B"],
  ["relation-tradeoff", "relation-dotted", false, "Trade-off with", "Concept A and Concept B"],
  ["relation-related", "relation-dotted", false, "Related to", "Concept A and Concept B"],
  ["relation-personal", "relation-dashed", false, "Personal / My link", "My Concept A and My Concept B"],
] as const;

export function RelationshipLanguage() {
  return (
    <section aria-labelledby="relation-heading" className="surface-flat border-t border-[var(--border-subtle)] pt-8">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-700)]">05 / relationship language</p>
        <h2 id="relation-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Lines carry a sentence</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">These are static visual-language specimens only. Direction, line pattern, label, and Personal markers stay available in text.</p>
      </div>
      <div className="max-w-3xl divide-y divide-[var(--border-subtle)]">
        {relationships.map(([colour, pattern, directional, label, sentence]) => (
          <div key={label} className={`relation-line ${colour} ${pattern}`}>
            <span className="relation-marker" aria-hidden="true" />
            {directional ? <span aria-hidden="true" className="text-sm font-semibold">→</span> : null}
            <span className="min-w-28 font-semibold">{label}</span>
            <span className="text-muted-foreground">{sentence}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">No Graph library, animated edge, SVG filter, or live data is used in this specimen.</p>
    </section>
  );
}
