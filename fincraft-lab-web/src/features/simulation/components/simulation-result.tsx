import { BookOpen, CheckCircle2, ExternalLink, ShieldAlert } from "lucide-react";
import type { SimulationRunResult } from "../types/simulation.types";
import { SimulationDisclaimerBanner } from "./simulation-disclaimer-banner";
import { SimulationTimelineChart } from "./simulation-timeline-chart";

function formatAmount(value: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function PrimaryResult({ result }: { result: SimulationRunResult }) {
  return (
    <section className="surface-paper space-y-5 rounded-2xl p-5 sm:p-6" aria-labelledby="primary-result-title">
      <div className="space-y-1">
        <p className="font-label text-(--accent-teal)">Backend result</p>
        <h3 id="primary-result-title" className="font-section-title text-foreground">Estimated runway under these assumptions</h3>
        <p className="font-caption">Primary result from the saved {result.calculationVersion} calculation.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:items-end">
        <output className="block" aria-label={`${result.result.survivalMonths} months estimated runway`}>
          <span className="block text-5xl font-extrabold leading-none tracking-tight text-(--accent-teal) tabular-nums sm:text-6xl">{result.result.survivalMonths}</span>
          <span className="mt-2 block text-sm font-bold text-foreground">months estimated runway</span>
        </output>

        <dl className="grid gap-3 border-t border-(--border-subtle) pt-4 text-sm sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Whole months covered</dt>
            <dd className="font-bold text-foreground tabular-nums">{result.result.wholeMonthsCovered}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Remaining amount</dt>
            <dd className="font-bold text-foreground tabular-nums">{formatAmount(result.result.remainingAmount)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-muted-foreground">Run snapshot</dt>
            <dd className="font-mono text-xs font-bold text-foreground">{result.createdAt.slice(0, 10)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function Interpretation({ result }: { result: SimulationRunResult }) {
  return (
    <section className="surface-paper space-y-4 rounded-2xl p-5 sm:p-6" aria-labelledby="interpretation-title">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 size-5 shrink-0 text-(--accent-teal)" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-label text-muted-foreground">Interpretation</p>
          <h3 id="interpretation-title" className="font-section-title text-foreground">Read the estimate in context</h3>
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-label text-muted-foreground">English interpretation</p>
        <p className="font-body leading-relaxed text-foreground">{result.result.statementEn}</p>
      </div>
      {result.result.statementTh ? (
        <div className="space-y-2 border-t border-(--border-subtle) pt-4">
          <p className="font-label text-muted-foreground">Thai interpretation</p>
          <p className="font-body leading-relaxed text-muted-foreground">{result.result.statementTh}</p>
        </div>
      ) : null}
    </section>
  );
}

function RunAssumptions({ result }: { result: SimulationRunResult }) {
  return (
    <section className="surface-solid space-y-4 rounded-2xl p-5" aria-labelledby="run-assumptions-title">
      <div className="space-y-1">
        <p className="font-label text-muted-foreground">Saved with this run</p>
        <h3 id="run-assumptions-title" className="font-section-title text-foreground">Assumptions used</h3>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="border-b border-(--border-subtle) pb-3">
          <dt className="text-muted-foreground">Emergency fund reserve</dt>
          <dd className="mt-1 font-bold text-foreground tabular-nums">{formatAmount(result.input.emergencyFund)}</dd>
        </div>
        <div className="border-b border-(--border-subtle) pb-3">
          <dt className="text-muted-foreground">Essential monthly expenses</dt>
          <dd className="mt-1 font-bold text-foreground tabular-nums">{formatAmount(result.input.essentialMonthlyExpenses)}</dd>
        </div>
      </dl>
    </section>
  );
}

function ModelAssumptionsAndLimitations({ result }: { result: SimulationRunResult }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="surface-paper space-y-4 rounded-2xl p-5" aria-labelledby="model-assumptions-title">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-(--accent-teal)" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-label text-muted-foreground">How to read it</p>
            <h3 id="model-assumptions-title" className="font-section-title text-foreground">Model assumptions</h3>
          </div>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {result.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
        </ul>
      </section>

      <section className="surface-paper space-y-4 rounded-2xl p-5" aria-labelledby="model-limitations-title">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-(--accent-orange)" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-label text-muted-foreground">Important boundaries</p>
            <h3 id="model-limitations-title" className="font-section-title text-foreground">Limitations</h3>
          </div>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
          {result.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
        </ul>
      </section>
    </div>
  );
}

function Sources({ sources }: { sources: SimulationRunResult["sources"] }) {
  return (
    <section className="surface-paper space-y-4 rounded-2xl p-5" aria-labelledby="simulation-sources-title">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 size-5 shrink-0 text-(--accent-teal)" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-label text-muted-foreground">Reference trail</p>
          <h3 id="simulation-sources-title" className="font-section-title text-foreground">Sources</h3>
        </div>
      </div>
      {sources.length > 0 ? (
        <ul className="space-y-4 text-sm text-muted-foreground">
          {sources.map((source) => (
            <li key={source.url} className="space-y-1.5 border-t border-(--border-subtle) pt-4 first:border-t-0 first:pt-0">
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-start gap-1.5 font-bold leading-relaxed text-foreground underline decoration-(--accent-teal) underline-offset-2 transition-colors hover:text-(--accent-teal) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2">
                <span className="break-words">{source.title}</span>
                <ExternalLink className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
              </a>
              <p>Publisher: {source.publisher}</p>
              <p>Accessed: {source.accessedAt}</p>
              <p className="break-all font-mono text-xs">{source.url}</p>
            </li>
          ))}
        </ul>
      ) : <p className="font-body-small text-muted-foreground">No source metadata was provided for this saved run.</p>}
    </section>
  );
}

export function SimulationResultView({ runResult }: { runResult: SimulationRunResult }) {
  return (
    <div className="space-y-5" aria-live="polite" aria-atomic="false">
      <PrimaryResult result={runResult} />
      <SimulationTimelineChart result={runResult} />
      <Interpretation result={runResult} />
      <SimulationDisclaimerBanner />
      <RunAssumptions result={runResult} />
      <ModelAssumptionsAndLimitations result={runResult} />
      <Sources sources={runResult.sources} />
    </div>
  );
}
