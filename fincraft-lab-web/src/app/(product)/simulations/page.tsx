import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getSimulations } from "@/features/simulation/api/get-simulations";
import { SimulationDisclaimerBanner } from "@/features/simulation/components/simulation-disclaimer-banner";
import type { SimulationSummary } from "@/features/simulation/types/simulation.types";

export const metadata: Metadata = {
  title: "Financial Simulations | FinCraft Lab",
  description: "Test financial assumptions with interactive educational decision models.",
};

function SimulationCard({ sim }: { sim: SimulationSummary }) {
  return (
    <article className="surface-solid flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] p-5 sm:p-6 space-y-5 hover:border-[var(--accent-teal)] transition-colors">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-paper)] px-2.5 py-1 text-[10px] font-bold text-[var(--accent-teal)] border border-[var(--border-subtle)]">
            <Activity className="h-3 w-3" aria-hidden="true" />
            Active Model
          </span>
          {sim.thaiName && (
            <span className="font-caption text-muted-foreground">{sim.thaiName}</span>
          )}
        </div>
        <h2 className="font-section-title text-foreground">{sim.name}</h2>
        <p className="font-body-small text-muted-foreground leading-relaxed">{sim.summary}</p>
      </div>

      <Link
        href={`/simulations/${sim.id}`}
        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-xs font-bold text-white shadow-xs hover:bg-[var(--accent-teal-strong)] transition-colors"
      >
        <Activity className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Open Experiment</span>
      </Link>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-8 text-center space-y-2">
      <p className="font-section-title text-muted-foreground">No Active Simulations</p>
      <p className="font-body-small text-muted-foreground">Check back when financial experiment models are published.</p>
    </div>
  );
}

export default async function SimulationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?returnTo=/simulations");

  const simulations = await getSimulations();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="border-b border-[var(--border-subtle)] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-teal)]">
          <Activity size={14} aria-hidden="true" />
          <span>Financial Experiments</span>
        </div>
        <h1 className="font-page-title text-foreground">Financial Simulations</h1>
        <p className="font-body-small text-muted-foreground">
          Test financial assumptions using educational calculation models. Results are estimates — not predictions, not advice.
        </p>
      </header>

      <SimulationDisclaimerBanner />

      {simulations.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {simulations.map((sim) => (
            <SimulationCard key={sim.id} sim={sim} />
          ))}
        </div>
      )}
    </div>
  );
}
