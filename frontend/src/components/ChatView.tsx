"use client";

import { useRef, useState } from "react";
import { ApiError, ClientTimeoutError, query } from "@/lib/api";
import type {
  ChatTurn,
  Citation,
  ConversationMessage,
  Jurisdiction,
} from "@/lib/types";
import { PAGE_BG } from "@/lib/theme";
import { LeafField } from "@/components/brand/LeafField";
import { Header } from "./Header";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { LoadingState } from "./LoadingState";
import { SourceViewer } from "./SourceViewer";

let idCounter = 0;
const nextId = () => `msg-${++idCounter}-${Date.now()}`;

export function ChatView({
  jurisdiction,
  category,
  onChangeContext,
}: {
  jurisdiction: Jurisdiction;
  category: string | null;
  onChangeContext: () => void;
}) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  async function handleSend() {
    const question = input.trim();
    if (!question || sending) return;

    const history: ChatTurn[] = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: question },
    ]);
    setInput("");
    setSending(true);
    scrollToBottom();

    try {
      const res = await query({ question, history, jurisdiction, category });
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: res.answer,
          citations: res.citations,
          flags: res.flags,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof ClientTimeoutError
          ? err.message
          : "Something went wrong talking to the backend.";
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: "", error: message },
      ]);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  }

  return (
    <div className={`relative flex h-screen flex-col overflow-hidden p-3 sm:p-6 ${PAGE_BG}`}>
      <LeafField />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[32px] bg-neu-surface shadow-2xl">
        <Header
          jurisdiction={jurisdiction}
          category={category}
          onChangeContext={onChangeContext}
        />

        <div className="flex min-h-0 flex-1">
          <div className="flex min-h-0 flex-1 flex-col">
            {messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center px-4">
                <div className="w-full max-w-2xl text-center">
                  <p className="text-lg font-semibold text-neu-text">
                    Ask about IP, ABS, or regulatory posture for an Ayurvedic
                    formulation
                  </p>
                  <p className="mx-auto mt-1.5 max-w-md text-sm text-neu-sub">
                    The answer will cite exactly which document and page it
                    came from, or say plainly that it couldn&apos;t find one.
                  </p>
                  <div className="mt-6">
                    <ChatComposer
                      input={input}
                      onInputChange={setInput}
                      onSend={handleSend}
                      sending={sending}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-neu-sub">
                    Answers can take up to ~60s — grounded, cited responses
                    are slower than a guess.
                  </p>
                </div>
              </div>
            ) : (
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6 sm:px-8"
              >
                <div className="mx-auto flex w-full max-w-2xl flex-col space-y-4">
                  {messages.map((m) => (
                    <ChatMessageBubble
                      key={m.id}
                      message={m}
                      onViewCitation={setActiveCitation}
                    />
                  ))}
                  {sending && <LoadingState />}
                </div>
              </div>
            )}
          </div>

          <aside className="hidden w-[420px] shrink-0 border-l border-neu-bg bg-neu-surface lg:block">
            <SourceViewer
              citation={activeCitation}
              onClose={() => setActiveCitation(null)}
            />
          </aside>
        </div>

        {messages.length > 0 && (
          <div className="shrink-0 border-t border-neu-bg px-4 py-3 sm:px-8">
            <div className="mx-auto w-full max-w-2xl">
              <ChatComposer
                input={input}
                onInputChange={setInput}
                onSend={handleSend}
                sending={sending}
              />
            </div>
            <p className="mx-auto mt-1.5 max-w-2xl text-center text-[11px] text-neu-sub">
              Answers can take up to ~60s — grounded, cited responses are
              slower than a guess.
            </p>
          </div>
        )}
      </div>

      {activeCitation && (
        <div className="fixed inset-0 z-20 flex flex-col bg-neu-surface lg:hidden">
          <SourceViewer
            citation={activeCitation}
            onClose={() => setActiveCitation(null)}
          />
        </div>
      )}
    </div>
  );
}
