import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, BookOpen, FlaskConical } from "lucide-react";
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
  const persistedRunError = runId && !initialRun
    ? "The saved run could not be loaded. You can enter assumptions and run a new simulation."
    : null;

  return (
    <div className="simulation-page-frame mx-auto w-full max-w-6xl space-y-7">
      <Link
        href="/simulations"
        className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All financial experiments
      </Link>

      <header className="grid gap-5 border-b border-(--border-subtle) pb-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="space-y-3">
          <p className="font-label text-(--accent-teal)">Emergency Fund Runway · financial consequence instrument</p>
          <h1 className="font-page-title text-foreground sm:text-4xl">{detail.name}</h1>
          <p className="font-caption">{detail.thaiName}</p>
          <p className="font-body max-w-3xl leading-relaxed text-muted-foreground">{detail.description}</p>
        </div>
        <div className="inline-flex items-center gap-2 justify-self-start rounded-xl border border-(--border-subtle) bg-(--surface-inset) px-3 py-2 text-xs font-bold text-foreground lg:justify-self-end">
          <FlaskConical className="size-4 text-(--accent-teal)" aria-hidden="true" />
          <span>Model {detail.calculationVersion}</span>
        </div>
      </header>

      <section className="surface-paper flex gap-3 rounded-2xl p-5 sm:p-6" aria-labelledby="experiment-explanation-title">
        <BookOpen className="mt-0.5 size-5 shrink-0 text-(--accent-teal)" aria-hidden="true" />
        <div className="space-y-2">
          <p className="font-label text-muted-foreground">Understand the experiment</p>
          <h2 id="experiment-explanation-title" className="font-section-title text-foreground">What this model compares</h2>
          <p className="font-body leading-relaxed text-muted-foreground">{detail.summary}</p>
          <p className="font-body-small leading-relaxed text-foreground">
            <span className="font-bold">Model logic:</span>{" "}
            <code className="break-words rounded bg-(--surface-inset) px-1.5 py-0.5 font-mono text-[0.7rem]">{detail.formulaExplanation}</code>
          </p>
        </div>
      </section>

      <SimulationDisclaimerBanner />

      <SimulationRunnerClient
        detail={detail}
        initialRun={initialRun}
        persistedRunError={persistedRunError}
      />
    </div>
  );
}
