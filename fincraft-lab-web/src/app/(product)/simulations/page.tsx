import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Play, Sparkles } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getSimulations } from "@/features/simulation/api/get-simulations";
import { SimulationDisclaimerBanner } from "@/features/simulation/components/simulation-disclaimer-banner";
import type { SimulationSummary } from "@/features/simulation/types/simulation.types";

export const metadata: Metadata = {
  title: "Financial Simulations | FinCraft Lab",
  description: "Explore interactive financial decision models and discovery tools.",
};

function SimulationCard({ sim }: { sim: SimulationSummary }) {
  return (
    <div className="surface-card flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] p-5 space-y-4 shadow-sm hover:border-[var(--brand-accent)] transition-colors">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-inset)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--brand-accent)] border border-[var(--border-subtle)]">
            <Sparkles className="h-3 w-3" />
            Active Model
          </span>
          <span className="text-xs font-semibold text-muted-foreground">{sim.thaiName}</span>
        </div>
        <h2 className="text-lg font-bold text-foreground">{sim.name}</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">{sim.summary}</p>
      </div>

      <Link
        href={`/simulations/${sim.id}`}
        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors"
      >
        <Play className="h-3.5 w-3.5 fill-current" />
        <span>Open Simulation</span>
      </Link>
    </div>
  );
}

export default async function SimulationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?returnTo=/simulations");

  const simulations = await getSimulations();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="border-b border-[var(--border-subtle)] pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-accent)]">
          Discovery Models
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Financial Simulations
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Interactive educational decision models for testing financial assumptions and survival runway.
        </p>
      </div>

      <SimulationDisclaimerBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {simulations.map((sim) => (
          <SimulationCard key={sim.id} sim={sim} />
        ))}
      </div>
    </div>
  );
}
