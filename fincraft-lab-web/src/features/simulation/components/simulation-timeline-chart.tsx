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
    const x = (p.month / maxM) * (width - 60) + 40;
    const y = height - 30 - (p.balance / maxB) * (height - 50);
    return { x, y, p };
  });

  const pathD = coords.reduce((acc, c, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${c.x} ${c.y}`, "");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none" aria-label="Balance Depletion Curve over Time">
      <line x1="40" y1={height - 30} x2={width - 20} y2={height - 30} stroke="var(--border-subtle)" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2={height - 30} stroke="var(--border-subtle)" strokeWidth="1" />

      <path d={pathD} fill="none" stroke="var(--brand-accent)" strokeWidth="2.5" strokeLinecap="round" />

      {coords.map((c) => (
        <g key={c.p.month}>
          <circle cx={c.x} cy={c.y} r="4" fill="var(--surface-resting)" stroke="var(--brand-accent)" strokeWidth="2" />
          <text x={c.x} y={height - 12} textAnchor="middle" fill="currentColor" fontSize="10" className="text-muted-foreground font-mono">
            M{c.p.month}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function SimulationTimelineChart({ result }: { result: SimulationRunResult }) {
  const points = generatePoints(result);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Balance Depletion Timeline
        </h4>
        <span className="text-xs font-medium text-foreground">
          {result.result.survivalMonths} Months Runway
        </span>
      </div>

      <SvgCurve points={points} width={500} height={180} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-2 border-t border-[var(--border-subtle)]">
        <div>Initial Fund: <span className="font-semibold text-foreground">${result.input.emergencyFund}</span></div>
        <div>Monthly Burn: <span className="font-semibold text-foreground">${result.input.essentialMonthlyExpenses}</span></div>
        <div>Ending Balance: <span className="font-semibold text-foreground">${result.result.remainingAmount}</span></div>
      </div>
    </div>
  );
}
