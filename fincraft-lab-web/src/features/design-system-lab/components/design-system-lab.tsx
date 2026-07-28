import { CompactInspectionNotes } from "./compact-inspection-notes";
import { GlassSurfaceBench } from "./glass-surface-bench";
import { LabHeader } from "./lab-header";
import { RelationshipTestBench } from "./relationship-test-bench";
import { SignatureComponentBench } from "./signature-component-bench";
import { TactileInstrumentConsole } from "./tactile-instrument-console";
import { ThemeMaterialBench } from "./theme-material-bench";
import { TokenSwatchRack } from "./token-swatch-rack";

export function DesignSystemLab() {
  return (
    <main className="min-h-screen bg-[var(--surface-flat)] text-[var(--color-text-primary)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8 space-y-6">
        <LabHeader />

        {/* Theme and Material Prototype Bench */}
        <ThemeMaterialBench />

        {/* Bounded Glass Primitive Bench */}
        <GlassSurfaceBench />

        {/* Signature Components Bench */}
        <section aria-label="Signature Components Bench">
          <SignatureComponentBench />
        </section>

        {/* Integrated Tactile Instrument Console (Client Island) */}
        <section aria-label="Tactile Instrument Console">
          <TactileInstrumentConsole />
        </section>

        {/* Visual Token Swatch Rack */}
        <section aria-label="Token Swatch Rack">
          <TokenSwatchRack />
        </section>

        {/* Connection Test Bench */}
        <section aria-label="Connection Test Bench">
          <RelationshipTestBench />
        </section>

        {/* Inspection Notes */}
        <footer aria-label="Inspection Notes">
          <CompactInspectionNotes />
        </footer>
      </div>
    </main>
  );
}
