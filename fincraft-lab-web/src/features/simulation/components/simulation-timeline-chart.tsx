import type { SimulationRunResult } from "../types/simulation.types";

type Point = { month: number; balance: number };

function formatAmount(value: number | string) {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}

function generatePresentationPoints(result: SimulationRunResult): Point[] {
  const fund = Number(result.input.emergencyFund) || 0;
  const survival = Number(result.result.survivalMonths) || 0;
  const wholeMonths = Math.max(0, result.result.wholeMonthsCovered);
  const remaining = Number(result.result.remainingAmount) || 0;
  const points: Point[] = [{ month: 0, balance: fund }];

  if (wholeMonths > 0) points.push({ month: wholeMonths, balance: remaining });
  if (survival > wholeMonths) points.push({ month: survival, balance: 0 });
  return points;
}

function SvgCurve({ points }: { points: Point[] }) {
  const width = 760;
  const height = 260;
  const left = 36;
  const right = 24;
  const top = 24;
  const bottom = 28;
  const maxBalance = Math.max(...points.map((point) => point.balance), 1);
  const maxMonth = Math.max(points[points.length - 1]?.month ?? 0, 1);
  const coordinates = points.map((point) => ({
    x: left + (point.month / maxMonth) * (width - left - right),
    y: height - bottom - (point.balance / maxBalance) * (height - top - bottom),
    point,
  }));
  const path = coordinates.map((coordinate, index) => `${index === 0 ? "M" : "L"} ${coordinate.x} ${coordinate.y}`).join(" ");

  return (
    <svg className="block h-auto w-full overflow-visible text-(--accent-teal)" viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="simulation-timeline-title simulation-timeline-description">
      <title id="simulation-timeline-title">Illustrative balance timeline</title>
      <desc id="simulation-timeline-description">An illustrative path from the starting balance through the stored whole-month result to the estimated runway endpoint. The backend result remains authoritative.</desc>
      <line x1={left} y1={height - bottom} x2={width - right} y2={height - bottom} stroke="var(--border-subtle)" strokeWidth="1" />
      <line x1={left} y1={top} x2={left} y2={height - bottom} stroke="var(--border-subtle)" strokeWidth="1" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {coordinates.map((coordinate) => (
        <circle key={`${coordinate.point.month}-${coordinate.point.balance}`} cx={coordinate.x} cy={coordinate.y} r="7" fill="var(--surface-paper)" stroke="currentColor" strokeWidth="3" />
      ))}
    </svg>
  );
}

export function SimulationTimelineChart({ result }: { result: SimulationRunResult }) {
  const points = generatePresentationPoints(result);
  const startBalance = Number(result.input.emergencyFund) || 0;
  const endingBalance = points[points.length - 1]?.balance ?? 0;
  const survivalMonths = result.result.survivalMonths;
  const wholeMonths = result.result.wholeMonthsCovered;

  return (
    <section className="surface-solid space-y-5 rounded-2xl p-5 sm:p-6" aria-labelledby="timeline-heading">
      <div className="space-y-1">
        <p className="font-label text-(--accent-teal)">Step 3 · Inspect the illustrative timeline</p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="timeline-heading" className="font-section-title text-foreground">Balance path over time</h3>
          <span className="font-caption font-bold">Illustrative only · {survivalMonths} months</span>
        </div>
      </div>

      <SvgCurve points={points} />

      <ol className="grid gap-3 border-t border-(--border-subtle) pt-4 sm:grid-cols-3">
        <li className="space-y-1">
          <p className="font-label text-muted-foreground">Starting balance</p>
          <p className="text-sm font-bold text-foreground tabular-nums">{formatAmount(startBalance)}</p>
          <p className="font-caption">Month 0</p>
        </li>
        <li className="space-y-1">
          <p className="font-label text-muted-foreground">Whole months covered</p>
          <p className="text-sm font-bold text-foreground tabular-nums">{wholeMonths} months · {formatAmount(result.result.remainingAmount)} remaining</p>
          <p className="font-caption">Stored backend output</p>
        </li>
        <li className="space-y-1">
          <p className="font-label text-muted-foreground">Estimated runway</p>
          <p className="text-sm font-bold text-foreground tabular-nums">{survivalMonths} months</p>
          <p className="font-caption">Ending presentation balance: {formatAmount(endingBalance)}</p>
        </li>
      </ol>

      <p className="border-t border-(--border-subtle) pt-4 font-body-small leading-relaxed text-muted-foreground">
        This chart interpolates a presentation path from the stored inputs and outputs. It does not independently calculate or replace the primary result above.
      </p>
    </section>
  );
}
