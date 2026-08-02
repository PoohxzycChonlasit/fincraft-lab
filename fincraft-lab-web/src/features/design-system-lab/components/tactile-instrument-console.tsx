"use client";

import { useState } from "react";
import {
  ConsoleControls,
  type AccentRole,
  type Density,
  type SurfaceMode,
  type VisualState,
} from "./console-controls";
import { ConsolePreview } from "./console-preview";

const RADIUS_MAP = [4, 8, 12, 16] as const;
const SHADOW_MAP = [
  "none",
  "var(--shadow-resting)",
  "inset 0 1px 2px rgb(28 25 23 / 0.08)",
  "var(--shadow-raised)",
  "var(--shadow-floating)",
] as const;

const ACCENT_COLOR_MAP: Record<AccentRole, { text: string; bg: string; border: string }> = {
  teal: {
    text: "text-(--color-teal-700)",
    bg: "bg-(--color-teal-600)",
    border: "border-(--color-teal-600)",
  },
  orange: {
    text: "text-(--color-orange-700)",
    bg: "bg-(--color-orange-600)",
    border: "border-(--color-orange-600)",
  },
  neutral: {
    text: "text-foreground",
    bg: "bg-(--muted-foreground)",
    border: "border-foreground",
  },
};

const DENSITY_MAP: Record<Density, { padding: string; gap: string; textSize: string }> = {
  compact: { padding: "p-3", gap: "gap-2", textSize: "text-xs" },
  default: { padding: "p-5", gap: "gap-4", textSize: "text-sm" },
  spacious: { padding: "p-7", gap: "gap-6", textSize: "text-base" },
};

function getButtonStateClass(state: VisualState): string {
  switch (state) {
    case "hover": return "state-sample-hover";
    case "focus": return "state-sample-focus";
    case "pressed": return "state-sample-pressed";
    case "selected": return "state-sample-selected";
    case "disabled": return "state-sample-disabled";
    case "warning": return "state-sample-warning";
    case "destructive": return "state-sample-destructive";
    default: return "";
  }
}

export function TactileInstrumentConsole() {
  const [surface, setSurface] = useState<SurfaceMode>("resting");
  const [accent, setAccent] = useState<AccentRole>("teal");
  const [density, setDensity] = useState<Density>("default");
  const [visualState, setVisualState] = useState<VisualState>("ready");
  const [depthIdx, setDepthIdx] = useState<number>(3);
  const [radiusIdx, setRadiusIdx] = useState<number>(1);

  return (
    <div
      className="surface-resting border border-(--border-subtle) overflow-hidden"
      style={{ boxShadow: "var(--shadow-resting)" }}
    >
      <div className="grid grid-cols-1 divide-y divide-(--border-subtle) lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        <ConsoleControls
          surface={surface}
          accent={accent}
          density={density}
          visualState={visualState}
          depthIdx={depthIdx}
          radiusIdx={radiusIdx}
          currentRadius={RADIUS_MAP[radiusIdx]}
          onSurfaceChange={setSurface}
          onAccentChange={setAccent}
          onDensityChange={setDensity}
          onVisualStateChange={setVisualState}
          onDepthChange={setDepthIdx}
          onRadiusChange={setRadiusIdx}
        />
        <ConsolePreview
          surface={surface}
          accent={accent}
          density={density}
          visualState={visualState}
          depthIdx={depthIdx}
          currentRadius={RADIUS_MAP[radiusIdx]}
          currentShadow={SHADOW_MAP[depthIdx]}
          accentTheme={ACCENT_COLOR_MAP[accent]}
          densityTheme={DENSITY_MAP[density]}
          buttonStateClass={getButtonStateClass(visualState)}
        />
      </div>
    </div>
  );
}
