import type { Citation, ConversationMessage } from "@/lib/types";
import { CitationCard } from "./CitationCard";
import { AbstentionBanner } from "./AbstentionBanner";

function IconSpeakerPlay() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconStop() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ChatMessageBubble({
  message,
  onViewCitation,
  speaking,
  onToggleSpeak,
  speechSupported,
}: {
  message: ConversationMessage;
  onViewCitation: (citation: Citation) => void;
  speaking: boolean;
  onToggleSpeak: () => void;
  speechSupported: boolean;
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
      <div className="flex items-start gap-2">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
        {!isUser && speechSupported && (
          <button
            type="button"
            onClick={onToggleSpeak}
            title={speaking ? "Stop reading aloud" : "Read this answer aloud"}
            aria-pressed={speaking}
            className={`ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition ${
              speaking
                ? "animate-glowAmber bg-amber-400 text-white"
                : "text-neu-sub hover:bg-neu-bg hover:text-neu-text"
            }`}
          >
            {speaking ? <IconStop /> : <IconSpeakerPlay />}
          </button>
        )}
      </div>

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
