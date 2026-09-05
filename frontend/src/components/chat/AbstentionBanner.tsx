"use client";

import { motion } from "motion/react";
import { ShieldAlert } from "lucide-react";

/**
 * The abstention guardrail's face in the UI. The backend's actual answer
 * text here is always the fixed marker "I could not find this in my
 * sources." (see backend/generation/citation.py / graph/nodes.py) — never
 * shown verbatim, since that reads as a raw system message rather than a
 * calm, expected outcome. This says the same fact plainly: nothing indexed
 * covered the question, so nothing was made up.
 */
export function AbstentionBanner({ content }: { content: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex max-w-[85%] items-start gap-3 rounded-2xl rounded-tl-sm border border-amber-200/70 bg-amber-50/85 px-4 py-3.5 shadow-sm backdrop-blur-md sm:max-w-[75%]"
    >
      <div className="mt-0.5 shrink-0 rounded-full bg-white/80 p-1.5 shadow-sm">
        <ShieldAlert size={16} className="text-amber-600" strokeWidth={2} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold uppercase tracking-wide text-amber-800">
          Source Limit Reached
        </span>
        <p className="text-sm text-[#022C22]/80">
          Not found in indexed AYUSH gazettes. Please verify with an{" "}
          <a
            href="mailto:contact@ip-sakti.example?subject=IP%20facilitator%20request"
            className="font-medium text-amber-800 underline underline-offset-2"
          >
            IP facilitator
          </a>
          .
        </p>
        <p className="mt-0.5 text-xs text-[#044E3B]/60">
          Try naming a specific act, rule, or section — it helps me search
          more precisely.
        </p>
        <span className="sr-only">{content}</span>
      </div>
    </motion.div>
  );
}
