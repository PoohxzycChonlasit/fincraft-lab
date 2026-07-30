import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
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

function FormulaBox({ explanation }: { explanation: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-3 text-xs text-foreground font-mono">
      <BookOpen className="h-4 w-4 shrink-0 text-[var(--brand-accent)] font-sans" />
      <span>Formula: {explanation}</span>
    </div>
  );
}

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
      <div className="space-y-3 border-b border-[var(--border-subtle)] pb-4">
        <Link
          href="/simulations"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Simulations</span>
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{detail.name}</h1>
          <span className="text-xs font-semibold text-muted-foreground">{detail.thaiName}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{detail.description}</p>
        <FormulaBox explanation={detail.formulaExplanation} />
      </div>

      <SimulationDisclaimerBanner />

      <SimulationRunnerClient detail={detail} initialRun={initialRun} />
    </div>
  );
}
