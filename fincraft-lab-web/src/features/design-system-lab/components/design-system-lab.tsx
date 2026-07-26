import { InteractionStateGrid } from "./interaction-state-grid";
import { MotionAccessibilityNote } from "./motion-accessibility-note";
import { RelationshipLanguage } from "./relationship-language";
import { SemanticTokenGrid } from "./semantic-token-grid";
import { SignatureComponentBench } from "./signature-component-bench";
import { SurfaceLadder } from "./surface-ladder";
import { TypographySpecimen } from "./typography-specimen";

export function DesignSystemLab() {
  return (
    <main className="min-h-screen bg-[var(--surface-flat)] text-foreground">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <header className="grid gap-8 border-b border-[var(--border-subtle)] pb-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
          <div className="border-l-4 border-[var(--color-orange-600)] pl-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-teal-700)]">
              FinCraft Material Workbench
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              FinCraft Design System Lab
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              A development-only test field for checking material depth, control feedback, readable
              financial notation, and connection language before product components exist.
            </p>
          </div>
          <aside className="surface-inset border p-5" aria-label="Workbench operating principle">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-orange-700)]">
              Operating principle
            </p>
            <p className="mt-3 text-sm leading-6 text-foreground">
              Reading stays flat. Depth appears only when a tool, input well, selected control, or
              inspector earns it.
            </p>
          </aside>
        </header>
        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="xl:col-span-8"><SurfaceLadder /></div>
          <div className="xl:col-span-4"><SemanticTokenGrid /></div>
          <div className="xl:col-span-7"><InteractionStateGrid /></div>
          <div className="xl:col-span-5"><TypographySpecimen /></div>
          <div className="xl:col-span-12"><RelationshipLanguage /></div>
          <div className="xl:col-span-12"><SignatureComponentBench /></div>
          <div className="xl:col-span-12"><MotionAccessibilityNote /></div>
        </div>
      </div>
    </main>
  );
}
