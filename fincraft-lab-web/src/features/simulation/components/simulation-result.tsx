import { Clock, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";
import type { SimulationDetail, SimulationRunResult } from "../types/simulation.types";
import { SimulationTimelineChart } from "./simulation-timeline-chart";

function PrimaryMetrics({ result }: { result: SimulationRunResult }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="rounded-2xl border border-[var(--brand-accent)] bg-[var(--surface-inset)] p-4 text-center">
        <div className="text-2xl sm:text-3xl font-extrabold text-[var(--brand-accent)]">{result.result.survivalMonths}</div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mt-1">Survival Months</div>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] p-4 text-center">
        <div className="text-2xl font-bold text-foreground">{result.result.wholeMonthsCovered} Full Months</div>
        <div className="text-[11px] text-muted-foreground mt-1">Whole Months Covered</div>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] p-4 text-center">
        <div className="text-2xl font-bold text-foreground">${result.result.remainingAmount}</div>
        <div className="text-[11px] text-muted-foreground mt-1">Remaining Partial Fund</div>
      </div>
    </div>
  );
}

function Interpretations({ result }: { result: SimulationRunResult }) {
  return (
    <div className="space-y-2 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-4 text-xs">
      <div className="flex items-center gap-2 font-bold text-foreground">
        <Sparkles className="h-4 w-4 text-[var(--brand-accent)] shrink-0" />
        <span>Educational Interpretation</span>
      </div>
      <p className="text-foreground font-medium">{result.result.statementEn}</p>
      <p className="text-muted-foreground">{result.result.statementTh}</p>
    </div>
  );
}

function TradeOffsAndLimitations({ detail }: { detail: SimulationDetail }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] p-4 space-y-2">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Assumptions & Trade-offs</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          {detail.assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] p-4 space-y-2">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
          <span>Model Limitations & Risks</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          {detail.limitations.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function SimulationResultView({
  detail,
  runResult,
}: {
  detail: SimulationDetail;
  runResult: SimulationRunResult;
}) {
  return (
    <div className="space-y-6">
      <div className="surface-card rounded-2xl border border-[var(--border-subtle)] p-5 sm:p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Simulation Run Result
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Run ID: {runResult.runId.slice(0, 8)}...</span>
          </div>
        </div>

        <PrimaryMetrics result={runResult} />
        <Interpretations result={runResult} />
        <SimulationTimelineChart result={runResult} />
        <TradeOffsAndLimitations detail={detail} />
      </div>
    </div>
  );
}
