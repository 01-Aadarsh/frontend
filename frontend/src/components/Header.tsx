"use client";

import type { Jurisdiction } from "@/lib/types";
import { LogoBadge } from "@/components/brand/LogoBadge";
import { JurisdictionCompare } from "./JurisdictionCompare";

export function Header({
  jurisdiction,
  category,
  lastQuestion,
  onChangeContext,
}: {
  jurisdiction: Jurisdiction;
  category: string | null;
  lastQuestion: string | null;
  onChangeContext: () => void;
}) {
  return (
    <div className="shrink-0 border-b border-neu-bg">
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onChangeContext}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-neu-text shadow-neuSm transition hover:bg-neu-bg"
          >
            <span aria-hidden>←</span> Back to setup
          </button>
          <LogoBadge className="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />

          <div className="min-w-0 border-l border-neu-bg pl-3">
            <p className="truncate text-base font-bold text-neu-text">
              IP-SAKTI Sahayak{" "}
              <span className="text-xs font-semibold text-neu-sub">
                — An Initiative under Ministry of AYUSH
              </span>
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neu-sub">
              <span className="rounded-full bg-rose-100 px-2 py-0.5 font-medium text-rose-600">
                {jurisdiction === "national" ? "India" : "International"}
              </span>
              {category && (
                <span className="rounded-full bg-[#EDF2E2] px-2 py-0.5 font-medium text-[#5B6F45]">
                  {category}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center">
          <JurisdictionCompare
            jurisdiction={jurisdiction}
            category={category}
            lastQuestion={lastQuestion}
          />
        </div>
      </header>

      <div className="bg-rose-50/70 px-4 py-2 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-rose-600">
          You are proceeding with{" "}
          {jurisdiction === "national" ? "National" : "International"} rules
          and regulations
        </p>
      </div>
    </div>
  );
}
