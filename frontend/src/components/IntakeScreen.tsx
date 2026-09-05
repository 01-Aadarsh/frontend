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

function Leaf({ className, color }: { className: string; color: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden>
      <path
        d="M50 4C20 26 6 66 50 136 94 66 80 26 50 4Z"
        fill={color}
      />
      <path
        d="M50 16C50 50 50 92 50 122"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M50 45 L34 36M50 45 L66 36M50 75 L32 68M50 75 L68 68M50 100 L36 95M50 100 L64 95"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

function LeafField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <Leaf
        className="absolute -top-10 left-[4%] h-44 w-44 -rotate-[18deg] opacity-90"
        color="#274A34"
      />
      <Leaf
        className="absolute -top-6 left-[16%] h-24 w-24 rotate-[28deg] opacity-80"
        color="#7A4A2A"
      />
      <Leaf
        className="absolute -top-14 right-[8%] h-52 w-52 rotate-[155deg] opacity-90"
        color="#3C6B48"
      />
      <Leaf
        className="absolute top-10 right-[24%] h-20 w-20 -rotate-[35deg] opacity-70"
        color="#8A5A32"
      />
      <Leaf
        className="absolute bottom-[6%] left-[2%] h-56 w-56 rotate-[200deg] opacity-80"
        color="#1F4536"
      />
      <Leaf
        className="absolute bottom-8 right-[4%] h-40 w-40 -rotate-[60deg] opacity-75"
        color="#6B4226"
      />
      <Leaf
        className="absolute top-[42%] -left-10 h-32 w-32 rotate-[95deg] opacity-60"
        color="#4C7A54"
      />
      <Leaf
        className="absolute bottom-[28%] -right-8 h-36 w-36 rotate-[110deg] opacity-60"
        color="#5C3620"
      />
    </div>
  );
}

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

function LeafGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-emerald-400">
      <path
        d="M11 20a7 7 0 0 1-1.2-13.9C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoBadge() {
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1A16] to-[#173C30] shadow-[0_0_18px_rgba(52,211,153,0.35)]">
      <LeafGlyph />
    </span>
  );
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
] as const;

function IconTranslate() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-neu-text">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 12h16M12 4c2.2 2.2 2.2 13.8 0 16M12 4c-2.2 2.2-2.2 13.8 0 16"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<(typeof LANGUAGES)[number]>(LANGUAGES[0]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1.5 text-xs font-semibold text-neu-text shadow-neuSm"
      >
        <IconTranslate />
        {lang.code.toUpperCase()}
        <span className={`text-[10px] text-neu-sub transition-transform ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-44 rounded-2xl bg-neu-surface p-1.5 shadow-neu">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors ${
                lang.code === l.code ? "bg-neu-bg text-neu-text" : "text-neu-sub hover:bg-neu-bg/60"
              }`}
            >
              {l.label}
              {lang.code === l.code && <span>✓</span>}
            </button>
          ))}
          <p className="mt-1 border-t border-neu-bg px-3 pt-2 text-[10px] leading-snug text-neu-sub">
            Powered by Bhashini / Sarvam — full answer translation coming soon.
          </p>
        </div>
      )}
    </div>
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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const stepsDone = (jurisdiction ? 1 : 0) + (category ? 1 : 0);
  const readiness = jurisdiction ? Math.round((stepsDone / 2) * 100) : 0;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0D2B22] via-[#1F4536] to-[#6E4A2A] px-4 py-12">
      <LeafField />
      <div className="relative z-10 w-full max-w-xl rounded-[32px] bg-neu-surface p-8 shadow-2xl sm:p-10">
        <div className="flex items-start justify-between">
          <LogoBadge />
          <LanguageSwitcher />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-neu-text sm:text-3xl">
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

          <div className="mt-3 flex items-center gap-1">
            {FORMULATION_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                title={c}
                onClick={() => setCategory((prev) => (prev === c ? null : c))}
                onMouseEnter={() => setHoveredCategory(c)}
                onMouseLeave={() => setHoveredCategory(null)}
                onFocus={() => setHoveredCategory(c)}
                onBlur={() => setHoveredCategory(null)}
                className={`flex-1 rounded-full transition-all duration-200 ${
                  category === c
                    ? `h-4 ${THEME.sage.fill}`
                    : hoveredCategory === c
                      ? "h-3.5 bg-neu-bg shadow-neuInset"
                      : "h-2.5 bg-neu-bg shadow-neuInset"
                }`}
                aria-label={c}
                aria-pressed={category === c}
              />
            ))}
          </div>
          <p
            className={`mt-2.5 text-xs font-semibold transition-colors ${
              hoveredCategory
                ? "italic text-neu-sub"
                : category
                  ? THEME.sage.text
                  : "text-neu-sub"
            }`}
          >
            {hoveredCategory ? `Preview: ${hoveredCategory}` : (category ?? "None selected")}
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
