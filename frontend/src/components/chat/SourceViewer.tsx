"use client";

import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ExternalLink, PanelRightClose } from "lucide-react";
import type { Citation } from "@/lib/api";
import { sourcePdfUrl } from "@/lib/api";
import { ConfidenceBadge } from "@/components/chat/ConfidenceBadge";

/**
 * The right-hand "researcher" panel — persistent proof that an answer's
 * citation is real. Shows the exact retrieved chunk text (the same text the
 * LLM was grounded on, verbatim, highlighted as a whole block) rather than
 * attempting pixel-precise in-PDF highlighting: we only have page numbers,
 * not per-citation bounding boxes, so highlighting a sub-span inside a
 * rendered PDF would be fabricating precision we don't actually have. The
 * "Open source PDF" link jumps to the real page for anyone who wants to
 * verify against the actual document.
 */
export function SourceViewer({
  citation,
  onClose,
}: {
  citation: Citation | null;
  onClose: () => void;
}) {
  return (
    <div className="hidden h-full w-[380px] shrink-0 flex-col border-l border-white/50 bg-white/60 shadow-[-4px_0_24px_rgba(2,44,34,0.03)] backdrop-blur-xl lg:flex">
      <div className="flex items-center justify-between border-b border-white/50 px-4 py-3.5">
        <span className="text-xs font-bold uppercase tracking-wide text-[#044E3B]/70">
          Authoritative References &amp; Statutory Sources
        </span>
        {citation && (
          <button
            onClick={onClose}
            aria-label="Close this panel"
            className="rounded-lg p-1.5 text-[#044E3B]/60 transition-colors hover:bg-white/60 hover:text-[#022C22]"
          >
            <PanelRightClose size={15} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          {!citation ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center"
            >
              <div className="rounded-full bg-amber-50 p-3">
                <BookOpen size={20} className="text-amber-500" />
              </div>
              <p className="text-xs text-[#044E3B]/60">
                Select a source badge on any answer to view the exact legal
                gazette snippet here.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={citation.chunk_id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-4"
            >
              <div className="rounded-xl border border-amber-200/70 bg-amber-50/80 p-3.5 backdrop-blur-sm">
                <div className="flex items-start gap-2 text-[#022C22]">
                  <BookOpen size={15} className="mt-0.5 shrink-0 text-amber-700" strokeWidth={2} />
                  <span className="break-words text-sm font-semibold">
                    {citation.source_file.replace(/\.pdf$/i, "").replace(/_/g, " ")}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full border border-amber-200 bg-white/80 px-1.5 py-0.5 text-[11px] text-[#044E3B]/70">
                    page {citation.page_number}
                  </span>
                  <ConfidenceBadge value={citation.confidence} />
                  {citation.section_heading &&
                    citation.section_heading !== "Unlabelled section" && (
                      <span className="text-[11px] text-[#044E3B]/60">
                        {citation.section_heading}
                      </span>
                    )}
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#044E3B]/60">
                  View Exact Legal Gazette Snippet
                </p>
                <p className="whitespace-pre-line rounded-xl border-l-2 border-amber-400 bg-white/70 p-3.5 text-sm italic leading-relaxed text-[#022C22]/80 backdrop-blur-sm">
                  &ldquo;{citation.text}&rdquo;
                </p>
              </div>

              <a
                href={sourcePdfUrl(citation)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-lg border border-white/60 bg-white/80 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50"
              >
                <ExternalLink size={13} />
                Open Original Gazette PDF
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
