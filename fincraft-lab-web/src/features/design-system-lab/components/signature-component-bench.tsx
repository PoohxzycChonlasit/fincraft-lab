import { FinancialLearningTape } from "@/components/fincraft/financial-learning-tape";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import { OrangeDiscoveryStamp } from "@/components/fincraft/orange-discovery-stamp";
import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";

function ElementTileSpecimens() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-12">
      <SpecimenElementTile
        name="Income"
        category="Cash flow element"
        visual={<span aria-hidden="true">💰</span>}
        supportingLabel="Default resting element tile specimen."
        state="resting"
      />
      <SpecimenElementTile
        name="Saving"
        category="Planning element"
        visual={<span aria-hidden="true">🏦</span>}
        supportingLabel="Selected element tile specimen with active border."
        state="selected"
      />
    </div>
  );
}

function CraftBaySpecimens() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-12">
      <RecessedCraftBay statusLabel="Empty craft bay specimen" />
      <RecessedCraftBay
        left={{ name: "Income", visual: <span aria-hidden="true">💰</span> }}
        right={{ name: "Expense", visual: <span aria-hidden="true">💸</span> }}
        statusLabel="Filled craft bay specimen"
      />
    </div>
  );
}

function DiscoveryStampSpecimen() {
  return (
    <div className="lg:col-span-6">
      <OrangeDiscoveryStamp
        title="Cash Flow"
        combination="Income + Expense"
        supportingText="Successful craft combination unlocked a new financial discovery specimen."
        statusLabel="Successful Discovery"
      />
    </div>
  );
}

function SupportingLabItems() {
  return (
    <>
      <div className="lg:col-span-6">
        <FinancialLearningTape
          title="Monthly learning tape"
          rows={[
            { label: "Monthly income", value: "£2,400.00", emphasis: "normal" },
            { label: "Monthly expenses", value: "£1,850.00", emphasis: "caution" },
            { label: "Available", value: "£550.00", emphasis: "strong" },
          ]}
          note="Illustrative figures for learning; not live data, a recommendation, or financial advice."
        />
      </div>

      <div className="lg:col-span-12">
        <MochiLabNote tone="guidance">
          A lower expense does not automatically mean a better choice. Check the trade-off and the assumptions first.
        </MochiLabNote>
      </div>
    </>
  );
}

export function SignatureComponentBench() {
  return (
    <section aria-labelledby="signature-components-heading" className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
            Signature Components
          </p>
          <h2 id="signature-components-heading" className="mt-1 text-xl font-bold tracking-tight text-foreground">
            FinCraft Core Signature Specimens
          </h2>
        </div>
        <p className="text-xs font-medium text-muted-foreground">
          5 required specimens for visual foundation &amp; material reconciliation
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ElementTileSpecimens />
        <CraftBaySpecimens />
        <DiscoveryStampSpecimen />
        <SupportingLabItems />
      </div>
    </section>
  );
}
