import { FinancialLearningTape } from "@/components/fincraft/financial-learning-tape";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import { OrangeDiscoveryStamp } from "@/components/fincraft/orange-discovery-stamp";
import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";

export function SignatureComponentBench() {
  return (
    <section aria-labelledby="signature-components-heading" className="border-t border-[var(--border-subtle)] pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-orange-700)]">Component bench</p>
          <h2 id="signature-components-heading" className="mt-2 text-2xl font-semibold tracking-tight text-foreground">FinCraft Signature Component Bench</h2>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">Presentational anatomy — no Product behavior</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          <SpecimenElementTile name="Income" category="Cash flow element" visual={<span aria-hidden="true">IN</span>} supportingLabel="A static element marker for a learning specimen." />
          <SpecimenElementTile name="Saving" category="Planning element" visual={<span aria-hidden="true">SV</span>} supportingLabel="Selection uses marker, boundary, and shallow depth." state="selected" />
        </div>
        <div className="lg:col-span-5">
          <RecessedCraftBay left={{ name: "Income", visual: <span aria-hidden="true">IN</span> }} right={{ name: "Expense", visual: <span aria-hidden="true">EX</span> }} statusLabel="Illustrative combination" />
        </div>
        <div className="lg:col-span-5">
          <OrangeDiscoveryStamp title="Cash Flow" combination="Income + Expense" supportingText="Illustrative discovery anatomy only." statusLabel="New discovery" />
        </div>
        <div className="lg:col-span-7">
          <FinancialLearningTape title="Monthly learning tape" rows={[{ label: "Monthly income", value: "£2,400.00", emphasis: "normal" }, { label: "Monthly expenses", value: "£1,850.00", emphasis: "caution" }, { label: "Available", value: "£550.00", emphasis: "strong" }]} note="Illustrative figures for learning; not live data, a recommendation, or financial advice." />
        </div>
        <div className="lg:col-span-12 lg:max-w-2xl">
          <MochiLabNote tone="guidance">A lower expense does not automatically mean a better choice. Check the trade-off and the assumptions first.</MochiLabNote>
        </div>
      </div>
    </section>
  );
}
