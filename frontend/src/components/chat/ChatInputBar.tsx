"use client";

import { Mic, Paperclip, SendHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { Textarea } from "@/components/ui/textarea";

const MAX_CHARS = 2000;

export function ChatInputBar({
  value,
  onChange,
  onSend,
  isLoading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
}) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  const canSend = !isLoading && value.trim().length > 0;

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-white/50 bg-white/90 px-6 py-3 shadow-xl backdrop-blur-xl">
      <button
        type="button"
        disabled
        title="Attachments not yet supported"
        className="shrink-0 cursor-not-allowed text-[#044E3B]/30"
      >
        <Paperclip size={17} />
      </button>
      <button
        type="button"
        disabled
        title="Voice input not yet supported"
        className="shrink-0 cursor-not-allowed text-[#044E3B]/30"
      >
        <Mic size={17} />
      </button>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, MAX_CHARS))}
        onKeyDown={handleKeyDown}
        placeholder="Ask about Ayurveda-related IP or regulatory rules…"
        rows={1}
        disabled={isLoading}
        className="max-h-40 min-h-9 flex-1 resize-none self-center border-none bg-transparent px-0 py-1 text-sm text-[#022C22] shadow-none placeholder:text-[#044E3B]/40 focus-visible:ring-0"
      />
      <motion.button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        aria-label="Consult"
        whileHover={canSend ? { scale: 1.03 } : {}}
        whileTap={canSend ? { scale: 0.96 } : {}}
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-md transition-opacity disabled:cursor-not-allowed disabled:from-stone-300 disabled:to-stone-300 disabled:text-stone-500 disabled:opacity-70"
      >
        Consult
        <SendHorizontal size={15} />
      </motion.button>
    </div>
  );
}
