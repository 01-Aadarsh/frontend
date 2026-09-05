"use client";

import { useState } from "react";
import {
  Globe,
  Landmark,
  Shield,
  Wand2,
  UserCheck,
  ScrollText,
  X,
  BookOpen,
  Award,
  FlaskConical,
  Sprout,
  Apple,
  Sparkles,
} from "lucide-react";
import { CATEGORIES, type Category, type Jurisdiction } from "@/lib/api";

const ICONS: Record<Category, typeof BookOpen> = {
  "classical medicine": BookOpen,
  "patent-or-proprietary medicine": Award,
  "new or non-classical drug": FlaskConical,
  phytopharmaceutical: Sprout,
  "Ayurveda-Aahar / nutraceutical": Apple,
  cosmetic: Sparkles,
};

/**
 * Top-nav workstation header — supersedes the old full-screen Step 0 intake
 * gate. Jurisdiction and formulation category are still decided before (or
 * alongside) asking a question, per the PS, but now as a persistent strip
 * rather than a blocking screen: less friction, always editable, never
 * silently dropped.
 *
 * Frosted-glass panel per the botanical-glassmorphism redesign — floats
 * above the matcha canvas rather than sitting as flat opaque white.
 */
export function AyushHeader({
  jurisdiction,
  onChangeJurisdiction,
  category,
  onSelectCategory,
  onClearCategory,
}: {
  jurisdiction: Jurisdiction;
  onChangeJurisdiction: (j: Jurisdiction) => void;
  category: Category | null;
  onSelectCategory: (cat: Category) => void;
  onClearCategory: () => void;
}) {
  const [hindiNotice, setHindiNotice] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 shadow-[0_4px_24px_rgba(2,44,34,0.04)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800 text-amber-400 shadow-md">
            <Shield className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-heading text-lg font-bold tracking-tight text-[#022C22]">
                IP-SAKTI Sahayak
              </span>
              <span className="shrink-0 rounded border border-emerald-300/60 bg-emerald-100/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-800 backdrop-blur-sm">
                AYUSH · AIIA
              </span>
            </div>
            <p className="truncate text-xs text-[#044E3B]/70">
              AIIA Regulatory &amp; IPR Copilot
            </p>
          </div>
        </div>

        {/* Mandatory jurisdiction toggle */}
        <div className="hidden items-center gap-1 rounded-xl border border-white/60 bg-white/50 p-1 shadow-sm backdrop-blur-md sm:flex">
          <button
            onClick={() => onChangeJurisdiction("national")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              jurisdiction === "national"
                ? "bg-emerald-800 text-white shadow-sm"
                : "text-[#044E3B]/70 hover:text-[#022C22]"
            }`}
          >
            <Landmark className="h-3.5 w-3.5" />
            National (India)
          </button>
          <button
            onClick={() => onChangeJurisdiction("international")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              jurisdiction === "international"
                ? "bg-amber-700 text-white shadow-sm"
                : "text-[#044E3B]/70 hover:text-[#022C22]"
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            International
          </button>
        </div>

        {/* Action controls */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setHindiNotice((v) => !v)}
              title="Hindi (Bhashini) support is in progress — not available yet"
              className="rounded-md border border-white/60 bg-white/50 px-2.5 py-1 text-xs font-medium text-[#044E3B]/70 backdrop-blur-md transition-colors hover:bg-white/70"
            >
              English | हिंदी
            </button>
            {hindiNotice && (
              <div className="absolute right-0 top-full z-30 mt-1.5 w-52 rounded-lg border border-white/60 bg-white/90 p-2.5 text-[11px] text-[#044E3B]/70 shadow-lg backdrop-blur-xl">
                Hindi (Bhashini) support is being integrated and isn&apos;t
                available yet — English only for now.
              </div>
            )}
          </div>
          <a
            href="mailto:contact@ip-sakti.example?subject=IP%20facilitator%20request"
            className="flex items-center gap-1.5 rounded-lg border border-emerald-300/60 bg-emerald-50/70 px-3 py-1.5 text-xs font-medium text-emerald-800 backdrop-blur-md transition-colors hover:bg-emerald-100/80"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Escalate to Human IP Facilitator</span>
            <span className="md:hidden">Facilitator</span>
          </a>
        </div>
      </div>

      {/* Mobile jurisdiction toggle (below the fold of the row above) */}
      <div className="flex items-center gap-1 border-t border-white/40 px-4 py-2 sm:hidden">
        <button
          onClick={() => onChangeJurisdiction("national")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
            jurisdiction === "national"
              ? "bg-emerald-800 text-white"
              : "border border-white/60 bg-white/40 text-[#044E3B]/70"
          }`}
        >
          <Landmark className="h-3.5 w-3.5" />
          National
        </button>
        <button
          onClick={() => onChangeJurisdiction("international")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
            jurisdiction === "international"
              ? "bg-amber-700 text-white"
              : "border border-white/60 bg-white/40 text-[#044E3B]/70"
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          International
        </button>
      </div>

      {/* Formulation classifier strip — premium glass "cards" per category */}
      <div className="border-t border-white/40 px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs">
          <span className="flex shrink-0 items-center gap-1 whitespace-nowrap font-semibold text-[#044E3B]/70">
            <Wand2 className="h-3 w-3 text-amber-600" />
            Classify Formulation:
          </span>
          {CATEGORIES.map((cat) => {
            const active = category === cat.value;
            const Icon = ICONS[cat.value];
            return (
              <button
                key={cat.value}
                onClick={() => (active ? onClearCategory() : onSelectCategory(cat.value))}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl border px-3 py-1.5 shadow-sm transition-all duration-300 ${
                  active
                    ? "border-emerald-500 bg-emerald-800 text-white shadow-md"
                    : "border-white/60 bg-white/80 text-[#022C22] backdrop-blur-md hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-md"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? "text-emerald-200" : "text-emerald-700"}`} />
                <span className="font-medium">{cat.label}</span>
                <span className={active ? "text-emerald-200" : "text-[#044E3B]/60"}>
                  ({cat.hint})
                </span>
                {active && <X className="h-3 w-3" />}
              </button>
            );
          })}
          {category === "classical medicine" && (
            <a
              href="https://tkdl.res.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex shrink-0 items-center gap-1 whitespace-nowrap text-amber-700 hover:underline"
            >
              <ScrollText className="h-3 w-3" />
              Check TKDL for prior art
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
