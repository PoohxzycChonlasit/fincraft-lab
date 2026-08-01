import { ShieldAlert, CheckCircle2, BookOpen, ExternalLink } from "lucide-react";
import type { SimulationDetail, SimulationRunResult } from "../types/simulation.types";
import { SimulationTimelineChart } from "./simulation-timeline-chart";
import { SimulationDisclaimerBanner } from "./simulation-disclaimer-banner";

function PrimaryResult({ result }: { result: SimulationRunResult }) {
  return (
    <section aria-label="Primary simulation result" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-5 sm:p-6 shadow-xs">
      <p className="font-caption text-muted-foreground mb-3">Estimated runway under these assumptions</p>

      <div className="flex flex-wrap items-end gap-4 sm:gap-6">
        <div>
          <div className="text-4xl sm:text-5xl font-extrabold text-[var(--accent-teal)] tabular-nums leading-none">
            {result.result.survivalMonths}
          </div>
          <div className="font-caption mt-1 text-foreground font-bold">months survival runway</div>
        </div>

        <div className="flex flex-col gap-1 text-xs">
          <div>
            <span className="text-muted-foreground">Whole months covered: </span>
            <span className="font-bold text-foreground">{result.result.wholeMonthsCovered}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Remaining partial fund: </span>
            <span className="font-bold text-foreground">${result.result.remainingAmount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Calculation: </span>
            <span className="font-bold text-foreground">v{result.calculationVersion}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Interpretation({ result }: { result: SimulationRunResult }) {
  return (
    <section aria-label="Educational interpretation" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-5 space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="h-4 w-4 text-[var(--accent-teal)] shrink-0" />
        <h3 className="font-section-title text-foreground">What This Result Means</h3>
      </div>
      <p className="font-body text-foreground">{result.result.statementEn}</p>
      {result.result.statementTh ? (
        <div className="space-y-1 border-t border-[var(--border-subtle)] pt-2">
          <p className="font-caption font-bold uppercase tracking-wider text-muted-foreground">Thai interpretation</p>
          <p className="font-body-small text-muted-foreground">{result.result.statementTh}</p>
        </div>
      ) : null}
    </section>
  );
}

function AssumptionsSnapshot({ result }: { result: SimulationRunResult }) {
  return (
    <section aria-label="Assumptions used in this run" className="surface-solid rounded-2xl border border-[var(--border-subtle)] p-4 space-y-2">
      <h3 className="font-caption font-bold uppercase tracking-wider text-muted-foreground">Assumptions Used in This Run</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between gap-2 border-b border-[var(--border-subtle)] pb-1">
          <span className="text-muted-foreground">Emergency Fund</span>
          <span className="font-bold text-foreground tabular-nums">${result.input.emergencyFund}</span>
        </div>
        <div className="flex justify-between gap-2 border-b border-[var(--border-subtle)] pb-1">
          <span className="text-muted-foreground">Monthly Expenses</span>
          <span className="font-bold text-foreground tabular-nums">${result.input.essentialMonthlyExpenses}</span>
        </div>
      </div>
      <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground mt-1">
        {result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
      </ul>
    </section>
  );
}

function ModelAssumptionsAndLimitations({ detail }: { detail: SimulationDetail }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <section aria-label="Model assumptions" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-4 space-y-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          <h3 className="font-section-title text-foreground">Model Assumptions</h3>
        </div>
        <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
          {detail.assumptions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </section>

      <section aria-label="Model limitations" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-4 space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-[var(--accent-orange)] shrink-0" />
          <h3 className="font-section-title text-foreground">Model Limitations</h3>
        </div>
        <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
          {detail.limitations.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </section>
    </div>
  );
}

function Sources({ sources }: { sources: SimulationRunResult["sources"] }) {
  return (
    <section aria-label="Simulation sources" className="surface-paper rounded-2xl border border-[var(--border-subtle)] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-[var(--accent-teal)] shrink-0" />
        <h3 className="font-section-title text-foreground">Sources</h3>
      </div>
      <ul className="space-y-3 text-xs text-muted-foreground">
        {sources.map((source) => (
          <li key={source.url} className="space-y-1 border-t border-[var(--border-subtle)] pt-2 first:border-t-0 first:pt-0">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1 font-bold text-foreground underline decoration-[var(--accent-teal)] underline-offset-2 break-words hover:text-[var(--accent-teal)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
            >
              <span>{source.title}</span>
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            </a>
            <p>Publisher: {source.publisher}</p>
            <p>Accessed: {source.accessedAt}</p>
            <p className="break-all text-[11px]">{source.url}</p>
          </li>
        ))}
      </ul>
    </section>
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
    <div className="space-y-5" aria-live="polite" aria-atomic="true">
      <PrimaryResult result={runResult} />
      <SimulationTimelineChart result={runResult} />
      <Interpretation result={runResult} />
      <AssumptionsSnapshot result={runResult} />
      <ModelAssumptionsAndLimitations detail={detail} />
      {runResult.sources.length > 0 ? <Sources sources={runResult.sources} /> : null}
      <SimulationDisclaimerBanner />
    </div>
  );
}
