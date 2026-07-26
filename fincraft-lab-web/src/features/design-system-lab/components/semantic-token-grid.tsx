const colourRoles = [
  ["Trust / action", "Teal 600", "var(--color-teal-600)"],
  ["Craft / discovery", "Orange 600", "var(--color-orange-600)"],
  ["Reading surface", "Surface flat", "var(--surface-flat)"],
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
    <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] py-3">
      <span
        aria-hidden="true"
        className="size-10 shrink-0 rounded-lg border border-black/10"
        style={{ backgroundColor: value }}
      />
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="font-mono text-xs text-muted-foreground">{token}</p>
      </div>
    </div>
  );
}

export function SemanticTokenGrid() {
  return (
    <section aria-labelledby="token-heading" className="surface-flat border-t border-[var(--border-subtle)] pt-8">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-700)]">01 / semantic language</p>
        <h2 id="token-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Semantic token roles</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Approved base colours are reused through named roles so components communicate meaning without inventing a second palette.</p>
      </div>
      <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Colour anchors</h3>
          <div className="mt-2">
            {colourRoles.map(([label, token, value]) => <ColourSwatch key={token} label={label} token={token} value={value} />)}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Semantic aliases</h3>
          <dl className="mt-2 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
            {semanticRoles.map(([token, description]) => (
              <div key={token} className="flex min-h-12 items-center justify-between gap-4 py-3">
                <dt className="font-mono text-xs text-[var(--color-teal-700)]">{token}</dt>
                <dd className="text-right text-sm text-muted-foreground">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
