export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const tone =
    confidence >= 75
      ? "bg-forest-50 text-forest-700 border-forest-100"
      : confidence >= 45
        ? "bg-saffron-100 text-saffron-600 border-saffron-300/60"
        : "bg-clay-50 text-ink/60 border-clay-200";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium tabular-nums ${tone}`}
      title="Relevance score from the reranker — not a calibrated accuracy figure."
    >
      {confidence}% match
    </span>
  );
}
