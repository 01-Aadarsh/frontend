"use client";

import { motion } from "motion/react";
import { Leaf } from "lucide-react";
import { useElapsedSeconds } from "@/hooks/useElapsedSeconds";

/**
 * The real API (POST /query) is a single blocking call with no streaming —
 * there's nothing real to narrate stage-by-stage, and a technical
 * BM25/rerank/RRF readout would mean nothing to the layperson this is
 * built for anyway. So: one warm, honest line instead. The elapsed-seconds
 * counter stays (see useElapsedSeconds) because a wait past ~10s with
 * nothing moving reads as broken — this just keeps it legible without
 * sounding like a system log.
 */
export function RetrievalIndicator() {
  const elapsed = useElapsedSeconds(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex max-w-[85%] items-center gap-3 rounded-2xl rounded-tl-sm border border-white/50 bg-white/90 px-4 py-3.5 shadow-sm backdrop-blur-md sm:max-w-[75%]"
    >
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-100"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <Leaf size={15} className="relative text-emerald-600" />
      </div>
      <div className="flex flex-col gap-0.5">
        <motion.span
          className="text-sm font-medium text-[#022C22]/80"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          Reading Ayurvedic guidelines…
        </motion.span>
        <span
          className="text-xs tabular-nums text-[#044E3B]/60"
          role="status"
          aria-live="polite"
        >
          {elapsed}s — can take up to a minute or so
        </span>
      </div>
    </motion.div>
  );
}
