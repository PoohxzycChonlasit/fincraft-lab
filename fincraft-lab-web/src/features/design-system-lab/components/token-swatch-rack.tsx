const brandSwatches = [
  { name: "Teal 600", varName: "--color-teal-600", hex: "#0D9488", role: "Trust / Action" },
  { name: "Teal 700", varName: "--color-teal-700", hex: "#0F766E", role: "Hover / Deep Trust" },
  { name: "Orange 600", varName: "--color-orange-600", hex: "#EA580C", role: "Craft / Discovery" },
  { name: "Orange 700", varName: "--color-orange-700", hex: "#C2410C", role: "Discovery Accent" },
] as const;

const surfaceSwatches = [
  { name: "surface-flat", cssClass: "surface-flat border", label: "Flat field" },
  { name: "surface-resting", cssClass: "surface-resting border", label: "Resting plate" },
  { name: "surface-inset", cssClass: "surface-inset border", label: "Recessed well" },
  { name: "surface-raised", cssClass: "surface-raised border", label: "Raised card" },
  { name: "surface-floating", cssClass: "surface-floating border", label: "Floating overlay" },
] as const;

const borderSwatches = [
  { name: "border-subtle", varName: "--border-subtle", label: "Quiet boundary" },
  { name: "border-interactive", varName: "--border-interactive", label: "Hover / Focus ring" },
  { name: "border-selected", varName: "--border-selected", label: "Selected state" },
] as const;

function BrandSwatchCard({ name, varName, hex, role }: (typeof brandSwatches)[number]) {
  return (
    <div className="overflow-hidden rounded-md border border-(--border-subtle)" style={{ boxShadow: "var(--shadow-resting)" }}>
      <div
        className="h-20 w-full"
        style={{ backgroundColor: `var(${varName})` }}
        aria-label={`${name}: ${hex}`}
      />
      <div className="px-3 py-2.5 bg-(--surface-resting) border-t border-(--border-subtle)">
        <p className="text-[11px] font-bold text-foreground">{name}</p>
        <p className="font-mono text-[10px] text-muted-foreground">{hex}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

function SurfaceSpecimenCard({ name, cssClass, label }: (typeof surfaceSwatches)[number]) {
  return (
    <div className={`${cssClass} rounded-md px-3 py-3 flex items-center justify-between`}>
      <div>
        <p className="text-[11px] font-bold text-foreground">{name}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground opacity-60">
        var(--{name})
      </span>
    </div>
  );
}

function BorderStrokeCard({ name, varName, label }: (typeof borderSwatches)[number]) {
  return (
    <div className="rounded-md bg-(--surface-inset) p-3 flex items-center gap-3">
      <div
        className="h-10 w-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: `var(${varName})` }}
        aria-hidden
      />
      <div>
        <p className="text-[11px] font-bold text-foreground">{name}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function TokenSwatchRack() {
  return (
    <div className="surface-resting border border-(--border-subtle) p-5">
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3 mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-teal-700)">
            Token Swatch Rack
          </p>
          <h3 className="text-base font-semibold text-foreground">Canonical CSS Variables</h3>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">REAL REPOSITORY TOKENS ONLY</span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Brand Colour Swatches */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Brand Colours</p>
          <div className="grid grid-cols-2 gap-2.5">
            {brandSwatches.map((s) => (
              <BrandSwatchCard key={s.name} {...s} />
            ))}
          </div>
        </div>

        {/* Surface Role Specimens */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Surface Roles</p>
          <div className="space-y-2">
            {surfaceSwatches.map((s) => (
              <SurfaceSpecimenCard key={s.name} {...s} />
            ))}
          </div>
        </div>

        {/* Border Stroke Specimens */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Border Roles</p>
          <div className="space-y-2">
            {borderSwatches.map((s) => (
              <BorderStrokeCard key={s.name} {...s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
