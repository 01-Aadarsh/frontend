"use client";

import { useState } from "react";
import { ApiError, ClientTimeoutError, query } from "@/lib/api";
import type { Jurisdiction } from "@/lib/types";
import { THEME } from "@/lib/theme";

/** Toggle switch in the chat header: flipping it fetches the same last
 * question against the OTHER jurisdiction's corpus and shows the answer in a
 * popup, so the user can see how national/international treatment differs
 * for whatever they're currently discussing -- without changing the actual
 * conversation's jurisdiction. */
export function JurisdictionCompare({
  jurisdiction,
  category,
  lastQuestion,
}: {
  jurisdiction: Jurisdiction;
  category: string | null;
  lastQuestion: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<{ text: string; abstained: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askedFor, setAskedFor] = useState<string | null>(null);

  const otherJurisdiction: Jurisdiction =
    jurisdiction === "national" ? "international" : "national";
  const otherLabel = otherJurisdiction === "national" ? "National" : "International";

  async function toggle() {
    const opening = !open;
    setOpen(opening);
    if (!opening || !lastQuestion || askedFor === lastQuestion) return;

    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await query({
        question: lastQuestion,
        jurisdiction: otherJurisdiction,
        category,
      });
      setAnswer({ text: res.answer, abstained: res.flags.abstained });
      setAskedFor(lastQuestion);
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof ClientTimeoutError
          ? err.message
          : "Something went wrong talking to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        role="switch"
        aria-checked={open}
        onClick={toggle}
        className="flex items-center gap-1.5"
      >
        <span className="hidden text-xs font-medium text-neu-sub sm:inline">
          {otherLabel} view
        </span>
        <span
          className={`relative h-5 w-9 shrink-0 rounded-full shadow-neuInset transition-colors ${
            open ? THEME.rose.fill : "bg-neu-bg"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-neuSm transition-transform ${
              open ? "translate-x-[18px]" : "translate-x-0.5"
            }`}
          />
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl bg-neu-surface p-4 text-left shadow-neu sm:w-80">
          <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
            How this differs under {otherLabel} rules
          </p>

          {!lastQuestion && (
            <p className="mt-2 text-xs leading-relaxed text-neu-sub">
              Ask a question first, then flip this to see how{" "}
              {otherLabel.toLowerCase()} rules treat the same topic.
            </p>
          )}

          {lastQuestion && loading && (
            <p className="mt-2 text-xs leading-relaxed text-neu-sub">
              Checking the {otherLabel.toLowerCase()} sources for &quot;
              {lastQuestion}&quot;...
            </p>
          )}

          {lastQuestion && !loading && error && (
            <p className="mt-2 text-xs leading-relaxed text-red-600">{error}</p>
          )}

          {lastQuestion && !loading && !error && answer && (
            <p
              className={`mt-2 text-xs leading-relaxed ${
                answer.abstained ? "text-amber-700" : "text-neu-text"
              }`}
            >
              {answer.abstained
                ? `Nothing in the ${otherLabel.toLowerCase()} corpus answers this directly.`
                : answer.text}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
