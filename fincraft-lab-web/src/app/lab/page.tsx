import type { Metadata } from "next";
import { ProductShell } from "@/components/brand/product-shell";
import { MochiLabNote } from "@/components/fincraft/mochi-lab-note";
import { RecessedCraftBay } from "@/components/fincraft/recessed-craft-bay";
import { SpecimenElementTile } from "@/components/fincraft/specimen-element-tile";

export const metadata: Metadata = {
  title: "Craft Lab | FinCraft Lab",
  description: "Financial Literacy Discovery Craft Lab host page.",
};

export default function CraftLabPage() {
  return (
    <ProductShell activeTab="lab">
      <div className="space-y-6 max-w-4xl mx-auto">
        <header className="space-y-1.5 border-b border-[var(--border-subtle)] pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-craft-accent)]">
            Discovery Workspace
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Craft Lab</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Combine financial elements in a controlled simulation lab to discover core financial concepts and explore trade-offs.
          </p>
        </header>

        <section aria-label="Lab Preview Specimens" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Element Specimen</h2>
            <SpecimenElementTile
              name="Income"
              category="Cash flow element"
              visual={<span aria-hidden="true">💰</span>}
              supportingLabel="Primary element specimen for learning cash flow dynamics."
              state="resting"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Craft Combination Bay</h2>
            <RecessedCraftBay statusLabel="Craft bay ready" />
          </div>
        </section>

        <footer aria-label="Craft Lab Status Note">
          <MochiLabNote tone="guidance">
            Interactive element crafting, drag-and-drop workspace, and recipe discovery logic will be enabled in the upcoming bounded Craft Canvas task.
          </MochiLabNote>
        </footer>
      </div>
    </ProductShell>
  );
}
