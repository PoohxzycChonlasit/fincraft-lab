export class BackendApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "BackendApiError";
    this.status = status;
    this.details = details;
  }

  static parseMessage(data: unknown, fallbackMessage = "Backend request failed"): string {
    if (typeof data === "object" && data !== null) {
      if ("message" in data) {
        const msg = (data as { message: unknown }).message;
        if (Array.isArray(msg)) return msg.join(". ");
        if (typeof msg === "string" && msg.trim().length > 0) return msg;
      }
      if ("error" in data && typeof (data as { error: unknown }).error === "string") {
        return (data as { error: string }).error;
      }
    }
    return fallbackMessage;
  }
}
