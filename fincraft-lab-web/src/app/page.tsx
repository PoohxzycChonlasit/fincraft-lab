import Link from "next/link";
import { ProductShell } from "@/components/brand/product-shell";

export default function HomePage() {
  return (
    <ProductShell activeTab="home">
      <div className="space-y-8 max-w-3xl mx-auto py-4 sm:py-8">
        <section className="space-y-3 text-center sm:text-left">
          <span className="inline-block rounded-full bg-[var(--color-craft-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-craft-accent)] border border-[var(--border-subtle)]">
            School Personal Project — Educational Lab
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            FinCraft Lab
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl">
            A Financial Literacy Discovery Lab for learning finance by combining Elements, discovering Concepts, and running Simulations.
          </p>
        </section>

        <section aria-label="Core Concept Overview" className="surface-resting rounded-2xl p-6 space-y-4 border border-[var(--border-subtle)] shadow-xs">
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-craft-accent)]">
            Core Concept &amp; Discovery Flow
          </h2>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed">
            In FinCraft Lab, financial concepts are discovered through hands-on element combination in the Craft Lab workspace rather than static textbook definitions.
          </p>
          <div className="pt-2">
            <Link
              href="/lab"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors"
            >
              Go to Craft Lab &rarr;
            </Link>
          </div>
        </section>
      </div>
    </ProductShell>
  );
}
