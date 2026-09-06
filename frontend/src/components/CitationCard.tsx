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
    <div className="rounded-xl border border-neu-bg bg-white/70 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-neu-text">
            <span className="mr-1.5 text-neu-sub">[{index + 1}]</span>
            {citation.source_file}
          </p>
          <p className="mt-0.5 text-xs text-neu-sub">
            p. {citation.page_number} · {citation.section_heading}
          </p>
        </div>
        <ConfidenceBadge confidence={citation.confidence} />
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onView(citation)}
          className="text-xs font-medium text-[#5B6F45] underline decoration-[#B7C79E] underline-offset-2 hover:text-[#3F4F30]"
        >
          View source PDF
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-medium text-neu-sub underline decoration-neu-bg underline-offset-2 hover:text-neu-text"
        >
          {expanded ? "Hide exact snippet" : "View exact snippet"}
        </button>
      </div>

      {expanded && (
        <p className="mt-2 whitespace-pre-wrap rounded-lg bg-neu-bg/60 p-2.5 text-xs leading-relaxed text-neu-text/80">
          {citation.text}
        </p>
      )}
    </div>
  );
}
