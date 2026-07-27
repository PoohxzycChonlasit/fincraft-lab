import { BackendApiError } from "./backend-api-error";

export type ParsedResponseResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; error: string; data?: unknown };

export async function parseBackendResponse(res: Response): Promise<ParsedResponseResult> {
  const status = res.status;

  if (status === 204) {
    return { ok: true, status, data: null };
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let bodyData: unknown = null;
  if (isJson) {
    try {
      bodyData = await res.json();
    } catch {
      bodyData = null;
    }
  } else {
    try {
      const text = await res.text();
      bodyData = text.length > 0 ? { rawText: text } : null;
    } catch {
      bodyData = null;
    }
  }

  if (!res.ok) {
    const errorMsg = BackendApiError.parseMessage(
      bodyData,
      `Backend request failed with status ${status}`,
    );
    return { ok: false, status, error: errorMsg, data: bodyData };
  }

  return { ok: true, status, data: bodyData };
}
