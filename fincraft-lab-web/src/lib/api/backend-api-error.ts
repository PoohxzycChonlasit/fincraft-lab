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
    if (typeof data === "object" && data !== null && "message" in data) {
      const msg = (data as { message: unknown }).message;
      if (Array.isArray(msg)) return msg.join(". ");
      if (typeof msg === "string") return msg;
    }
    return fallbackMessage;
  }
}
