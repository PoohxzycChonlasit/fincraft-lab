interface Relation {
  id: string;
  from: string;
  to: string;
  label: string;
  colorVar: string;
  pattern: "solid" | "dashed" | "dotted";
  directional: boolean;
}

const RELATIONS: Relation[] = [
  { id: "recipe", from: "Income", to: "Saving", label: "Recipe provenance", colorVar: "var(--relation-recipe)", pattern: "solid", directional: true },
  { id: "support", from: "Budget", to: "Emergency Fund", label: "Supports", colorVar: "var(--relation-support)", pattern: "solid", directional: true },
  { id: "reduce", from: "Emergency Fund", to: "Debt", label: "May reduce", colorVar: "var(--relation-reduce)", pattern: "dashed", directional: true },
  { id: "tradeoff", from: "Saving", to: "Expense", label: "Trade-off", colorVar: "var(--relation-tradeoff)", pattern: "dotted", directional: false },
  { id: "related", from: "Income", to: "Cash Flow", label: "Related to", colorVar: "var(--relation-related)", pattern: "dotted", directional: false },
  { id: "personal", from: "My Budget", to: "My Cash Flow", label: "Personal link", colorVar: "var(--relation-personal)", pattern: "dashed", directional: false },
];

function NodeBox({ label }: { label: string }) {
  return (
    <div className="surface-resting border border-[var(--border-subtle)] rounded-md px-3 py-2 text-[11px] font-semibold text-foreground text-center min-w-[80px] flex-shrink-0" style={{ boxShadow: "var(--shadow-resting)" }}>
      {label}
    </div>
  );
}

function RelationRow({ r }: { r: Relation }) {
  return (
    <div className="flex items-center gap-2">
      <NodeBox label={r.from} />
      <div className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
        <div
          className="w-full border-t-2"
          style={{
            borderColor: r.colorVar,
            borderStyle: r.pattern,
          }}
          aria-hidden
        />
        <span className="text-[10px] font-medium truncate max-w-full" style={{ color: r.colorVar }}>
          {r.directional ? "→" : "↔"} {r.label}
        </span>
      </div>
      <NodeBox label={r.to} />
    </div>
  );
}

export function RelationshipTestBench() {
  return (
    <div className="surface-resting border border-[var(--border-subtle)] p-5">
      <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-5 gap-2">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-teal-700)]">
            Connection Test Bench
          </p>
          <h3 className="text-base font-semibold text-foreground">Educational Relationship Paths</h3>
        </div>
        <p className="text-[11px] text-muted-foreground">Static educational specimens only</p>
      </div>

      <ul
        className="grid gap-3 sm:grid-cols-2"
        aria-label="Educational relationship network"
      >
        {RELATIONS.map((r) => (
          <li key={r.id}>
            <RelationRow r={r} />
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
        Directional paths show provenance or support flow.
        Symmetric paths show trade-off or general relatedness.
        Personal links are explicitly non-canonical — they represent workspace annotations, not structural facts.
      </p>
    </div>
  );
}
