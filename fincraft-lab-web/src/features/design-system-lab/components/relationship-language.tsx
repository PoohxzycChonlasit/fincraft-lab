const relationships = [
  ["relation-recipe", "relation-solid", true, "Recipe provenance", "Income", "Saving"],
  ["relation-support", "relation-solid", true, "Supports", "Budget", "Emergency Fund"],
  ["relation-reduce", "relation-dashed", true, "May reduce", "Emergency Fund", "Debt"],
  ["relation-tradeoff", "relation-dotted", false, "Trade-off with", "Saving", "Expense"],
  ["relation-related", "relation-dotted", false, "Related to", "Income", "Cash Flow"],
  ["relation-personal", "relation-dashed", false, "Personal / My link", "My Budget", "My Cash Flow"],
] as const;

export function RelationshipLanguage() {
  return (
    <section aria-labelledby="relation-heading" className="border-t border-(--border-subtle) pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-teal-700)">
            Connection experiment
          </p>
          <h2 id="relation-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            A small network with readable paths
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted-foreground">
          Static educational specimens only. A line never carries meaning without label and endpoint text.
        </p>
      </div>
      <div className="surface-inset mt-5 border p-4 sm:p-6">
        <div className="surface-resting max-w-44 border p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Learning nodes
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">Connection bench</p>
        </div>
        <div className="mt-5 grid gap-x-8 gap-y-1 lg:grid-cols-2">
          {relationships.map(([colour, pattern, directional, label, source, target]) => (
            <div key={label} className={["relation-line", colour, pattern].join(" ")}>
              <span className="min-w-20 font-semibold text-foreground">{source}</span>
              <span className="relation-marker" aria-hidden="true" />
              <span aria-hidden="true" className="text-sm font-semibold">{directional ? "→" : "↔"}</span>
              <span className="font-semibold">{label}</span>
              <span className="text-muted-foreground">{target}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Recipe, support, and reduction paths are directional. Trade-off and related paths are
          symmetric. Personal links are explicitly non-canonical.
        </p>
      </div>
    </section>
  );
}
