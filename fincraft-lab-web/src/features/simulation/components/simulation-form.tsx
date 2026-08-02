"use client";

import { useState, useTransition, type FormEventHandler } from "react";
import { Play, RefreshCw, RotateCcw } from "lucide-react";
import { runSimulation, SimulationRequestError, type SimulationFieldErrors } from "../api/run-simulation";
import type { SimulationRunResult } from "../types/simulation.types";

export type SimulationFormValues = {
  emergencyFund: string;
  essentialMonthlyExpenses: string;
};

type FieldErrors = SimulationFieldErrors;

const DEFAULT_VALUES: SimulationFormValues = {
  emergencyFund: "25000",
  essentialMonthlyExpenses: "10000",
};
const MAX_AMOUNT = 100000000;

const inputClass = (error?: string) =>
  `w-full min-h-11 rounded-xl border bg-(--surface-inset) px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) disabled:opacity-50 ${
    error ? "border-destructive" : "border-(--border-subtle) focus-visible:border-(--accent-teal)"
  }`;

function validateAmount(value: string, minimum: number, label: string): string | undefined {
  if (!value.trim()) return `${label} is required.`;

  const amount = Number(value);
  const decimalPlaces = value.split(".")[1]?.length ?? 0;
  if (!Number.isFinite(amount) || decimalPlaces > 2) return `${label} must be a number with up to 2 decimal places.`;
  if (amount < minimum) return `${label} must be at least ${minimum}.`;
  if (amount > MAX_AMOUNT) return `${label} must not exceed 100,000,000.`;
  return undefined;
}

function FundField({ value, onChange, error, disabled }: { value: string; onChange: (value: string) => void; error?: string; disabled: boolean }) {
  return (
    <div className="space-y-2">
      <label htmlFor="emergencyFund" className="block text-sm font-bold text-foreground">
        Emergency fund reserve <span aria-hidden="true" className="text-destructive">*</span>
        <span className="ml-1.5 font-normal text-muted-foreground">(entered currency units)</span>
      </label>
      <input
        id="emergencyFund"
        name="emergencyFund"
        type="number"
        inputMode="decimal"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: 25000"
        disabled={disabled}
        aria-describedby={error ? "emergencyFund-error" : "emergencyFund-hint"}
        aria-invalid={Boolean(error)}
        aria-required="true"
        className={inputClass(error)}
      />
      {error ? <p id="emergencyFund-error" className="text-xs font-medium text-destructive">{error}</p> : <p id="emergencyFund-hint" className="text-xs leading-relaxed text-muted-foreground">Liquid savings available for the experiment. Permitted range: 0–100,000,000.</p>}
    </div>
  );
}

function ExpenseField({ value, onChange, error, disabled }: { value: string; onChange: (value: string) => void; error?: string; disabled: boolean }) {
  return (
    <div className="space-y-2">
      <label htmlFor="essentialMonthlyExpenses" className="block text-sm font-bold text-foreground">
        Essential monthly expenses <span aria-hidden="true" className="text-destructive">*</span>
        <span className="ml-1.5 font-normal text-muted-foreground">(same currency, per month)</span>
      </label>
      <input
        id="essentialMonthlyExpenses"
        name="essentialMonthlyExpenses"
        type="number"
        inputMode="decimal"
        step="0.01"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Example: 10000"
        disabled={disabled}
        aria-describedby={error ? "essentialMonthlyExpenses-error" : "essentialMonthlyExpenses-hint"}
        aria-invalid={Boolean(error)}
        aria-required="true"
        className={inputClass(error)}
      />
      {error ? <p id="essentialMonthlyExpenses-error" className="text-xs font-medium text-destructive">{error}</p> : <p id="essentialMonthlyExpenses-hint" className="text-xs leading-relaxed text-muted-foreground">Rent, food, utilities, and other required costs. Must be greater than zero.</p>}
    </div>
  );
}

function SimulationFields({ values, errors, onChange, disabled }: { values: SimulationFormValues; errors: FieldErrors; onChange: (field: keyof SimulationFormValues, value: string) => void; disabled: boolean }) {
  return (
    <div className="space-y-5">
      <FundField value={values.emergencyFund} onChange={(value) => onChange("emergencyFund", value)} error={errors.emergencyFund} disabled={disabled} />
      <ExpenseField value={values.essentialMonthlyExpenses} onChange={(value) => onChange("essentialMonthlyExpenses", value)} error={errors.essentialMonthlyExpenses} disabled={disabled} />
    </div>
  );
}

