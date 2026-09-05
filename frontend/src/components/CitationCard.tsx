"use client";

import { useState } from "react";
import type { Citation } from "@/lib/types";
import { ConfidenceBadge } from "./ConfidenceBadge";

export function CitationCard({
  citation,
  index,
  onView,
}: {
  citation: Citation;
  index: number;
  onView: (citation: Citation) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-clay-200 bg-white/70 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">
            <span className="mr-1.5 text-ink/40">[{index + 1}]</span>
            {citation.source_file}
          </p>
          <p className="mt-0.5 text-xs text-ink/55">
            p. {citation.page_number} · {citation.section_heading}
          </p>
        </div>
        <ConfidenceBadge confidence={citation.confidence} />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onView(citation)}
          className="text-xs font-medium text-forest-600 underline decoration-forest-300 underline-offset-2 hover:text-forest-700"
        >
          View source PDF
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-medium text-ink/50 underline decoration-ink/20 underline-offset-2 hover:text-ink/70"
        >
          {expanded ? "Hide exact snippet" : "View exact snippet"}
        </button>
      </div>

      {expanded && (
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-clay-50 p-2.5 text-xs leading-relaxed text-ink/75">
          {citation.text}
        </p>
      )}
    </div>
  );
}
