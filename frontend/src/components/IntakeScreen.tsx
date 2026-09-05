"use client";

import { useState } from "react";
import { FORMULATION_CATEGORIES, type Jurisdiction } from "@/lib/types";

type ThemeName = "rose" | "sage" | "amber";

const THEME: Record<
  ThemeName,
  { badge: string; fill: string; dot: string; text: string }
> = {
  rose: {
    badge: "bg-gradient-to-br from-rose-300 to-orange-400",
    fill: "bg-gradient-to-r from-rose-300 to-orange-400",
    dot: "bg-rose-400",
    text: "text-rose-600",
  },
  sage: {
    badge: "bg-gradient-to-br from-[#B7C79E] to-[#748C5B]",
    fill: "bg-gradient-to-r from-[#B7C79E] to-[#748C5B]",
    dot: "bg-[#748C5B]",
    text: "text-[#5B6F45]",
  },
  amber: {
    badge: "bg-gradient-to-br from-amber-300 to-orange-500",
    fill: "bg-gradient-to-r from-amber-300 to-orange-500",
    dot: "bg-amber-500",
    text: "text-amber-700",
  },
};

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
      <path
        d="M6 18C4 12 7 6 18 5c1 10-4 14-12 13Z"
        fill="currentColor"
        fillOpacity="0.25"
      />
      <path
        d="M6 18C4 12 7 6 18 5c1 10-4 14-12 13Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M6 18C9 14 12 11 16 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
      <path
        d="M4 12l16-8-6 16-3-6-7-2Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBadge({ theme, children }: { theme: ThemeName; children: React.ReactNode }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-neuSm ${THEME[theme].badge}`}
    >
      {children}
    </span>
  );
}

function StarMark() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-amber-500">
      <path d="M12 2l2.2 6.8H21l-5.6 4.1 2.2 6.9L12 15.7 6.4 19.8l2.2-6.9L3 8.8h6.8Z" />
    </svg>
  );
}

function Dots({ count, activeIndex, theme }: { count: number; activeIndex: number | null; theme: ThemeName }) {
  return (
    <div className="mt-2.5 flex items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === activeIndex ? `w-4 ${THEME[theme].dot}` : "w-1.5 bg-neu-bg shadow-neuInset"
          }`}
        />
      ))}
    </div>
  );
}

export function IntakeScreen({
  onStart,
}: {
  onStart: (jurisdiction: Jurisdiction, category: string | null) => void;
}) {
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const stepsDone = (jurisdiction ? 1 : 0) + (category ? 1 : 0);
  const readiness = jurisdiction ? Math.round((stepsDone / 2) * 100) : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0D2B22] via-[#1F4536] to-[#6E4A2A] px-4 py-12">
      <div className="w-full max-w-xl rounded-[32px] bg-neu-surface p-8 shadow-2xl sm:p-10">
        <div className="flex items-start justify-between">
          <IconBadge theme="rose">
            <IconGlobe />
          </IconBadge>
          <StarMark />
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-neu-sub">
          Step 0
        </p>
        <h1 className="mt-1 text-2xl font-bold text-neu-text sm:text-3xl">
          IP-SAKTI Sahayak
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neu-sub">
          Before your first question, set the jurisdiction — and, if you know
          it, the formulation category. Both shape which regulatory posture
          applies, so we ask up front rather than guessing.
        </p>

        {/* Jurisdiction */}
        <div className="mt-8">
          <div className="flex items-center gap-2.5">
            <IconBadge theme="rose">
              <IconGlobe />
            </IconBadge>
            <div>
              <p className="text-sm font-semibold text-neu-text">
                Jurisdiction <span className="text-red-500">*</span>
              </p>
              <p className="text-xs text-neu-sub">Required</p>
            </div>
          </div>

          <div className="relative mt-3 flex rounded-full bg-neu-bg p-1 shadow-neuInset">
            <div
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-neuSm transition-all duration-300 ${THEME.rose.fill} ${
                jurisdiction === "international"
                  ? "translate-x-full opacity-100"
                  : jurisdiction === "national"
                    ? "translate-x-0 opacity-100"
                    : "translate-x-0 opacity-0"
              }`}
            />
            <button
              type="button"
              onClick={() => setJurisdiction("national")}
              className={`relative z-10 flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
                jurisdiction === "national" ? "text-white" : "text-neu-sub"
              }`}
            >
              India
            </button>
            <button
              type="button"
              onClick={() => setJurisdiction("international")}
              className={`relative z-10 flex-1 rounded-full py-2 text-xs font-semibold transition-colors ${
                jurisdiction === "international" ? "text-white" : "text-neu-sub"
              }`}
            >
              International
            </button>
          </div>
          <Dots
            count={2}
            activeIndex={jurisdiction === "national" ? 0 : jurisdiction === "international" ? 1 : null}
            theme="rose"
          />
        </div>

        {/* Category */}
        <div className="mt-7">
          <div className="flex items-center gap-2.5">
            <IconBadge theme="sage">
              <IconLeaf />
            </IconBadge>
            <div>
              <p className="text-sm font-semibold text-neu-text">Formulation category</p>
              <p className="text-xs text-neu-sub">Optional</p>
            </div>
          </div>

          <div className="mt-3 flex gap-1">
            {FORMULATION_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setCategory((prev) => (prev === c ? null : c))}
                className={`h-2.5 flex-1 rounded-full transition-colors ${
                  category === c ? THEME.sage.fill : "bg-neu-bg shadow-neuInset"
                }`}
                aria-label={c}
                aria-pressed={category === c}
              />
            ))}
          </div>
          <p
            className={`mt-2.5 text-xs font-semibold ${category ? THEME.sage.text : "text-neu-sub"}`}
          >
            {category ?? "None selected"}
          </p>
          <Dots
            count={FORMULATION_CATEGORIES.length}
            activeIndex={category ? FORMULATION_CATEGORIES.indexOf(category as (typeof FORMULATION_CATEGORIES)[number]) : null}
            theme="sage"
          />
        </div>

        {/* Ready */}
        <div className="mt-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <IconBadge theme="amber">
                <IconSend />
              </IconBadge>
              <p className="text-sm font-semibold text-neu-text">Setup progress</p>
            </div>
            <span className={`text-sm font-bold ${jurisdiction ? THEME.amber.text : "text-neu-sub"}`}>
              {readiness}%
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full rounded-full bg-neu-bg shadow-neuInset">
            <div
              className={`h-2.5 rounded-full shadow-neuSm transition-all duration-300 ${THEME.amber.fill}`}
              style={{ width: `${readiness}%` }}
            />
          </div>

          <button
            type="button"
            disabled={!jurisdiction}
            onClick={() => jurisdiction && onStart(jurisdiction, category)}
            className={`mt-5 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-neuSm transition disabled:cursor-not-allowed disabled:opacity-40 ${THEME.amber.fill}`}
          >
            Start asking questions
          </button>
        </div>
      </div>
    </div>
  );
}
