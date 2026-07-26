export type SurfaceMode = "resting" | "inset" | "raised" | "floating";
export type AccentRole = "teal" | "orange" | "neutral" | "destructive";
export type Density = "compact" | "default" | "spacious";
export type VisualState = "ready" | "hover" | "focus" | "pressed" | "selected" | "disabled";

interface ControlsProps {
  surface: SurfaceMode;
  accent: AccentRole;
  density: Density;
  visualState: VisualState;
  depthIdx: number;
  radiusIdx: number;
  currentRadius: number;
  onSurfaceChange: (s: SurfaceMode) => void;
  onAccentChange: (a: AccentRole) => void;
  onDensityChange: (d: Density) => void;
  onVisualStateChange: (v: VisualState) => void;
  onDepthChange: (idx: number) => void;
  onRadiusChange: (idx: number) => void;
}

function SegmentedRow<T extends string>({
  label,
  options,
  current,
  onChange,
}: {
  label: string;
  options: readonly T[];
  current: T;
  onChange: (val: T) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="mt-1 flex flex-wrap gap-1 rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-1">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 rounded px-2 py-1 text-[11px] capitalize transition-all ${
              current === opt
                ? "bg-[var(--surface-flat)] text-foreground shadow-xs font-semibold border border-[var(--border-subtle)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function RangeControl({
  label,
  valueText,
  min,
  max,
  value,
  accentColor,
  onChange,
}: {
  label: string;
  valueText: string;
  min: number;
  max: number;
  value: number;
  accentColor: string;
  onChange: (val: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground">{valueText}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`mt-1.5 w-full cursor-pointer ${accentColor}`}
      />
    </div>
  );
}

function VisualStateSelector({
  value,
  onChange,
}: {
  value: VisualState;
  onChange: (v: VisualState) => void;
}) {
  return (
    <div>
      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Visual State</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as VisualState)}
        className="mt-1 w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2 py-1.5 text-[11px] font-medium text-foreground outline-none focus:border-[var(--color-teal-600)]"
      >
        <option value="ready">Ready</option>
        <option value="hover">Hover</option>
        <option value="focus">Focus-visible</option>
        <option value="pressed">Pressed</option>
        <option value="selected">Selected</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>
  );
}

export function ConsoleControls(p: ControlsProps) {
  return (
    <div className="p-4 sm:p-5 lg:col-span-6 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-teal-700)]">
            Material Controller
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">Tactile Inputs</span>
        </div>

        <div className="mt-3.5 space-y-3 text-xs">
          <SegmentedRow label="Surface Mode" options={["resting", "inset", "raised", "floating"] as const} current={p.surface} onChange={p.onSurfaceChange} />
          <SegmentedRow label="Accent Role" options={["teal", "orange", "neutral", "destructive"] as const} current={p.accent} onChange={p.onAccentChange} />

          <div className="grid grid-cols-2 gap-2">
            <SegmentedRow label="Density" options={["compact", "default", "spacious"] as const} current={p.density} onChange={p.onDensityChange} />
            <VisualStateSelector value={p.visualState} onChange={p.onVisualStateChange} />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <RangeControl label="DEPTH SHADOW" valueText={`Lvl ${p.depthIdx}`} min={0} max={4} value={p.depthIdx} accentColor="accent-[var(--color-teal-600)]" onChange={p.onDepthChange} />
            <RangeControl label="CORNER RADIUS" valueText={`${p.currentRadius}px`} min={0} max={3} value={p.radiusIdx} accentColor="accent-[var(--color-orange-600)]" onChange={p.onRadiusChange} />
          </div>
        </div>
      </div>

      <div className="rounded border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-2 text-[11px] text-muted-foreground">
        Direct feedback active: Modifying controls updates the Live Preview instantly.
      </div>
    </div>
  );
}
