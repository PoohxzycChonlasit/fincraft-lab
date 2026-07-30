import { ShieldAlert, Info } from "lucide-react";

export function SimulationDisclaimerBanner() {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] p-4 text-xs space-y-2">
      <div className="flex items-center gap-2 text-foreground font-bold">
        <ShieldAlert className="h-4 w-4 text-[var(--brand-accent)] shrink-0" />
        <span>Education Only • Simulation Only • Not Financial Advice</span>
      </div>
      <div className="flex items-start gap-2 text-muted-foreground leading-relaxed">
        <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <p>
          Calculations are simplified educational estimates derived from your entered assumptions. Results do not use real-time market data and do not constitute financial recommendations or advice.
        </p>
      </div>
    </div>
  );
}
