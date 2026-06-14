"use client";

import type { Message as ChatMessage } from "@/types";

interface MessageProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[85%] rounded-3xl border px-4 py-3 shadow-lg shadow-black/10 ${
          isUser
            ? "border-indigo-500/40 bg-indigo-500/10 text-white"
            : "border-border bg-background/90 text-foreground"
        }`}
      >
        <div className="text-[11px] uppercase tracking-[0.35em] text-muted-foreground">{isUser ? "You" : "MANTIS"}</div>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{message.content}</p>
      </article>
    </div>
  );
}
