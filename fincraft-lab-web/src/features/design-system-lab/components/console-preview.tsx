import type { AccentRole, Density, SurfaceMode, VisualState } from "./console-controls";

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
  surface,
  accent,
  radius,
  depthIdx,
}: {
  surface: SurfaceMode;
  accent: AccentRole;
  radius: number;
  depthIdx: number;
}) {
  return (
    <div className="surface-floating mt-4 border border-[var(--border-interactive)] p-3 rounded-md shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-teal-700)]">
        Live Token Inspector
      </p>
      <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[11px] text-foreground">
        <div><span className="text-muted-foreground">surface:</span> var(--surface-{surface})</div>
        <div><span className="text-muted-foreground">accent:</span> {accent}</div>
        <div><span className="text-muted-foreground">radius:</span> {radius}px</div>
        <div><span className="text-muted-foreground">depth:</span> Lvl {depthIdx}</div>
      </div>
    </div>
  );
}

export function ConsolePreview(p: PreviewProps) {
  return (
    <div className="p-4 sm:p-5 lg:col-span-6 bg-[var(--surface-flat)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-orange-700)]">
            Live Material Preview
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">Realtime Specimen</span>
        </div>

        <div
          className={`mt-4 border transition-all duration-150 ${p.densityTheme.padding} ${p.densityTheme.gap} flex flex-col justify-between`}
          style={{
            borderRadius: `${p.currentRadius}px`,
            boxShadow: p.currentShadow,
            borderColor: p.visualState === "selected" ? "var(--border-selected)" : "var(--border-subtle)",
            backgroundColor: `var(--surface-${p.surface})`,
          }}
        >
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 font-semibold ${p.accentTheme.text} ${p.densityTheme.textSize}`}>
              <span className={`size-2 rounded-full ${p.accentTheme.bg}`} />
              Material Specimen
            </span>
            <span className="rounded bg-[var(--surface-inset)] px-2 py-0.5 font-mono text-[10px] text-muted-foreground border border-[var(--border-subtle)]">
              surface-{p.surface}
            </span>
          </div>

          <div className="surface-inset border border-[var(--border-subtle)] p-3 rounded-md">
            <p className="text-[11px] font-medium text-muted-foreground">Recessed Input Well</p>
            <div className="mt-1 flex items-center justify-between font-mono text-xs font-semibold tabular-nums text-foreground">
              <span>£12,345.67</span>
              <span className="text-[10px] text-muted-foreground">Tabular Numerals</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={p.visualState === "disabled"}
              className={`state-sample flex-1 ${p.buttonStateClass}`}
            >
              Action Control ({p.visualState})
            </button>
          </div>
        </div>
      </div>

      <InspectorCard
        surface={p.surface}
        accent={p.accent}
        radius={p.currentRadius}
        depthIdx={p.depthIdx}
      />
    </div>
  );
}
