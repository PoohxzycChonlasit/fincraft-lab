import { CompactInspectionNotes } from "./compact-inspection-notes";
import { LabHeader } from "./lab-header";
import { RelationshipTestBench } from "./relationship-test-bench";
import { TactileInstrumentConsole } from "./tactile-instrument-console";
import { TokenSwatchRack } from "./token-swatch-rack";

export function DesignSystemLab() {
  return (
    <main className="min-h-screen bg-[var(--surface-flat)] text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8 space-y-6">
        <LabHeader />

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
