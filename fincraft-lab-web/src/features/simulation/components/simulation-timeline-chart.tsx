import type { SimulationRunResult } from "../types/simulation.types";

type Point = { month: number; balance: number };

function generatePoints(result: SimulationRunResult): Point[] {
  const fund = parseFloat(result.input.emergencyFund) || 0;
  const expense = parseFloat(result.input.essentialMonthlyExpenses) || 1;
  const survival = parseFloat(result.result.survivalMonths) || 0;

  const points: Point[] = [{ month: 0, balance: fund }];
  const maxMonths = Math.min(Math.ceil(survival) + 1, 36);

  for (let m = 1; m <= maxMonths; m++) {
    const bal = Math.max(0, fund - m * expense);
    points.push({ month: m, balance: bal });
    if (bal === 0) break;
  }

  return points;
}

function SvgCurve({ points, width, height }: { points: Point[]; width: number; height: number }) {
  if (points.length === 0) return null;
  const maxB = points[0].balance || 1;
  const maxM = points[points.length - 1].month || 1;

  const coords = points.map((p) => {
    const x = (p.month / maxM) * (width - 64) + 44;
    const y = height - 32 - (p.balance / maxB) * (height - 56);
    return { x, y, p };
  });

  const pathD = coords.reduce((acc, c, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${c.x} ${c.y}`, "");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      className="w-full h-auto overflow-visible select-none"
      aria-labelledby="timeline-title timeline-desc"
    >
      <title id="timeline-title">Balance Depletion Curve</title>
      <desc id="timeline-desc">
        Line chart showing balance declining from ${points[0]?.balance ?? 0} at month 0 to $0 at month {points[points.length - 1]?.month ?? 0}.
      </desc>

      {/* Axis lines */}
      <line x1="44" y1={height - 32} x2={width - 20} y2={height - 32} stroke="var(--border-subtle)" strokeWidth="1" />
      <line x1="44" y1="20" x2="44" y2={height - 32} stroke="var(--border-subtle)" strokeWidth="1" />

      {/* Depletion path */}
      <path d={pathD} fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" />

      {/* Data points — only first and last to avoid clutter */}
      {[coords[0], coords[coords.length - 1]].filter(Boolean).map((c) => (
        <g key={c.p.month}>
          <circle cx={c.x} cy={c.y} r="5" fill="var(--surface-solid)" stroke="var(--accent-teal)" strokeWidth="2" />
          <text x={c.x} y={height - 14} textAnchor="middle" fill="currentColor" fontSize="10" className="font-mono">
            M{c.p.month}
          </text>
        </g>
      ))}

      {/* Intermediate month labels at quarter points */}
      {coords.filter((_, i) => i > 0 && i < coords.length - 1 && i % Math.max(1, Math.floor(coords.length / 4)) === 0).map((c) => (
        <text key={`label-${c.p.month}`} x={c.x} y={height - 14} textAnchor="middle" fill="currentColor" fontSize="10" className="font-mono opacity-60">
          M{c.p.month}
        </text>
      ))}
    </svg>
  );
}

export function SimulationTimelineChart({ result }: { result: SimulationRunResult }) {
  const points = generatePoints(result);
  const startBalance = parseFloat(result.input.emergencyFund) || 0;
  const monthlyBurn = parseFloat(result.input.essentialMonthlyExpenses) || 0;

  return (
    <section aria-label="Balance depletion timeline" className="surface-solid rounded-2xl border border-[var(--border-subtle)] p-4 sm:p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-caption font-bold uppercase tracking-wider text-muted-foreground">
          Balance Depletion Timeline
        </h3>
        <span className="font-caption font-bold text-[var(--accent-teal)]">
          {result.result.survivalMonths} mo. runway
        </span>
      </div>

      <SvgCurve points={points} width={520} height={180} />

      {/* Text summary adjacent to chart (accessibility + non-colour-only) */}
      <p className="font-body-small text-muted-foreground pt-1 border-t border-[var(--border-subtle)]">
        Starting at <strong className="text-foreground">${startBalance.toLocaleString()}</strong>, depleting at <strong className="text-foreground">${monthlyBurn.toLocaleString()}</strong>/month, the balance reaches zero after approximately <strong className="text-foreground">{result.result.survivalMonths} months</strong> with <strong className="text-foreground">${result.result.remainingAmount}</strong> remaining in the partial final month.
      </p>
    </section>
  );
}
