"use client";

import { useState, useTransition, type FormEvent } from "react";
import { RefreshCw, Play, RotateCcw } from "lucide-react";
import type { SimulationRunResult } from "../types/simulation.types";

type FieldErrors = { emergencyFund?: string; essentialExpenses?: string };

const INPUT_CLASS = (error?: string) =>
  `w-full min-h-[44px] rounded-xl border px-3.5 py-2.5 text-xs font-medium text-foreground bg-[var(--surface-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] transition-colors disabled:opacity-50 ${
    error ? "border-destructive" : "border-[var(--border-subtle)] focus-visible:border-[var(--accent-teal)]"
  }`;

function FundField({ value, onChange, error, disabled }: { value: string; onChange: (v: string) => void; error?: string; disabled: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="emergencyFund" className="block text-xs font-bold text-foreground">
        Emergency Fund Reserve <span aria-hidden="true" className="text-destructive">*</span>
        <span className="ml-1.5 font-normal text-muted-foreground">(in dollars / your currency unit)</span>
      </label>
      <input id="emergencyFund" type="number" inputMode="decimal" step="0.01" min="0" max="100000000" required
        value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. 25000"
        disabled={disabled} aria-describedby={error ? "fund-error" : "fund-hint"} aria-invalid={!!error}
        className={INPUT_CLASS(error)}
      />
      {error ? (
        <p id="fund-error" className="text-[11px] font-medium text-destructive">{error}</p>
      ) : (
        <p id="fund-hint" className="text-[11px] text-muted-foreground">Total liquid savings available for emergency use. Range: $0 – $100,000,000.</p>
      )}
    </div>
  );
}

function ExpenseField({ value, onChange, error, disabled }: { value: string; onChange: (v: string) => void; error?: string; disabled: boolean }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="essentialExpenses" className="block text-xs font-bold text-foreground">
        Essential Monthly Expenses <span aria-hidden="true" className="text-destructive">*</span>
        <span className="ml-1.5 font-normal text-muted-foreground">(per month, same currency)</span>
      </label>
      <input id="essentialExpenses" type="number" inputMode="decimal" step="0.01" min="0.01" max="100000000" required
        value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. 10000"
        disabled={disabled} aria-describedby={error ? "exp-error" : "exp-hint"} aria-invalid={!!error}
        className={INPUT_CLASS(error)}
      />
      {error ? (
        <p id="exp-error" className="text-[11px] font-medium text-destructive">{error}</p>
      ) : (
        <p id="exp-hint" className="text-[11px] text-muted-foreground">Required monthly costs: rent, food, utilities, debt payments only. Must be greater than zero.</p>
      )}
    </div>
  );
}

function FormActions({ isPending, onReset }: { isPending: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
      <button type="button" onClick={onReset} disabled={isPending}
        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-paper)] px-4 text-xs font-bold text-foreground hover:bg-[var(--surface-solid)] transition-colors disabled:opacity-50">
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Reset</span>
      </button>
      <button type="submit" disabled={isPending}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-6 text-xs font-bold text-white shadow-xs hover:bg-[var(--accent-teal-strong)] transition-colors disabled:opacity-50">
        {isPending ? (
          <><RefreshCw className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /><span>Calculating...</span></>
        ) : (
          <><Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" /><span>Run Simulation</span></>
        )}
      </button>
    </div>
  );
}

export function SimulationForm({ simulationId, onRunSuccess, onError }: {
  simulationId: string;
  onRunSuccess: (run: SimulationRunResult) => void;
  onError: (err: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [emergencyFund, setEmergencyFund] = useState("25000");
  const [essentialExpenses, setEssentialExpenses] = useState("10000");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleReset = () => { setEmergencyFund("25000"); setEssentialExpenses("10000"); setFieldErrors({}); };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fund = parseFloat(emergencyFund);
    const exp = parseFloat(essentialExpenses);
    const errors: FieldErrors = {};
    if (isNaN(fund) || fund < 0) errors.emergencyFund = "Enter a valid non-negative amount.";
    if (isNaN(exp) || exp <= 0) errors.essentialExpenses = "Enter a valid positive monthly expense amount.";
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); onError("Please fix the field errors."); return; }
    setFieldErrors({});
    startTransition(async () => {
      try {
        const res = await fetch(`/api/simulations/${simulationId}/runs`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emergencyFund: fund, essentialMonthlyExpenses: exp }),
        });
        const data = await res.json();
        if (!res.ok) { onError(data.error || "Simulation run failed."); return; }
        onRunSuccess(data.data);
      } catch { onError("Network error executing simulation."); }
    });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Simulation assumptions"
      className="surface-solid rounded-2xl border border-[var(--border-subtle)] p-5 shadow-sm space-y-5">
      <div className="space-y-1">
        <h3 className="font-section-title text-foreground">Set Your Assumptions</h3>
        <p className="font-body-small text-muted-foreground">Enter values to test. The model calculates your estimated emergency runway based solely on these numbers.</p>
      </div>
      <FundField value={emergencyFund} onChange={setEmergencyFund} error={fieldErrors.emergencyFund} disabled={isPending} />
      <ExpenseField value={essentialExpenses} onChange={setEssentialExpenses} error={fieldErrors.essentialExpenses} disabled={isPending} />
      <FormActions isPending={isPending} onReset={handleReset} />
    </form>
  );
}
