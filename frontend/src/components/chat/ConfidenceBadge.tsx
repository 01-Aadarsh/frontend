import { Check } from "lucide-react";

/**
 * A readable transform of the cross-encoder's rerank score (see
 * API_CONTRACT.md's Citation.confidence) — NOT a calibrated probability of
 * correctness. Wording is tiered rather than always saying "Verified", so a
 * weak match isn't dressed up as a strong one.
 */
export function ConfidenceBadge({ value }: { value: number }) {
  const tier =
    value >= 70
      ? { label: "Verified", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" }
      : value >= 40
        ? { label: "Partial match", tone: "bg-amber-50 text-amber-800 border-amber-200" }
        : { label: "Weak match", tone: "bg-[#022C22]/5 text-[#044E3B]/70 border-[#022C22]/10" };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tier.tone}`}
      title="How closely this passage matches your question — not a guarantee it's fully correct"
    >
      {value >= 70 && <Check size={10} strokeWidth={3} />}
      {tier.label} {value}%
    </span>
  );
}
