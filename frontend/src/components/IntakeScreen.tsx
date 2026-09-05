"use client";

import { useState } from "react";
import { FORMULATION_CATEGORIES, type Jurisdiction } from "@/lib/types";

type ThemeName = "violet" | "green" | "coral";

const THEME: Record<
  ThemeName,
  {
    badge: string;
    fill: string;
    dot: string;
    text: string;
    ring: string;
  }
> = {
  violet: {
    badge: "bg-gradient-to-br from-violet-400 to-purple-600",
    fill: "bg-gradient-to-r from-violet-400 to-purple-600",
    dot: "bg-violet-500",
    text: "text-purple-600",
    ring: "ring-violet-300",
  },
  green: {
    badge: "bg-gradient-to-br from-emerald-400 to-green-600",
    fill: "bg-gradient-to-r from-emerald-400 to-green-600",
    dot: "bg-emerald-500",
    text: "text-green-600",
    ring: "ring-emerald-300",
  },
  coral: {
    badge: "bg-gradient-to-br from-orange-400 to-rose-500",
    fill: "bg-gradient-to-r from-orange-400 to-rose-500",
    dot: "bg-orange-500",
    text: "text-orange-600",
    ring: "ring-orange-300",
  },
};

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
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
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
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

function AccentMark({ theme, shape }: { theme: ThemeName; shape: "star" | "dot" | "plus" }) {
  const color = THEME[theme].text;
  if (shape === "star") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${color}`}>
        <path d="M12 2l2.2 6.8H21l-5.6 4.1 2.2 6.9L12 15.7 6.4 19.8l2.2-6.9L3 8.8h6.8Z" />
      </svg>
    );
  }
  if (shape === "plus") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={`h-4 w-4 ${color}`}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }
  return <span className={`block h-2.5 w-2.5 rounded-full ${THEME[theme].dot}`} />;
}

function Dots({ count, activeIndex, theme }: { count: number; activeIndex: number | null; theme: ThemeName }) {
  return (
    <div className="mt-3 flex items-center justify-center gap-1.5">
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

function Card({
  theme,
  icon,
  accent,
  title,
  subtitle,
  children,
}: {
  theme: ThemeName;
  icon: React.ReactNode;
  accent: "star" | "dot" | "plus";
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-neu-surface p-6 shadow-neu">
      <div className="flex items-start justify-between">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-neuSm ${THEME[theme].badge}`}>
          {icon}
        </span>
        <AccentMark theme={theme} shape={accent} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-neu-text">{title}</h3>
      <p className="text-xs text-neu-sub">{subtitle}</p>
      <div className="mt-5">{children}</div>
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
    <div className="min-h-screen bg-neu-bg px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-neu-sub">
          Step 0
        </p>
        <h1 className="mt-2 text-2xl font-bold text-neu-text sm:text-3xl">
          IP-SAKTI Sahayak
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-neu-sub">
          Set your jurisdiction and, if you know it, the formulation category —
          both shape which regulatory posture applies.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <Card
            theme="violet"
            icon={<IconGlobe />}
            accent="star"
            title="Jurisdiction"
            subtitle="Required"
          >
            <div className="relative flex rounded-full bg-neu-bg p-1 shadow-neuInset">
              <div
                className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-neuSm transition-all duration-300 ${THEME.violet.fill} ${
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
            <p className={`mt-4 text-xl font-bold ${jurisdiction ? THEME.violet.text : "text-neu-sub"}`}>
              {jurisdiction === "national"
                ? "India"
                : jurisdiction === "international"
                  ? "International"
                  : "Not set"}
            </p>
            <Dots
              count={2}
              activeIndex={jurisdiction === "national" ? 0 : jurisdiction === "international" ? 1 : null}
              theme="violet"
            />
          </Card>

          <Card
            theme="green"
            icon={<IconLeaf />}
            accent="dot"
            title="Category"
            subtitle="Optional"
          >
            <div className="flex gap-1">
              {FORMULATION_CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  title={c}
                  onClick={() => setCategory((prev) => (prev === c ? null : c))}
                  className={`h-2.5 flex-1 rounded-full transition-colors ${
                    category === c ? THEME.green.fill : "bg-neu-bg shadow-neuInset"
                  }`}
                  aria-label={c}
                  aria-pressed={category === c}
                />
              ))}
            </div>
            <p
              className={`mt-4 text-sm font-bold leading-tight ${category ? THEME.green.text : "text-neu-sub"}`}
            >
              {category ?? "None selected"}
            </p>
            <Dots
              count={FORMULATION_CATEGORIES.length}
              activeIndex={category ? FORMULATION_CATEGORIES.indexOf(category as (typeof FORMULATION_CATEGORIES)[number]) : null}
              theme="green"
            />
          </Card>

          <Card
            theme="coral"
            icon={<IconSend />}
            accent="plus"
            title="Ready"
            subtitle="Setup progress"
          >
            <div className="h-2.5 w-full rounded-full bg-neu-bg shadow-neuInset">
              <div
                className={`h-2.5 rounded-full shadow-neuSm transition-all duration-300 ${THEME.coral.fill}`}
                style={{ width: `${readiness}%` }}
              />
            </div>
            <p className={`mt-4 text-xl font-bold ${jurisdiction ? THEME.coral.text : "text-neu-sub"}`}>
              {readiness}%
            </p>
            <Dots count={2} activeIndex={stepsDone > 0 ? stepsDone - 1 : null} theme="coral" />

            <button
              type="button"
              disabled={!jurisdiction}
              onClick={() => jurisdiction && onStart(jurisdiction, category)}
              className={`mt-5 w-full rounded-2xl py-2.5 text-sm font-semibold text-white shadow-neuSm transition disabled:cursor-not-allowed disabled:opacity-40 ${THEME.coral.fill}`}
            >
              Start asking questions
            </button>
          </Card>
        </div>

        <div className="mt-8 grid gap-2 text-xs font-semibold text-neu-sub sm:grid-cols-3">
          <span className="flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" /> Jurisdiction
          </span>
          <span className="flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Category
          </span>
          <span className="flex items-center justify-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Ready
          </span>
        </div>
      </div>
    </div>
  );
}
