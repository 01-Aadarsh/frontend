import type { QueryRequest, QueryResponse } from "./types";

/** No hardcoded fallback here on purpose — silently defaulting to a
 * localhost address would make a misconfigured production deploy fail with
 * a confusing generic network error instead of a clear, actionable one.
 * Set this in your hosting platform's environment variables once the
 * backend is deployed (see .env.local.example for local development). */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;

/**
 * The backend's own REQUEST_TIMEOUT defaults to 60s and returns a clean 504
 * past that point (see docs/API_CONTRACT.md). We set the client timeout a
 * little above it so the server's informative 504 wins the race instead of
 * our fetch aborting first with a generic error.
 */
const CLIENT_TIMEOUT_MS = 68_000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ClientTimeoutError extends Error {
  constructor() {
    super(
      "The request took longer than 68 seconds without a response — the backend may be unreachable or overloaded."
    );
    this.name = "ClientTimeoutError";
  }
}

export class ApiNotConfiguredError extends Error {
  constructor() {
    super(
      "The backend isn't configured yet — set NEXT_PUBLIC_API_BASE_URL to your deployed backend's URL (see .env.local.example)."
    );
    this.name = "ApiNotConfiguredError";
  }
}

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) throw new ApiNotConfiguredError();
  return API_BASE_URL;
}

async function extractErrorDetail(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const detail = body?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      // FastAPI's 422 validation shape: [{ loc, msg, type, ... }, ...]
      return detail
        .map((d: { loc?: unknown[]; msg?: string }) =>
          d?.msg ? `${(d.loc ?? []).join(".")}: ${d.msg}` : JSON.stringify(d)
        )
        .join("; ");
    }
    return res.statusText || `Request failed with status ${res.status}`;
  } catch {
    return res.statusText || `Request failed with status ${res.status}`;
  }
}

export async function query(req: QueryRequest): Promise<QueryResponse> {
  const baseUrl = requireApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: req.question,
        history: req.history ?? [],
        jurisdiction: req.jurisdiction ?? null,
        category: req.category ?? null,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ClientTimeoutError();
    }
    throw new ApiError(`Could not reach the backend at ${baseUrl}.`, 0);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const detail = await extractErrorDetail(res);
    throw new ApiError(detail, res.status);
  }

  return (await res.json()) as QueryResponse;
}

/** A citation's source PDF, servable directly by the backend's /sources
 * mount. `#page=N` is honored by most browsers' native PDF viewer. */
export function sourceUrl(sourceFile: string, page?: number): string {
  const base = `${requireApiBaseUrl()}/sources/${encodeURIComponent(sourceFile)}`;
  return page ? `${base}#page=${page}` : base;
}

export { API_BASE_URL };
