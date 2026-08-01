import type { SimulationRunResult, SurvivalMonthsInput } from "../types/simulation.types";

export type SimulationField = keyof SurvivalMonthsInput;
export type SimulationFieldErrors = Partial<Record<SimulationField, string>>;

export class SimulationRequestError extends Error {
  readonly fieldErrors: SimulationFieldErrors;

  constructor(message: string, fieldErrors: SimulationFieldErrors = {}) {
    super(message);
    this.name = "SimulationRequestError";
    this.fieldErrors = fieldErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getMessages(payload: unknown): string[] {
  if (!isRecord(payload)) return [];

  const rawError = payload.error ?? payload.message;
  if (typeof rawError === "string" && rawError.trim()) return [rawError];
  if (Array.isArray(rawError)) {
    return rawError.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  return [];
}

function mapFieldErrors(messages: string[]): SimulationFieldErrors {
  return messages.reduce<SimulationFieldErrors>((errors, message) => {
    const field = message.toLowerCase().includes("emergencyfund")
      ? "emergencyFund"
      : message.toLowerCase().includes("essentialmonthlyexpenses")
        ? "essentialMonthlyExpenses"
        : undefined;

    if (field) errors[field] = message;
    return errors;
  }, {});
}

export async function runSimulation(
  simulationId: string,
  input: SurvivalMonthsInput,
): Promise<SimulationRunResult> {
  let payload: unknown = null;

  try {
    const response = await fetch(`/api/simulations/${simulationId}/runs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    payload = await response.json().catch(() => null);

    if (!response.ok) {
      const messages = getMessages(payload);
      const message = messages.join(" ") || "Simulation run failed.";
      throw new SimulationRequestError(message, mapFieldErrors(messages));
    }
  } catch (error) {
    if (error instanceof SimulationRequestError) throw error;
    throw new SimulationRequestError("Network error executing simulation.");
  }

  if (!isRecord(payload) || !isRecord(payload.data)) {
    throw new SimulationRequestError("The simulation returned an invalid result.");
  }

  return payload.data as SimulationRunResult;
}
