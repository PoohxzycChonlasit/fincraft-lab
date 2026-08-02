export type FinancialLearningTapeRow = {
  label: string;
  value: string;
  emphasis?: "normal" | "strong" | "caution";
};

export type FinancialLearningTapeProps = {
  title: string;
  rows: FinancialLearningTapeRow[];
  note: string;
};

function EmphasisLabel({ emphasis = "normal" }: { emphasis?: FinancialLearningTapeRow["emphasis"] }) {
  if (emphasis === "strong") {
    return <span className="text-xs font-semibold text-(--color-teal-700)">Key value</span>;
  }

  if (emphasis === "caution") {
    return <span className="text-xs font-semibold text-(--color-orange-700)">Check input</span>;
  }

  return null;
}

export function FinancialLearningTape({ title, rows, note }: FinancialLearningTapeProps) {
  return (
    <section className="border-y-2 border-(--color-teal-700) py-5" aria-labelledby="financial-learning-tape-title">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 id="financial-learning-tape-title" className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--color-teal-700)">Illustrative learning only</p>
      </div>
      <dl className="mt-4 divide-y divide-(--border-subtle)">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 py-3">
            <dt className={row.emphasis === "strong" ? "font-semibold text-foreground" : "text-sm text-foreground"}>{row.label}</dt>
            <dd className={row.emphasis === "strong" ? "text-right font-semibold tabular-nums text-foreground" : "text-right tabular-nums text-foreground"}>{row.value}</dd>
            <div className="col-span-2"><EmphasisLabel emphasis={row.emphasis} /></div>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">{note}</p>
    </section>
  );
}
