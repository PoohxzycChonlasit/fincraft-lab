"use client";

import { useState, useTransition, type FormEvent } from "react";
import { RefreshCw, Play, RotateCcw } from "lucide-react";
import type { SimulationRunResult } from "../types/simulation.types";

function FundInputField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="emergencyFund" className="block text-xs font-semibold text-foreground">
        Emergency Fund Reserve ($) <span className="text-destructive">*</span>
      </label>
      <input
        id="emergencyFund"
        type="number"
        step="0.01"
        min="0"
        max="100000000"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 25000"
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      />
      <p className="text-[11px] text-muted-foreground">Total liquid cash available for emergency use.</p>
    </div>
  );
}

function ExpenseInputField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="essentialExpenses" className="block text-xs font-semibold text-foreground">
        Essential Monthly Expenses ($) <span className="text-destructive">*</span>
      </label>
      <input
        id="essentialExpenses"
        type="number"
        step="0.01"
        min="0.01"
        max="100000000"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. 10000"
        className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-flat)] px-3.5 py-2.5 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:border-[var(--brand-accent)]"
      />
      <p className="text-[11px] text-muted-foreground">Mandatory monthly living costs (housing, food, utilities, debt payments).</p>
    </div>
  );
}

function FormControls({ isPending, onReset }: { isPending: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onReset}
        disabled={isPending}
        className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-inset)] px-4 text-xs font-semibold text-foreground hover:bg-[var(--surface-raised)] transition-colors disabled:opacity-50"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset</span>
      </button>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-[var(--color-action-primary)] px-5 text-xs font-semibold text-white shadow-xs hover:bg-[var(--color-action-hover)] transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <>
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span>Calculating...</span>
          </>
        ) : (
          <>
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Simulation</span>
          </>
        )}
      </button>
    </div>
  );
}

export function SimulationForm({
  simulationId,
  onRunSuccess,
  onError,
}: {
  simulationId: string;
  onRunSuccess: (run: SimulationRunResult) => void;
  onError: (err: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [emergencyFund, setEmergencyFund] = useState("25000");
  const [essentialExpenses, setEssentialExpenses] = useState("10000");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const fund = parseFloat(emergencyFund);
    const exp = parseFloat(essentialExpenses);

    if (isNaN(fund) || fund < 0) {
      onError("Please enter a valid non-negative emergency fund amount.");
      return;
    }
    if (isNaN(exp) || exp <= 0) {
      onError("Please enter a valid positive monthly expenses amount.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/simulations/${simulationId}/runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emergencyFund: fund,
            essentialMonthlyExpenses: exp,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          onError(data.error || "Simulation run failed.");
          return;
        }

        onRunSuccess(data.data);
      } catch {
        onError("Network error executing simulation.");
      }
    });
  };

  const handleReset = () => {
    setEmergencyFund("25000");
    setEssentialExpenses("10000");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 surface-card rounded-2xl border border-[var(--border-subtle)] p-5 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Input Assumptions</h3>
      <FundInputField value={emergencyFund} onChange={setEmergencyFund} />
      <ExpenseInputField value={essentialExpenses} onChange={setEssentialExpenses} />
      <FormControls isPending={isPending} onReset={handleReset} />
    </form>
  );
}
