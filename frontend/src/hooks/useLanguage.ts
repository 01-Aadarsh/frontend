"use client";

import { useCallback, useEffect, useState } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", bcp47: "en-IN" },
  { code: "hi", label: "हिन्दी", bcp47: "hi-IN" },
  { code: "mr", label: "मराठी", bcp47: "mr-IN" },
  { code: "ta", label: "தமிழ்", bcp47: "ta-IN" },
  { code: "te", label: "తెలుగు", bcp47: "te-IN" },
  { code: "bn", label: "বাংলা", bcp47: "bn-IN" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

const STORAGE_KEY = "ipsakti:language";
const DEFAULT_CODE: LanguageCode = "en";

function readStoredCode(): LanguageCode {
  if (typeof window === "undefined") return DEFAULT_CODE;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return LANGUAGES.find((l) => l.code === raw)?.code ?? DEFAULT_CODE;
}

/** Site-wide selected language, persisted across visits/pages. Drives the
 * BCP-47 locale used for voice input/output; full answer translation
 * (Bhashini/Sarvam) isn't wired up yet. */
export function useLanguage() {
  const [code, setCode] = useState<LanguageCode>(DEFAULT_CODE);

  useEffect(() => {
    setCode(readStoredCode());
  }, []);

  const setLanguage = useCallback((next: LanguageCode) => {
    setCode(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode, etc.) — selection still applies for this session.
    }
  }, []);

  const language = LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];

  return { language, setLanguage };
}
