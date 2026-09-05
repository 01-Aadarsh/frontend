"use client";

import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import { AlertCircle } from "lucide-react";
import type { Citation } from "@/lib/api";
import { SourcesList } from "@/components/chat/SourcesList";
import { AbstentionBanner } from "@/components/chat/AbstentionBanner";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  abstained?: boolean;
  isError?: boolean;
}

const entrance = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: "spring" as const, stiffness: 380, damping: 32 },
};

export function ChatMessage({
  message,
  onOpenSource,
}: {
  message: Message;
  onOpenSource: (citation: Citation) => void;
}) {
  if (message.role === "user") {
    return (
      <motion.div {...entrance} className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-emerald-700 px-4 py-2.5 text-sm text-white shadow-md sm:max-w-[70%]">
          {message.content}
        </div>
      </motion.div>
    );
  }

  if (message.isError) {
    return (
      <motion.div {...entrance} className="flex justify-start">
        <div className="flex max-w-[85%] items-start gap-2 rounded-2xl rounded-tl-sm border border-red-200/70 bg-red-50/90 px-4 py-3 shadow-sm backdrop-blur-md sm:max-w-[75%]">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  if (message.abstained) {
    return (
      <motion.div {...entrance} className="flex justify-start">
        <AbstentionBanner content={message.content} />
      </motion.div>
    );
  }

  return (
    <motion.div {...entrance} className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-white/50 bg-white/90 px-4 py-3.5 text-[#022C22] shadow-sm backdrop-blur-md sm:max-w-[75%]">
        <div className="prose prose-sm max-w-none text-[#022C22] prose-p:text-[#022C22] prose-headings:text-[#022C22] prose-strong:text-[#022C22] prose-code:text-emerald-700">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {message.citations && (
          <SourcesList
            citations={message.citations}
            onOpenSource={onOpenSource}
          />
        )}
      </div>
    </motion.div>
  );
}
