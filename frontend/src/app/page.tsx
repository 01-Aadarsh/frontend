"use client";

import { useState } from "react";
import { IntakeScreen } from "@/components/IntakeScreen";
import { ChatView } from "@/components/ChatView";
import type { Jurisdiction } from "@/lib/types";

interface IntakeContext {
  jurisdiction: Jurisdiction;
  category: string | null;
}

export default function Home() {
  const [context, setContext] = useState<IntakeContext | null>(null);

  if (!context) {
    return (
      <IntakeScreen
        onStart={(jurisdiction, category) =>
          setContext({ jurisdiction, category })
        }
      />
    );
  }

  return (
    <ChatView
      jurisdiction={context.jurisdiction}
      category={context.category}
      onChangeContext={() => setContext(null)}
    />
  );
}
