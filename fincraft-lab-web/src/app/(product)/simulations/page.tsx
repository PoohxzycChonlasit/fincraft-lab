import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, ArrowRight, RefreshCw } from "lucide-react";
import { Suspense } from "react";
import { getSessionUser } from "@/lib/auth/session";
import { getSimulations } from "@/features/simulation/api/get-simulations";
import { SimulationDisclaimerBanner } from "@/features/simulation/components/simulation-disclaimer-banner";
import type { SimulationSummary } from "@/features/simulation/types/simulation.types";

export const metadata: Metadata = {
  title: "Financial Simulations | FinCraft Lab",
  description: "Test financial assumptions with interactive educational decision models.",
};

function SimulationRecord({ simulation }: { simulation: SimulationSummary }) {
  return (
    <article className="surface-paper grid gap-6 rounded-2xl p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-(--accent-teal)">
            <Activity className="size-4" aria-hidden="true" />
            Active simulation
          </span>
          <span className="font-caption border-l border-(--border-subtle) pl-4">
            Model: {simulation.name}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className="font-section-title text-foreground sm:text-2xl">
            Emergency Fund Runway
          </h2>
          <p className="font-body max-w-2xl leading-relaxed text-muted-foreground">
            {simulation.summary}
          </p>
        </div>

        <dl className="grid gap-3 border-t border-(--border-subtle) pt-4 text-xs sm:grid-cols-2">
          <div>
            <dt className="font-label text-muted-foreground">Purpose</dt>
            <dd className="mt-1 font-medium text-foreground">
              See how one reserve compares with one monthly essential-cost assumption.
            </dd>
          </div>
          <div>
            <dt className="font-label text-muted-foreground">Type</dt>
            <dd className="mt-1 font-medium text-foreground">{simulation.name}</dd>
          </div>
        </dl>
      </div>

      <Link
        href={`/simulations/${simulation.id}`}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--brand-primary) px-5 py-3 text-xs font-bold text-(--brand-primary-foreground) shadow-xs transition-colors hover:bg-(--accent-teal-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2 lg:min-w-52"
        aria-label="Open Emergency Fund Runway simulation"
      >
        <span>Open Simulation</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </article>
  );
}

function EmptyState() {
  return (
    <section className="surface-paper rounded-2xl p-8 sm:p-10" aria-labelledby="simulation-empty-title">
      <div className="max-w-xl space-y-2">
        <p className="font-label text-(--accent-orange)">No active experiments</p>
        <h2 id="simulation-empty-title" className="font-section-title text-foreground">
          There are no published simulations right now.
        </h2>
        <p className="font-body leading-relaxed text-muted-foreground">
          This state means the active simulation list is empty. It is different from a loading or connection error.
        </p>
      </div>
    </section>
  );
}

function ErrorState() {
  return (
    <section className="rounded-2xl border border-destructive/35 bg-destructive/10 p-6" role="alert" aria-labelledby="simulation-list-error-title">
      <div className="flex items-start gap-3">
        <RefreshCw className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
        <div className="space-y-3">
          <div className="space-y-1">
            <h2 id="simulation-list-error-title" className="font-card-title text-foreground">
              Simulations could not be loaded.
            </h2>
            <p className="font-body-small leading-relaxed text-muted-foreground">
              The list request failed, so it is not being shown as an empty result.
            </p>
          </div>
          <Link
            href="/simulations"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-solid) px-4 text-xs font-bold text-foreground transition-colors hover:bg-(--surface-inset) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Try again
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <section className="surface-paper space-y-5 rounded-2xl p-5 sm:p-7" role="status" aria-label="Loading simulations">
      <div className="h-3 w-36 animate-pulse rounded bg-(--surface-inset)" />
      <div className="space-y-3">
        <div className="h-7 w-2/3 animate-pulse rounded bg-(--surface-inset)" />
        <div className="h-4 w-full animate-pulse rounded bg-(--surface-inset)" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-(--surface-inset)" />
      </div>
      <span className="sr-only">Loading active simulations.</span>
    </section>
  );
}

async function loadSimulationRecords() {
  try {
    return await getSimulations();
  } catch {
    return null;
  }
}

async function SimulationRecords() {
  const simulations = await loadSimulationRecords();
  if (simulations === null) return <ErrorState />;

  const activeSimulations = simulations.filter((simulation) => simulation.isActive);
  if (activeSimulations.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {activeSimulations.map((simulation) => (
        <SimulationRecord key={simulation.id} simulation={simulation} />
      ))}
    </div>
  );
}

export default async function SimulationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?returnTo=/simulations");

  return (
    <div className="simulation-page-frame mx-auto w-full max-w-5xl space-y-7">
      <header className="space-y-3 border-b border-(--border-subtle) pb-5">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-(--accent-teal)">
          <Activity className="size-4" aria-hidden="true" />
          Financial consequence instrument
        </div>
        <h1 className="font-page-title text-foreground sm:text-3xl">Financial Simulations</h1>
        <p className="font-body max-w-3xl leading-relaxed text-muted-foreground">
          Start with one experiment, enter two assumptions, and read the estimated consequence in plain language. Results are estimates, not predictions or advice.
        </p>
      </header>

      <SimulationDisclaimerBanner />

      <section className="space-y-3" aria-labelledby="available-simulations-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="font-label text-muted-foreground">Available now</p>
            <h2 id="available-simulations-title" className="font-section-title text-foreground">
              Choose an experiment
            </h2>
          </div>
          <p className="font-caption">Only active models are listed.</p>
        </div>
        <Suspense fallback={<LoadingState />}>
          <SimulationRecords />
        </Suspense>
      </section>
    </div>
  );
}