function FormActions({ isPending, onReset }: { isPending: boolean; onReset: () => void }) {
  return (
    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-end">
      <button type="button" onClick={onReset} disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-solid) px-4 text-xs font-bold text-foreground transition-colors hover:bg-(--surface-paper) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2 disabled:opacity-50">
        <RotateCcw className="size-3.5" aria-hidden="true" />
        Reset
      </button>
      <button type="submit" disabled={isPending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-(--brand-primary) px-5 text-xs font-bold text-(--brand-primary-foreground) shadow-xs transition-colors hover:bg-(--accent-teal-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring) focus-visible:ring-offset-2 disabled:opacity-50">
        {isPending ? <><RefreshCw className="size-3.5 animate-spin" aria-hidden="true" />Running experiment…</> : <><Play className="size-3.5 fill-current" aria-hidden="true" />Run Simulation</>}
      </button>
    </div>
  );
}

function FormBody({ values, errors, isPending, onChange, onReset }: { values: SimulationFormValues; errors: FieldErrors; isPending: boolean; onChange: (field: keyof SimulationFormValues, value: string) => void; onReset: () => void }) {
  return (
    <>
      <div className="space-y-2">
        <h3 className="font-section-title text-foreground">Enter the two assumptions</h3>
        <p className="font-body leading-relaxed text-muted-foreground">Use the same currency unit for both values. The model tests only what you enter here.</p>
      </div>
      <SimulationFields values={values} errors={errors} onChange={onChange} disabled={isPending} />
      <p role="status" aria-live="polite" className="min-h-4 text-xs text-muted-foreground">
        {isPending ? "The backend is calculating and saving this run." : "Values stay in the form if a recoverable request fails."}
      </p>
      <FormActions isPending={isPending} onReset={onReset} />
    </>
  );
}

function createSubmitHandler({ simulationId, emergencyFund, essentialMonthlyExpenses, isPending, setFieldErrors, startTransition, onRunStart, onRunSuccess, onError }: {
  simulationId: string;
  emergencyFund: string;
  essentialMonthlyExpenses: string;
  isPending: boolean;
  setFieldErrors: (errors: FieldErrors) => void;
  startTransition: (callback: () => void) => void;
  onRunStart?: () => void;
  onRunSuccess: (run: SimulationRunResult) => void;
  onError: (error: string) => void;
}): FormEventHandler<HTMLFormElement> {
  return (event) => {
    event.preventDefault();
    if (isPending) return;
    onRunStart?.();

    const errors: FieldErrors = {
      emergencyFund: validateAmount(emergencyFund, 0, "Emergency fund reserve"),
      essentialMonthlyExpenses: validateAmount(essentialMonthlyExpenses, 0.01, "Essential monthly expenses"),
    };
    if (errors.emergencyFund || errors.essentialMonthlyExpenses) {
      setFieldErrors(errors);
      onError("Please correct the highlighted assumptions.");
      return;
    }

    setFieldErrors({});
    startTransition(async () => {
      try {
        const run = await runSimulation(simulationId, {
          emergencyFund: Number(emergencyFund),
          essentialMonthlyExpenses: Number(essentialMonthlyExpenses),
        });
        onRunSuccess(run);
      } catch (error) {
        if (error instanceof SimulationRequestError) {
          setFieldErrors(error.fieldErrors);
          onError(error.message);
          return;
        }
        onError("Unable to complete the simulation.");
      }
    });
  };
}

export function SimulationForm({
  simulationId,
  initialValues,
  onRunStart,
  onRunSuccess,
  onReset,
  onError,
}: {
  simulationId: string;
  initialValues?: SimulationFormValues;
  onRunStart?: () => void;
  onRunSuccess: (run: SimulationRunResult) => void;
  onReset?: () => void;
  onError: (error: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [emergencyFund, setEmergencyFund] = useState(initialValues?.emergencyFund ?? DEFAULT_VALUES.emergencyFund);
  const [essentialMonthlyExpenses, setEssentialMonthlyExpenses] = useState(initialValues?.essentialMonthlyExpenses ?? DEFAULT_VALUES.essentialMonthlyExpenses);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleReset = () => {
    setEmergencyFund(DEFAULT_VALUES.emergencyFund);
    setEssentialMonthlyExpenses(DEFAULT_VALUES.essentialMonthlyExpenses);
    setFieldErrors({});
    onError("");
    onReset?.();
  };

  const values = { emergencyFund, essentialMonthlyExpenses };
  const handleChange = (field: keyof SimulationFormValues, value: string) => {
    if (field === "emergencyFund") setEmergencyFund(value);
    if (field === "essentialMonthlyExpenses") setEssentialMonthlyExpenses(value);
  };

  const handleSubmit = createSubmitHandler({ simulationId, emergencyFund, essentialMonthlyExpenses, isPending, setFieldErrors, startTransition, onRunStart, onRunSuccess, onError });

  return (
    <form onSubmit={handleSubmit} aria-label="Simulation assumptions" aria-busy={isPending} className="surface-paper space-y-6 rounded-2xl p-5 sm:p-6">
      <FormBody values={values} errors={fieldErrors} isPending={isPending} onChange={handleChange} onReset={handleReset} />
    </form>
  );
}
