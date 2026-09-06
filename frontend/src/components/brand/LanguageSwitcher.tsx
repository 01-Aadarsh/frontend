"use client";

import { useState } from "react";

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

export function LanguageSwitcher() {
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
