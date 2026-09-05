"use client";

import { useEffect, useState } from "react";
import { health } from "@/lib/api";
import type { Jurisdiction } from "@/lib/types";

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
    <header className="flex items-center justify-between gap-3 border-b border-clay-200 bg-white px-4 py-3 sm:px-6">
      <div className="min-w-0">
        <p className="truncate font-serif text-base font-semibold text-ink">
          IP-SAKTI Sahayak
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/50">
          <span className="rounded-full bg-forest-50 px-2 py-0.5 font-medium text-forest-700">
            {jurisdiction === "national" ? "India" : "International"}
          </span>
          {category && (
            <span className="rounded-full bg-saffron-100 px-2 py-0.5 font-medium text-saffron-600">
              {category}
            </span>
          )}
          <button
            type="button"
            onClick={onChangeContext}
            className="underline decoration-ink/20 underline-offset-2 hover:text-ink/70"
          >
            Change
          </button>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 text-xs text-ink/50">
        <span
          className={`h-2 w-2 rounded-full ${
            backendUp === null
              ? "bg-clay-200"
              : backendUp
                ? "bg-forest-500"
                : "bg-red-400"
          }`}
        />
        {backendUp === null
          ? "Checking backend..."
          : backendUp
            ? "Backend online"
            : "Backend unreachable"}
      </div>
    </header>
  );
}
