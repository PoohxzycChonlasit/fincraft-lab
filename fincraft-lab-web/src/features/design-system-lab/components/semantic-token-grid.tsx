const colourRoles = [
  ["Trust / action", "Teal 600", "var(--color-teal-600)"],
  ["Craft / discovery", "Orange 600", "var(--color-orange-600)"],
  ["Quiet boundary", "Border subtle", "var(--border-subtle)"],
] as const;

const semanticRoles = [
  ["surface-flat", "Normal reading plane"],
  ["surface-inset", "Input or drop well"],
  ["border-selected", "Selected state boundary"],
  ["relation-personal", "Personal / My link"],
] as const;

function ColourSwatch({
  label,
  token,
  value,
}: {
  label: string;
  token: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] py-3 last:border-b-0">
      <span
        aria-hidden="true"
        className="size-10 shrink-0 rounded-lg border border-black/10"
        style={{ backgroundColor: value }}
      />
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{token}</p>
      </div>
    </div>
  );
}

export function SemanticTokenGrid() {
  return (
    <aside aria-labelledby="token-heading" className="surface-resting h-full border p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-teal-700)]">
        Token readout
      </p>
      <h2 id="token-heading" className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        Material roles in use
      </h2>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-foreground">Colour anchors</h3>
        <div className="mt-2">
          {colourRoles.map(([label, token, value]) => (
            <ColourSwatch key={token} label={label} token={token} value={value} />
          ))}
        </div>
      </div>
      <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
        <h3 className="text-sm font-semibold text-foreground">Semantic aliases</h3>
        <dl className="mt-2 divide-y divide-[var(--border-subtle)]">
          {semanticRoles.map(([token, description]) => (
            <div key={token} className="flex min-h-11 items-center justify-between gap-4 py-3">
              <dt className="text-xs font-medium text-[var(--color-teal-700)]">{token}</dt>
              <dd className="text-right text-sm text-muted-foreground">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
