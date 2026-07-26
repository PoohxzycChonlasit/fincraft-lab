const colorSwatches = [
  { name: "Teal 600", varName: "var(--color-teal-600)", role: "Trust / Primary action" },
  { name: "Teal 700", varName: "var(--color-teal-700)", role: "Deep trust / Heading accent" },
  { name: "Orange 600", varName: "var(--color-orange-600)", role: "Craft / Discovery highlight" },
  { name: "Orange 700", varName: "var(--color-orange-700)", role: "Discovery accent label" },
] as const;

const surfaceSwatches = [
  { name: "surface-flat", varName: "var(--surface-flat)", label: "Flat field" },
  { name: "surface-resting", varName: "var(--surface-resting)", label: "Resting plate" },
  { name: "surface-inset", varName: "var(--surface-inset)", label: "Recessed well" },
  { name: "surface-raised", varName: "var(--surface-raised)", label: "Raised card" },
  { name: "surface-floating", varName: "var(--surface-floating)", label: "Floating overlay" },
] as const;

const borderSwatches = [
  { name: "border-subtle", varName: "var(--border-subtle)", label: "Subtle divider" },
  { name: "border-interactive", varName: "var(--border-interactive)", label: "Focus / Hover ring" },
  { name: "border-selected", varName: "var(--border-selected)", label: "Selected border" },
] as const;

interface SwatchItem {
  name: string;
  varName: string;
  label?: string;
  role?: string;
}

function SwatchColumn({ title, items, isBorder = false }: { title: string; items: readonly SwatchItem[]; isBorder?: boolean }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      <div className="mt-2.5 space-y-2">
        {items.map((s) => (
          <div key={s.name} className="flex items-center gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-2">
            <span
              className={`size-8 shrink-0 rounded-md shadow-xs ${isBorder ? "border-2" : "border border-black/10"}`}
              style={isBorder ? { borderColor: s.varName, backgroundColor: "var(--surface-flat)" } : { backgroundColor: s.varName }}
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground">{s.name}</p>
              <p className="truncate font-mono text-[10px] text-muted-foreground">{s.label || s.varName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TokenSwatchRack() {
  return (
    <div className="surface-resting border border-[var(--border-subtle)] p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-teal-700)]">
            Token Swatch Rack
          </p>
          <h3 className="text-base font-semibold text-foreground">Canonical CSS Variables</h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground">REAL REPOSITORY TOKENS ONLY</span>
      </div>

      <div className="mt-4 grid gap-5 md:grid-cols-3">
        <SwatchColumn title="Brand Color Swatches" items={colorSwatches} />
        <SwatchColumn title="Surface Role Swatches" items={surfaceSwatches} />
        <SwatchColumn title="Border Role Swatches" items={borderSwatches} isBorder />
      </div>
    </div>
  );
}
