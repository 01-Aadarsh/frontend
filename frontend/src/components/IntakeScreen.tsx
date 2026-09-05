"use client";

import { useState } from "react";
import { FORMULATION_CATEGORIES, type Jurisdiction } from "@/lib/types";

export function IntakeScreen({
  onStart,
}: {
  onStart: (jurisdiction: Jurisdiction, category: string | null) => void;
}) {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-clay-200 bg-white p-8 shadow-panel sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest-500">
          Step 0
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
          IP-SAKTI Sahayak
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">
          Before your first question, tell us the jurisdiction — and, if you
          know it, the formulation category. Both shape which regulatory
          posture actually applies, so we ask up front rather than guessing.
        </p>

        <fieldset className="mt-7">
          <legend className="text-sm font-medium text-ink">
            Jurisdiction <span className="text-red-500">*</span>
          </legend>
          <div className="mt-2.5 grid grid-cols-2 gap-3">
            {(
              [
                { value: "national" as const, label: "India", sub: "National law" },
                {
                  value: "international" as const,
                  label: "International",
                  sub: "Treaties & foreign filing",
                },
              ]
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setJurisdiction(opt.value)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  jurisdiction === opt.value
                    ? "border-forest-500 bg-forest-50 ring-1 ring-forest-500"
                    : "border-clay-200 hover:border-forest-300"
                }`}
              >
                <span className="block text-sm font-medium text-ink">
                  {opt.label}
                </span>
                <span className="block text-xs text-ink/50">{opt.sub}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-ink">
            Formulation category{" "}
            <span className="font-normal text-ink/40">(optional)</span>
          </legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {FORMULATION_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory((prev) => (prev === c ? null : c))}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  category === c
                    ? "border-saffron-500 bg-saffron-100 text-saffron-600"
                    : "border-clay-200 text-ink/60 hover:border-saffron-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          disabled={!jurisdiction}
          onClick={() => jurisdiction && onStart(jurisdiction, category)}
          className="mt-8 w-full rounded-2xl bg-forest-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Start asking questions
        </button>
      </div>
    </div>
  );
}
