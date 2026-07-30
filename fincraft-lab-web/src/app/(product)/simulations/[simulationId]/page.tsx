import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Activity, FlaskConical } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getSimulationDetail } from "@/features/simulation/api/get-simulation-detail";
import { getSimulationRun } from "@/features/simulation/api/get-simulation-run";
import { SimulationDisclaimerBanner } from "@/features/simulation/components/simulation-disclaimer-banner";
import { SimulationRunnerClient } from "@/features/simulation/components/simulation-runner-client";

export const metadata: Metadata = {
  title: "Emergency Fund Runway | FinCraft Lab",
  description: "Calculate how many months your emergency savings will support essential living costs.",
};

type PageProps = {
  params: Promise<{ simulationId: string }>;
  searchParams: Promise<{ runId?: string }>;
};

export default async function SimulationDetailPage({ params, searchParams }: PageProps) {
  const { simulationId } = await params;
  const { runId } = await searchParams;

  const user = await getSessionUser();
  if (!user) redirect(`/login?returnTo=/simulations/${simulationId}`);

  const detail = await getSimulationDetail(simulationId);
  if (!detail) notFound();

  const initialRun = runId ? await getSimulationRun(runId) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* BREADCRUMB */}
      <Link
        href="/simulations"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span>All Financial Experiments</span>
      </Link>

      {/* EXPERIMENT IDENTITY */}
      <header className="space-y-3 border-b border-[var(--border-subtle)] pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-teal)]">
              <Activity size={13} aria-hidden="true" />
              <span>Financial Experiment</span>
            </div>
            <h1 className="font-page-title text-foreground">{detail.name}</h1>
            {detail.thaiName && (
              <p className="font-caption text-muted-foreground">{detail.thaiName}</p>
            )}
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-solid)] px-3 py-1 text-[10px] font-bold text-muted-foreground border border-[var(--border-subtle)]">
            <FlaskConical size={11} aria-hidden="true" />
            v{detail.calculationVersion}
          </span>
        </div>

        <p className="font-body text-muted-foreground leading-relaxed">{detail.description}</p>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-solid)] p-3 text-xs font-mono text-foreground">
          <FlaskConical className="h-4 w-4 shrink-0 text-[var(--accent-teal)]" aria-hidden="true" />
          <span>Formula: {detail.formulaExplanation}</span>
        </div>
      </header>

      {/* SAFETY CONTEXT — near top */}
      <SimulationDisclaimerBanner />

      {/* RUNNER CLIENT ISLAND */}
      <SimulationRunnerClient detail={detail} initialRun={initialRun} />
    </div>
  );
}
