import type { AccentRole, Density, SurfaceMode, VisualState } from "./console-controls";

const STATE_BORDER_MAP: Partial<Record<VisualState, string>> = {
  selected: "var(--border-selected)",
  warning: "var(--relation-tradeoff)",
  destructive: "var(--destructive)",
};

const STATE_LABEL_MAP: Record<VisualState, string> = {
  ready: "Ready",
  hover: "Hover",
  focus: "Focus-visible",
  pressed: "Pressed",
  selected: "Selected",
  warning: "Warning",
  destructive: "Destructive",
  disabled: "Disabled",
};

interface PreviewProps {
  surface: SurfaceMode;
  accent: AccentRole;
  density: Density;
  visualState: VisualState;
  depthIdx: number;
  currentRadius: number;
  currentShadow: string;
  accentTheme: { text: string; bg: string; border: string };
  densityTheme: { padding: string; gap: string; textSize: string };
  buttonStateClass: string;
}

function InspectorCard({
  surface, accent, radius, depthIdx, state,
}: {
  surface: SurfaceMode;
  accent: AccentRole;
  radius: number;
  depthIdx: number;
  state: VisualState;
}) {
  return (
    <div
      className="absolute bottom-0 right-0 translate-y-1/3 translate-x-[8%] z-10 surface-floating border border-(--border-interactive) p-3 rounded-md min-w-[160px]"
      style={{ boxShadow: "var(--shadow-floating)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-(--color-teal-700) mb-1.5">
        Inspector
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 font-mono text-[10px]">
        <dt className="text-muted-foreground">surface</dt>
        <dd className="text-foreground truncate">--surface-{surface}</dd>
        <dt className="text-muted-foreground">accent</dt>
        <dd className="text-foreground">{accent}</dd>
        <dt className="text-muted-foreground">state</dt>
        <dd className="text-foreground">{state}</dd>
        <dt className="text-muted-foreground">radius</dt>
        <dd className="text-foreground tabular-nums">{radius}px</dd>
        <dt className="text-muted-foreground">depth</dt>
        <dd className="text-foreground tabular-nums">Lvl {depthIdx}</dd>
      </dl>
    </div>
  );
}

function PreviewSpecimen(p: PreviewProps) {
  const borderColor = STATE_BORDER_MAP[p.visualState] ?? "var(--border-subtle)";
  return (
    <div
      className={`relative border transition-all duration-150 ${p.densityTheme.padding} flex flex-col ${p.densityTheme.gap}`}
      style={{
        borderRadius: `${p.currentRadius}px`,
        boxShadow: p.currentShadow,
        borderColor,
        backgroundColor: `var(--surface-${p.surface})`,
      }}
    >
      {/* Flat field label + accent marker */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-2 font-semibold ${p.accentTheme.text} ${p.densityTheme.textSize}`}>
          <span className={`inline-block size-2.5 rounded-full ${p.accentTheme.bg}`} aria-hidden />
          Material Specimen
        </span>
        <span
          className="rounded px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-(--border-subtle) bg-(--surface-inset)"
          style={{ borderRadius: `${p.currentRadius}px` }}
        >
          surface-{p.surface}
        </span>
      </div>

      {/* Recessed value well */}
      <div className="surface-inset border border-(--border-subtle) px-4 py-3 rounded-md">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Recessed Value Well
        </p>
        <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-foreground">
          £12,345.67
        </p>
      </div>

      {/* Raised action control showing visual state */}
      <button
        type="button"
        disabled={p.visualState === "disabled"}
        className={`state-sample ${p.buttonStateClass} w-full`}
      >
        {STATE_LABEL_MAP[p.visualState]} — Action Control
      </button>

      <InspectorCard
        surface={p.surface}
        accent={p.accent}
        radius={p.currentRadius}
        depthIdx={p.depthIdx}
        state={p.visualState}
      />
    </div>
  );
}

export function ConsolePreview(p: PreviewProps) {
  return (
    <div className="flex flex-col justify-between p-5 lg:col-span-7 bg-(--surface-flat)">
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3 mb-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-(--color-orange-700)">
          Live Material Preview
        </p>
        <span className="font-mono text-[10px] text-muted-foreground">REALTIME SPECIMEN</span>
      </div>
      <div className="flex-1 flex flex-col justify-center pb-8">
        <PreviewSpecimen {...p} />
      </div>
    </div>
  );
}
