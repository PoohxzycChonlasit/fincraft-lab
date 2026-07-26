import { InteractionStateGrid } from "./interaction-state-grid";
import { MotionAccessibilityNote } from "./motion-accessibility-note";
import { RelationshipLanguage } from "./relationship-language";
import { SemanticTokenGrid } from "./semantic-token-grid";
import { SurfaceLadder } from "./surface-ladder";
import { TypographySpecimen } from "./typography-specimen";

export function DesignSystemLab() {
  return (
    <main className="min-h-screen bg-[var(--surface-flat)] text-foreground">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
        <header className="max-w-3xl border-l-4 border-[var(--color-orange-600)] pl-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-teal-700)]">Development-only / FinCraft Lab</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">FinCraft Design System Lab</h1>
          <p className="mt-4 text-lg font-medium text-[var(--color-orange-700)]">Foundation — Tokens, Surfaces, and States</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">A visual material foundation for reviewing semantic roles, tactile depth, typography, interaction states, relationship language, motion boundaries, and accessibility before product components are built.</p>
        </header>
        <div className="mt-12 space-y-12">
          <SemanticTokenGrid />
          <SurfaceLadder />
          <TypographySpecimen />
          <InteractionStateGrid />
          <RelationshipLanguage />
          <MotionAccessibilityNote />
        </div>
      </div>
    </main>
  );
}
