"use client";

import { useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { SimulationDetail, SimulationRunResult } from "../types/simulation.types";
import { SimulationForm, type SimulationFormValues } from "./simulation-form";
import { SimulationResultView } from "./simulation-result";

function inputValuesFromRun(run: SimulationRunResult | null): SimulationFormValues {
  return {
    emergencyFund: run?.input.emergencyFund ?? "25000",
    essentialMonthlyExpenses: run?.input.essentialMonthlyExpenses ?? "10000",
  };
}

function ErrorBanner({ error }: { error: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{error}</span>
    </div>
  );
}

function WaitingForResult() {
  return (
    <aside className="surface-inset rounded-2xl p-5 sm:p-6" aria-labelledby="result-waiting-title">
      <p className="font-label text-[var(--accent-teal)]">Step 2 · Read the result</p>
      <h2 id="result-waiting-title" className="mt-2 font-section-title text-foreground">Your estimate will appear here</h2>
      <p className="font-body mt-2 leading-relaxed text-muted-foreground">
        Run the experiment after entering both assumptions. The backend calculation remains the authority for the primary result.
      </p>
    </aside>
  );
}

function replaceRunUrl(runId?: string) {
  const path = window.location.pathname;
  const url = runId ? `${path}?runId=${encodeURIComponent(runId)}` : path;
  window.history.replaceState(null, "", url);
}

function AssumptionsSection({ detail, initialValues, onRunStart, onRunSuccess, onReset, onError }: {
  detail: SimulationDetail;
  initialValues: SimulationFormValues;
  onRunStart: () => void;
  onRunSuccess: (run: SimulationRunResult) => void;
  onReset: () => void;
  onError: (message: string) => void;
}) {
  return (
    <section id="simulation-assumptions" className="space-y-3" aria-labelledby="simulation-assumptions-title">
      <div>
        <p className="font-label text-[var(--accent-teal)]">Step 1 · Enter assumptions</p>
        <h2 id="simulation-assumptions-title" className="sr-only">Enter assumptions</h2>
      </div>
      <SimulationForm simulationId={detail.id} initialValues={initialValues} onRunStart={onRunStart} onRunSuccess={onRunSuccess} onReset={onReset} onError={onError} />
    </section>
  );
}

function ResultSection({ result, onRunAgain }: { result: SimulationRunResult; onRunAgain: () => void }) {
  return (
    <section className="space-y-3" aria-labelledby="simulation-result-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-label text-[var(--accent-teal)]">Step 2 · Primary result</p>
          <h2 id="simulation-result-title" className="sr-only">Primary simulation result</h2>
        </div>
        <button type="button" onClick={onRunAgain} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-solid)] px-3.5 text-xs font-bold text-foreground transition-colors hover:bg-[var(--surface-inset)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2">
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Run Again
        </button>
      </div>
      <SimulationResultView runResult={result} />
    </section>
  );
}

export function SimulationRunnerClient({
  detail,
  initialRun,
  persistedRunError,
}: {
  detail: SimulationDetail;
  initialRun: SimulationRunResult | null;
  persistedRunError?: string | null;
}) {
  const [runResult, setRunResult] = useState<SimulationRunResult | null>(initialRun);
  const [errorMsg, setErrorMsg] = useState<string | null>(persistedRunError ?? null);
  const [initialValues] = useState<SimulationFormValues>(() => inputValuesFromRun(initialRun));

  const handleRunStart = () => {
    setRunResult(null);
    setErrorMsg(null);
  };

  const handleRunSuccess = (run: SimulationRunResult) => {
    setRunResult(run);
    setErrorMsg(null);
    replaceRunUrl(run.runId);
  };

  const handleReset = () => {
    setRunResult(null);
    setErrorMsg(null);
    replaceRunUrl();
  };

  const handleRunAgain = () => {
    setRunResult(null);
    setErrorMsg(null);
    replaceRunUrl();
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    requestAnimationFrame(() => document.getElementById("simulation-assumptions")?.scrollIntoView({ behavior, block: "start" }));
  };

  return (
    <div className="space-y-5" aria-label="Simulation runner">
      {errorMsg ? <ErrorBanner error={errorMsg} /> : null}

      <div className={runResult ? "grid items-start gap-8 lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.35fr)]" : "space-y-5"}>
        <AssumptionsSection detail={detail} initialValues={initialValues} onRunStart={handleRunStart} onRunSuccess={handleRunSuccess} onReset={handleReset} onError={(message) => setErrorMsg(message || null)} />
        {runResult ? <ResultSection result={runResult} onRunAgain={handleRunAgain} /> : <WaitingForResult />}
      </div>
    </div>
  );
}
