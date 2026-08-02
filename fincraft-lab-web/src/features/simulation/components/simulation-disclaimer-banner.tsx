import { ShieldAlert } from "lucide-react";

export function SimulationDisclaimerBanner() {
  return (
    <div
      role="note"
      className="surface-solid rounded-2xl border border-(--border-strong) p-4 space-y-2"
    >
      <div className="flex items-center gap-2 font-bold text-sm text-foreground">
        <ShieldAlert className="h-4 w-4 text-(--accent-orange) shrink-0" />
        <span>Education Only · Simulation Only · Not Financial Advice</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed pl-6">
        All calculations are simplified educational estimates based on your entered assumptions. Results do not use real-time market data, do not reflect your actual financial situation, and are not predictions or recommendations. Real outcomes can differ significantly. This tool is for learning, not financial planning.
      </p>
    </div>
  );
}
