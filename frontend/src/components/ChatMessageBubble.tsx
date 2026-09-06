import type { Citation, ConversationMessage } from "@/lib/types";
import { CitationCard } from "./CitationCard";
import { AbstentionBanner } from "./AbstentionBanner";

export function ChatMessageBubble({
  message,
  onViewCitation,
}: {
  message: ConversationMessage;
  onViewCitation: (citation: Citation) => void;
}) {
  const isUser = message.role === "user";

  if (message.error) {
    return (
      <div className="max-w-[85%] animate-fadeIn rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-panel">
        <p className="font-medium">The backend couldn&apos;t answer that.</p>
        <p className="mt-1 text-red-600/90">{message.error}</p>
      </div>
    );
  }

  return (
    <div
      className={`max-w-[85%] animate-fadeIn rounded-2xl px-4 py-3 shadow-neuSm ${
        isUser
          ? "ml-auto bg-gradient-to-r from-rose-300 to-orange-400 text-white"
          : "border border-neu-bg bg-white/70 text-neu-text"
      }`}
    >
      <p className="whitespace-pre-wrap text-sm leading-relaxed">
        {message.content}
      </p>

      {!isUser && message.flags?.abstained && <AbstentionBanner />}

      {!isUser &&
        !message.flags?.abstained &&
        message.citations &&
        message.citations.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-neu-bg pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-neu-sub">
              Sources
            </p>
            {message.citations.map((c, i) => (
              <CitationCard
                key={c.chunk_id}
                citation={c}
                index={i}
                onView={onViewCitation}
              />
            ))}
          </div>
        )}
    </div>
  );
}
