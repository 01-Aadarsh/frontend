export type Jurisdiction = "national" | "international";

export const FORMULATION_CATEGORIES = [
  "Classical medicine",
  "Proprietary medicine",
  "New / non-classical drug",
  "Phytopharmaceutical",
  "Ayurveda-Aahar / nutraceutical",
  "Cosmetic",
] as const;

export type FormulationCategory = (typeof FORMULATION_CATEGORIES)[number];

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface Citation {
  chunk_id: string;
  source_file: string;
  page_number: number;
  section_heading: string;
  text: string;
  confidence: number;
}

export interface Flags {
  abstained: boolean;
  retried: boolean;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  flags: Flags;
}

export interface QueryRequest {
  question: string;
  history?: ChatTurn[];
  jurisdiction?: Jurisdiction | null;
  category?: string | null;
}

/** One entry in the on-screen conversation — a superset of ChatTurn that also
 * carries citations/flags/errors so the UI can render each turn correctly. */
export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  flags?: Flags;
  /** Set when this assistant turn failed outright (network/5xx/422) instead
   * of returning a QueryResponse — rendered as an error bubble, never sent
   * back to the backend as history. */
  error?: string;
  pending?: boolean;
}
