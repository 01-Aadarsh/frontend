"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Leaf, TriangleAlert } from "lucide-react";
import { ChatMessage, type Message } from "@/components/chat/ChatMessage";
import { RetrievalIndicator } from "@/components/chat/RetrievalIndicator";
import { ChatInputBar } from "@/components/chat/ChatInputBar";
import { SourceViewer } from "@/components/chat/SourceViewer";
import { AyushHeader } from "@/components/layout/AyushHeader";
import {
  ApiError,
  postQuery,
  CATEGORIES,
  type Citation,
  type ChatTurn,
  type Jurisdiction,
  type Category,
} from "@/lib/api";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `id-${idCounter}`;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>("national");
  const [category, setCategory] = useState<Category | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSend(overrideQuestion?: string) {
    const question = (overrideQuestion ?? input).trim();
    if (!question || isLoading) return;

    const historyTurns: ChatTurn[] = messages
      .filter((m) => !m.isError)
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: question },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await postQuery(question, historyTurns, {
        jurisdiction,
        category,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: res.answer,
          citations: res.citations,
          abstained: res.flags.abstained,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Something went wrong reaching the backend.";
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: message, isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Classifier-strip pills populate a guided, corpus-tuned question rather
   * than firing it immediately — a deliberate change from the old Step 0
   * gate, which auto-sent on selection. This is now a persistent, editable
   * strip, not a one-shot decision, so the user reviews/edits before
   * sending.
   */
  function handleSelectCategory(cat: Category) {
    setCategory(cat);
    const meta = CATEGORIES.find((c) => c.value === cat);
    setInput(meta?.postureQuery ?? `IP posture for ${cat}`);
  }

  return (
    <div className="flex h-dvh flex-col bg-[#E8EDE7]">
      <AyushHeader
        jurisdiction={jurisdiction}
        onChangeJurisdiction={setJurisdiction}
        category={category}
        onSelectCategory={handleSelectCategory}
        onClearCategory={() => setCategory(null)}
      />

      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6">
          {messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
              {messages.map((m) => (
                <ChatMessage
                  key={m.id}
                  message={m}
                  onOpenSource={setActiveCitation}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <RetrievalIndicator />
                </div>
              )}
              <div ref={scrollAnchorRef} />
            </div>
          )}
        </main>

        <SourceViewer
          citation={activeCitation}
          onClose={() => setActiveCitation(null)}
        />
      </div>

      {/* Floating footer — the consult input floats above the matcha canvas,
          no opaque bar behind it — plus the official disclaimer just above. */}
      <footer className="px-4 pb-5 pt-2 sm:px-6">
        <p className="mx-auto mb-2 flex max-w-3xl items-center gap-1.5 text-[11px] text-[#044E3B]/70">
          <TriangleAlert size={12} className="shrink-0 text-amber-700" />
          Official Notice: Provides regulatory information based on indexed
          gazettes, not legal counsel.
        </p>
        <ChatInputBar
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          isLoading={isLoading}
        />
      </footer>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-3 text-center"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-100"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/70 shadow-sm ring-1 ring-white/60 backdrop-blur-md">
          <Leaf size={22} className="text-emerald-700" />
        </div>
      </div>
      <h2 className="font-heading text-lg font-semibold text-[#022C22]">
        Ask a question, or classify your formulation above
      </h2>
      <p className="text-xs text-[#044E3B]/70">
        e.g. &ldquo;What does Section 3(p) say about traditional
        knowledge?&rdquo; or &ldquo;What are the GI registration requirements
        for Ayurvedic products?&rdquo;
      </p>
    </motion.div>
  );
}
