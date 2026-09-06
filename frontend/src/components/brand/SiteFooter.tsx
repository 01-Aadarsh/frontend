"use client";

import { useEffect, useRef, useState } from "react";
import { WhyUseUs } from "./WhyUseUs";

const LINK_CLASSES =
  "font-semibold text-amber-200 underline decoration-amber-200/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white";

export function SiteFooter() {
  const [whyOpen, setWhyOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!whyOpen) return;
    // The panel's full-height text content needs a real layout pass before
    // scrollIntoView measures it correctly -- one rAF after the commit isn't
    // always enough (it undershot/overshot in testing), so wait two.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [whyOpen]);

  const toggleWhy = () => setWhyOpen((v) => !v);

  return (
    <footer className="mt-6 w-full text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs sm:text-sm">
        <button type="button" onClick={toggleWhy} className={LINK_CLASSES}>
          Why use us?
        </button>
        <span aria-hidden className="text-white/40">
          ·
        </span>
        <a href="#" className={LINK_CLASSES}>
          Policy details
        </a>
        <span aria-hidden className="text-white/40">
          ·
        </span>
        <a href="#" className={LINK_CLASSES}>
          Contact us
        </a>
        <span aria-hidden className="text-white/40">
          ·
        </span>
        <a
          href="https://github.com/01-Aadarsh/frontend"
          target="_blank"
          rel="noopener noreferrer"
          className={LINK_CLASSES}
        >
          View source
        </a>
      </div>
      <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-white/50">
        Built for Smart India Hackathon 2026 (SIH26045) under the Ministry
        of AYUSH, Government of India — an open-source student prototype,
        not an officially published government service.
      </p>

      {whyOpen && (
        <div ref={panelRef} className="mt-6 w-full scroll-mt-6">
          <WhyUseUs />
        </div>
      )}
    </footer>
  );
}
