import { ThemeSwitcher } from "@/features/theme/components/theme-switcher";

export function ThemeMaterialBench() {
  return (
    <section
      aria-label="FinCraft Theme and Material Bench"
      className="p-6 rounded-2xl bg-[var(--surface-resting)] border border-[var(--border-subtle)] shadow-[var(--shadow-resting)] space-y-6"
    >
      <BenchHeader />
      <CandidateAlert />
      <SpecimensGrid />
    </section>
  );
}

function BenchHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
      <div>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          FinCraft Theme &amp; Material Bench
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">
          Design System V2 Paper-and-Glass Hybrid Material &amp; Theme Prototype
        </p>
      </div>
      <div className="w-full sm:w-80">
        <ThemeSwitcher />
      </div>
    </div>
  );
}

function CandidateAlert() {
  return (
    <div className="p-3 rounded-lg bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-xs text-[var(--color-text-secondary)] flex items-start gap-2">
      <span className="font-bold text-[var(--color-craft-accent)]">NOTE:</span>
      <span>
        Dark values are prototype candidates pending contrast, accessibility, and performance validation.
      </span>
    </div>
  );
}

function SpecimensGrid() {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
        Material &amp; Surface Role Specimens
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OpaqueContentSpecimen />
        <GroupedLearningSpecimen />
        <LiftedControlSpecimen />
        <SelectedSurfaceSpecimen />
        <FloatingInspectorSpecimen />
        <OverlayDrawerSpecimen />
      </div>
    </div>
  );
}

function OpaqueContentSpecimen() {
  return (
    <div className="p-4 rounded-xl surface-card space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">1. Opaque Content</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--color-text-muted)]">Solid 100%</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">
        Flat, opaque document card for educational lessons, trade-offs, and long-form financial content.
      </p>
    </div>
  );
}

function GroupedLearningSpecimen() {
  return (
    <div className="p-4 rounded-xl surface-inset space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-[var(--color-text-secondary)]">2. Grouped Learning</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--color-text-muted)]">Recessed Well</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">
        Recessed sub-panel for input fields, craft bay slots, and grouped parameter lists.
      </p>
    </div>
  );
}

function LiftedControlSpecimen() {
  return (
    <div className="p-4 rounded-xl surface-resting space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-[var(--color-action-primary)]">3. Lifted Control</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-subtle)] text-[var(--color-action-primary)]">Tactile Highlight</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">
        Interactive control surface with top specular inner highlight and subtle resting elevation.
      </p>
    </div>
  );
}

function SelectedSurfaceSpecimen() {
  return (
    <div className="p-4 rounded-xl surface-raised space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-[var(--color-craft-accent)]">4. Selected Surface</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-inset)] border border-[var(--border-selected)] text-[var(--color-craft-accent)]">Active Edge</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">
        Active node or selected craft element with energetic orange border stroke and raised shadow.
      </p>
    </div>
  );
}

function FloatingInspectorSpecimen() {
  return (
    <div className="p-4 rounded-xl surface-floating space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-[var(--color-action-primary)]">5. Floating Inspector</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-floating)] text-[var(--color-action-primary)]">Translucent 92%</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">
        Bounded tool island, popover, or graph inspector with subtle 8px backdrop blur and solid fallback.
      </p>
    </div>
  );
}

function OverlayDrawerSpecimen() {
  return (
    <div className="p-4 rounded-xl surface-overlay space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-[var(--color-text-primary)]">6. Overlay Drawer</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-card)] border border-[var(--border-subtle)] text-[var(--color-text-secondary)]">Overlay 96%</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)]">
        Modal dialog or sheet drawer layer with 12px backdrop blur and deep overlay shadow.
      </p>
    </div>
  );
}
