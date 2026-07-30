"use client";

import { useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { SimulationDetail, SimulationRunResult } from "../types/simulation.types";
import { SimulationForm } from "./simulation-form";
import { SimulationResultView } from "./simulation-result";

function ErrorBanner({ error }: { error: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs text-destructive">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{error}</span>
    </div>
  );
}

export function SimulationRunnerClient({
  detail,
  initialRun,
}: {
  detail: SimulationDetail;
  initialRun: SimulationRunResult | null;
}) {
  const [runResult, setRunResult] = useState<SimulationRunResult | null>(initialRun);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunSuccess = (run: SimulationRunResult) => {
    setRunResult(run);
    setErrorMsg(null);
  };

  const handleResetRun = () => {
    setRunResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {errorMsg ? <ErrorBanner error={errorMsg} /> : null}

      {!runResult ? (
        <SimulationForm
          simulationId={detail.id}
          onRunSuccess={handleRunSuccess}
          onError={setErrorMsg}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground">Active Run Result</span>
            <button
              type="button"
              onClick={handleResetRun}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Run Again</span>
            </button>
          </div>

          <SimulationResultView detail={detail} runResult={runResult} />
        </div>
      )}
    </div>
  );
}
