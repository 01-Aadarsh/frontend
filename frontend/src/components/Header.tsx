"use client";

import { useEffect, useState } from "react";
import { health } from "@/lib/api";
import type { Jurisdiction } from "@/lib/types";
import { LogoBadge } from "@/components/brand/LogoBadge";
import { FontSizeControl } from "@/components/brand/FontSizeControl";
import { LanguageSwitcher } from "@/components/brand/LanguageSwitcher";

export function Header({
  jurisdiction,
  category,
  onChangeContext,
}: {
  jurisdiction: Jurisdiction;
  category: string | null;
  onChangeContext: () => void;
}) {
  const [backendUp, setBackendUp] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const check = () => health().then((ok) => !cancelled && setBackendUp(ok));
    check();
    const interval = setInterval(check, 20_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="shrink-0 border-b border-neu-bg">
      <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <LogoBadge className="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />
          <button
            type="button"
            onClick={onChangeContext}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-neu-text shadow-neuSm transition hover:bg-neu-bg"
          >
            <span aria-hidden>←</span> Back to setup
          </button>

          <div className="min-w-0 border-l border-neu-bg pl-3">
            <p className="truncate text-base font-bold text-neu-text">
              IP-SAKTI Sahayak
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

        <div className="flex shrink-0 items-center gap-2">
          <FontSizeControl />
          <LanguageSwitcher />
          <div className="flex items-center gap-1.5 text-xs text-neu-sub">
            <span
              className={`h-2 w-2 rounded-full ${
                backendUp === null
                  ? "bg-neu-bg"
                  : backendUp
                    ? "bg-emerald-500"
                    : "bg-red-400"
              }`}
            />
            <span className="sr-only sm:not-sr-only">
              {backendUp === null
                ? "Checking backend..."
                : backendUp
                  ? "Backend online"
                  : "Backend unreachable"}
            </span>
          </div>
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
