export type SurfaceMode = "resting" | "inset" | "raised" | "floating";
export type AccentRole = "teal" | "orange" | "neutral";
export type Density = "compact" | "default" | "spacious";
export type VisualState =
  | "ready"
  | "hover"
  | "focus"
  | "pressed"
  | "selected"
  | "warning"
  | "destructive"
  | "disabled";

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

function ControlLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
      {children}
    </label>
  );
}

function SegmentedControl<T extends string>({
  options,
  current,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  current: T;
  onChange: (val: T) => void;
}) {
  return (
    <div
      role="group"
      className="flex rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-[3px] gap-[3px]"
      style={{ boxShadow: "inset 0 1px 3px rgb(28 25 23 / 0.10)" }}
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className={[
            "flex-1 min-h-[38px] rounded px-2 text-[11px] font-medium capitalize transition-all duration-150",
            "focus-visible:outline-2 focus-visible:outline-[var(--color-teal-600)] focus-visible:outline-offset-1",
            current === value
              ? "bg-[var(--surface-resting)] text-foreground font-semibold border-l-2 border-[var(--color-teal-600)]"
              : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-resting)]/60",
          ].join(" ")}
          style={
            current === value
              ? { boxShadow: "var(--shadow-raised)" }
              : undefined
          }
          aria-pressed={current === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function RangeControl({
  label,
  valueText,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  valueText: string;
  min: number;
  max: number;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="font-mono text-[13px] font-semibold text-foreground tabular-nums">
          {valueText}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lab-range w-full cursor-pointer"
        aria-label={label}
      />
    </div>
  );
}

function StateSelector({
  value,
  onChange,
}: {
  value: VisualState;
  onChange: (v: VisualState) => void;
}) {
  return (
    <div>
      <ControlLabel>State</ControlLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as VisualState)}
        className="w-full min-h-[38px] rounded-md border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-2.5 py-2 text-[12px] font-medium text-foreground outline-none focus:border-[var(--color-teal-600)] focus:ring-2 focus:ring-[var(--color-teal-600)]/20 transition-colors"
        style={{ boxShadow: "inset 0 1px 3px rgb(28 25 23 / 0.10)" }}
      >
        <option value="ready">Ready</option>
        <option value="hover">Hover</option>
        <option value="focus">Focus-visible</option>
        <option value="pressed">Pressed</option>
        <option value="selected">Selected</option>
        <option value="warning">Warning</option>
        <option value="destructive">Destructive</option>
        <option value="disabled">Disabled</option>
      </select>
    </div>
  );
}

const SURFACE_OPTS = [
  { value: "resting" as SurfaceMode, label: "Resting" },
  { value: "inset" as SurfaceMode, label: "Inset" },
  { value: "raised" as SurfaceMode, label: "Raised" },
  { value: "floating" as SurfaceMode, label: "Float" },
];
const ACCENT_OPTS = [
  { value: "teal" as AccentRole, label: "Trust" },
  { value: "orange" as AccentRole, label: "Discovery" },
  { value: "neutral" as AccentRole, label: "Neutral" },
];
const DENSITY_OPTS = [
  { value: "compact" as Density, label: "Compact" },
  { value: "default" as Density, label: "Default" },
  { value: "spacious" as Density, label: "Spacious" },
];

function RangePair(p: Pick<ControlsProps, "depthIdx" | "radiusIdx" | "currentRadius" | "onDepthChange" | "onRadiusChange">) {
  return (
    <div className="grid grid-cols-2 gap-4 pt-1 border-t border-[var(--border-subtle)]">
      <RangeControl label="Depth Shadow" valueText={`Lvl ${p.depthIdx}`} min={0} max={4} value={p.depthIdx} onChange={p.onDepthChange} />
      <RangeControl label="Radius" valueText={`${p.currentRadius}px`} min={0} max={3} value={p.radiusIdx} onChange={p.onRadiusChange} />
    </div>
  );
}

export function ConsoleControls(p: ControlsProps) {
  return (
    <div className="flex flex-col justify-between p-5 lg:col-span-5 space-y-5">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3 mb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-teal-700)]">Material Controller</p>
          <span className="font-mono text-[10px] text-muted-foreground">TACTILE INPUTS</span>
        </div>
        <div className="space-y-4">
          <div>
            <ControlLabel>Surface Mode</ControlLabel>
            <SegmentedControl options={SURFACE_OPTS} current={p.surface} onChange={p.onSurfaceChange} />
          </div>
          <div>
            <ControlLabel>Accent Role</ControlLabel>
            <SegmentedControl options={ACCENT_OPTS} current={p.accent} onChange={p.onAccentChange} />
          </div>
          <div>
            <ControlLabel>Density</ControlLabel>
            <SegmentedControl options={DENSITY_OPTS} current={p.density} onChange={p.onDensityChange} />
          </div>
          <StateSelector value={p.visualState} onChange={p.onVisualStateChange} />
          <RangePair depthIdx={p.depthIdx} radiusIdx={p.radiusIdx} currentRadius={p.currentRadius} onDepthChange={p.onDepthChange} onRadiusChange={p.onRadiusChange} />
        </div>
      </div>
      <p className="rounded border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3 py-2 text-[11px] text-muted-foreground">
        All controls update the Live Preview instantly.
      </p>
    </div>
  );
}
