/**
 * Client for the IP-SAKTI backend API.
 *
 * Mirrors docs/API_CONTRACT.md exactly — that file is the source of truth,
 * not this one. Key contract points encoded here:
 *   - flags.abstained is the ONLY correct way to detect an abstention.
 *     Never string-match `answer`.
 *   - citations is always [] when flags.abstained is true.
 *   - Responses take 29-54s in the common case (Ollama times out locally
 *     before falling back to Groq), up to ~90s worst case for a multi-turn
 *     request that also triggers the bounded retry (up to 3 sequential LLM
 *     calls). The backend's own REQUEST_TIMEOUT defaults to 90s to cover
 *     that, so the client timeout here is set comfortably above it (98s)
 *     so the backend's own clean 504 fires first, not a generic fetch abort.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const CLIENT_TIMEOUT_MS = 98_000;

/**
 * URL for a citation's real source PDF, jumped to its page via the
 * `#page=N` fragment (client-side native-PDF-viewer behavior, not
 * something the server does — see API_CONTRACT.md's /sources section).
 */
export function sourcePdfUrl(citation: Citation): string {
  return `${API_BASE}/sources/${encodeURIComponent(citation.source_file)}#page=${citation.page_number}`;
}

export interface Citation {
  chunk_id: string;
  source_file: string;
  page_number: number;
  section_heading: string;
  text: string;
  /** 0-100, a readable transform of the rerank score — not a calibrated
   * probability of correctness. See API_CONTRACT.md's Citation table. */
  confidence: number;
}

export type Jurisdiction = "national" | "international";

/**
 * Formulation categories from the PS's classification step, in the exact
 * order/wording it uses. `value` is sent to the backend verbatim as
 * `category` (prepended server-side, not a strict enum there either).
 */
export const CATEGORIES = [
  {
    value: "classical medicine",
    label: "Classical (1st Schedule)",
    hint: "Section 3(p) / TKDL bar",
    // Phrased to actually retrieve well against the indexed corpus (verified
    // — see backend commit history) rather than a generic template that
    // matches no single chunk well and just abstains.
    postureQuery:
      "What does Section 3(p) of the Patents Act say about traditional knowledge, and what protection exists for classical Ayurvedic formulations?",
  },
  {
    value: "patent-or-proprietary medicine",
    label: "Patent & Proprietary (P&P)",
    hint: "Synergistic extract / Novel method",
    postureQuery:
      "What are the patentability requirements for a proprietary Ayurvedic medicine in India?",
  },
  {
    value: "new or non-classical drug",
    label: "New / Non-Classical Drug",
    hint: "NDCT Rules 2019 / Safety-efficacy trials",
    postureQuery:
      "What do the New Drugs and Clinical Trials Rules 2019 require for a new Ayurvedic drug?",
  },
  {
    value: "phytopharmaceutical",
    label: "Phytopharmaceutical",
    hint: "Purified fraction / CDSCO NDCT",
    postureQuery:
      "What regulatory requirements apply to a phytopharmaceutical drug under Indian law?",
  },
  {
    value: "Ayurveda-Aahar / nutraceutical",
    label: "Ayurveda-Aahar",
    hint: "FSSAI 2022 Regulations",
    // Honest note: FSSAI's Ayurveda-Aahar regulations aren't in the indexed
    // corpus yet (see docs/technical_execution_guide.pdf gap analysis) —
    // this will likely abstain, correctly, rather than guess.
    postureQuery:
      "What regulations apply to an Ayurveda-Aahar or nutraceutical food product in India?",
  },
  {
    value: "cosmetic",
    label: "Ayurvedic Cosmetic",
    hint: "D&C Act Schedule M-II",
    // Same honesty note as above — Drugs & Cosmetics Act itself isn't
    // indexed yet, only the NDCT Rules (drug trials, not cosmetics).
    postureQuery:
      "What regulatory requirements apply to an Ayurvedic cosmetic product in India?",
  },
] as const;

export type Category = (typeof CATEGORIES)[number]["value"];

export interface QueryFlags {
  abstained: boolean;
  retried: boolean;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  flags: QueryFlags;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export class ApiError extends Error {
  /** HTTP status code, or 0 for a client-side timeout/network failure. */
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Ask a question. `history` must be prior turns only, oldest first — the
 * current question goes in `question`, not appended to `history`.
 * `jurisdiction`/`category` are optional context from the intake flow —
 * see API_CONTRACT.md for exactly what each does server-side.
 */
export async function postQuery(
  question: string,
  history: ChatTurn[],
  options?: { jurisdiction?: Jurisdiction | null; category?: string | null }
): Promise<QueryResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        history,
        jurisdiction: options?.jurisdiction ?? null,
        category: options?.category ?? null,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new ApiError(await describeError(res), res.status);
    }

    return (await res.json()) as QueryResponse;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(
        "The request took too long and was cancelled on this end. The backend itself allows up to 90s — this is a client-side safety cutoff above that.",
        0
      );
    }
    throw new ApiError(
      "Could not reach the backend. Is it running, and is NEXT_PUBLIC_API_BASE_URL correct?",
      0
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Extracts a readable message from the backend's error shape (see API_CONTRACT.md § Error handling). */
async function describeError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      // 422 validation errors: [{type, loc, msg, input}, ...]
      return body.detail
        .map((d: { msg?: string }) => d.msg)
        .filter(Boolean)
        .join(", ") || `Request failed (${res.status})`;
    }
  } catch {
    // fall through to generic message below
  }
  return `Request failed (${res.status})`;
}
