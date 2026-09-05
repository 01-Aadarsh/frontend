"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronDown, ArrowUpRight } from "lucide-react";
import type { Citation } from "@/lib/api";
import { ConfidenceBadge } from "@/components/chat/ConfidenceBadge";

/**
 * The citation display is the product's differentiator, per the build guide
 * — "make it prominent, not a footnote." section_heading is a heuristic
 * (see API_CONTRACT.md's Citation table) — it can be low-quality (e.g.
 * "5 Ibid") or the literal fallback "Unlabelled section". Both are shown
 * as-is rather than hidden, since pretending the heading is always
 * reliable would be its own kind of dishonesty about what the system
 * actually knows. The statute-style badge below is built only from real
 * source_file/section_heading fields — never a fabricated section number.
 *
 * Clicking a card opens it in the right-hand SourceViewer panel (desktop —
 * see page.tsx's activeCitation state). The inline chevron-expand below is
 * kept as the mobile fallback, since the side panel is hidden below the
 * `lg` breakpoint.
 */
export function SourcesList({
  citations,
  onOpenSource,
}: {
  citations: Citation[];
  onOpenSource: (citation: Citation) => void;
}) {
  if (citations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className="mt-3 flex flex-col gap-2 border-t border-[#022C22]/10 pt-3"
    >
      <span className="text-xs font-bold uppercase tracking-wide text-[#044E3B]/70">
        Authoritative References &amp; Statutory Sources
      </span>
      <ul className="flex flex-col gap-2">
        {citations.map((c, i) => (
          <SourceCard
            key={c.chunk_id}
            citation={c}
            index={i}
            onOpenSource={onOpenSource}
          />
        ))}
      </ul>
    </motion.div>
  );
}

function statuteLabel(citation: Citation): string {
  const name = citation.source_file.replace(/\.pdf$/i, "").replace(/_/g, " ");
  const hasHeading =
    citation.section_heading && citation.section_heading !== "Unlabelled section";
  return hasHeading ? `${name} — ${citation.section_heading}` : name;
}

function SourceCard({
  citation,
  index,
  onOpenSource,
}: {
  citation: Citation;
  index: number;
  onOpenSource: (citation: Citation) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.06, duration: 0.25 }}
      className="overflow-hidden rounded-xl border border-white/60 bg-white/70 shadow-sm backdrop-blur-md"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpenSource(citation)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenSource(citation);
          }
        }}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-amber-50/50"
      >
        <div className="flex min-w-0 flex-1 items-start gap-2.5">
          <div className="mt-0.5 shrink-0 rounded-full bg-amber-50/90 p-1.5">
            <BookOpen size={14} className="text-amber-700" strokeWidth={2} />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate rounded-full border border-amber-200/80 bg-amber-50/80 px-2 py-0.5 text-xs font-semibold text-amber-900">
              {statuteLabel(citation)}
            </span>
            <span className="flex flex-wrap items-center gap-1.5 text-xs text-[#044E3B]/70">
              <span className="rounded-full border border-[#022C22]/10 px-1.5 py-0.5 text-[11px] text-[#044E3B]/70">
                page {citation.page_number}
              </span>
              <ConfidenceBadge value={citation.confidence} />
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <ArrowUpRight size={14} className="hidden text-emerald-700 lg:block" />
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="rounded p-0.5 text-[#044E3B]/50 lg:hidden"
            aria-label="View exact legal gazette snippet"
          >
            <ChevronDown size={16} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden lg:hidden"
          >
            <div className="border-t border-[#022C22]/10 px-3.5 py-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#044E3B]/60">
                View Exact Legal Gazette Snippet
              </p>
              <p className="whitespace-pre-line rounded-lg border-l-2 border-amber-400 bg-white/60 py-2 pl-3 text-sm italic leading-relaxed text-[#022C22]/80">
                &ldquo;{citation.text}&rdquo;
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
