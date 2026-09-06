export function LeafGlyph({ className = "h-6 w-6 text-emerald-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
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

export function LogoBadge({
  className = "h-14 w-14",
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B1A16] to-[#173C30] shadow-[0_0_18px_rgba(52,211,153,0.35)] ${className}`}
    >
      <LeafGlyph className={iconClassName} />
    </span>
  );
}
