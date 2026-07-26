const relationships = [
  { label: "Recipe provenance", varName: "var(--relation-recipe)", pattern: "solid", source: "Income", target: "Saving", dir: true },
  { label: "Supports", varName: "var(--relation-support)", pattern: "solid", source: "Budget", target: "Emergency Fund", dir: true },
  { label: "May reduce", varName: "var(--relation-reduce)", pattern: "dashed", source: "Emergency Fund", target: "Debt", dir: true },
  { label: "Trade-off with", varName: "var(--relation-tradeoff)", pattern: "dotted", source: "Saving", target: "Expense", dir: false },
  { label: "Related to", varName: "var(--relation-related)", pattern: "dotted", source: "Income", target: "Cash Flow", dir: false },
  { label: "Personal / My link", varName: "var(--relation-personal)", pattern: "dashed", source: "My Budget", target: "My Cash Flow", dir: false },
] as const;

export function RelationshipTestBench() {
  return (
    <div className="surface-resting border border-[var(--border-subtle)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-teal-700)]">
            Connection Test Bench
          </p>
          <h3 className="text-base font-semibold text-foreground">Educational Relationship Paths</h3>
        </div>
        <p className="text-xs text-muted-foreground">Static educational specimens</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {relationships.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-2.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs"
          >
            <span className="font-medium text-foreground">{r.source}</span>
            <span className="flex-1 flex items-center justify-center">
              <span
                className="w-full border-t-2"
                style={{
                  borderColor: r.varName,
                  borderStyle: r.pattern === "dashed" ? "dashed" : r.pattern === "dotted" ? "dotted" : "solid",
                }}
              />
            </span>
            <span className="font-semibold text-foreground" style={{ color: r.varName }}>
              {r.dir ? "→" : "↔"}
            </span>
            <span className="text-muted-foreground">{r.target}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
