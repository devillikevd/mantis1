"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Message } from "@/types";
import MessageBubble from "./Message";
import InputBar from "./InputBar";
import TypingIndicator from "./TypingIndicator";

interface ChatPanelProps {
  messages: Message[];
  input: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  productName: string;
  isLoading?: boolean;
}

export default function ChatPanel({ messages, input, onInputChange, onSubmit, productName, isLoading = false }: ChatPanelProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background/70 shadow-2xl shadow-black/10">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex h-full min-h-[320px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-2xl">🤖</div>
                <h3 className="text-2xl font-black text-white">Hi! I’m your {productName} diagnostic assistant</h3>
                <p className="mt-3 text-muted-foreground">Describe the issue, upload an image, or share what changed recently. I’ll guide the next best troubleshooting step.</p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about the symptom and when it happens</li>
                  <li>• Include any error codes, noises, or thermal behavior</li>
                  <li>• I’ll summarize the likely cause and next checks</li>
                </ul>
              </div>
            </motion.div>
          ) : (
            messages.map((message, index) => (
              <motion.div key={message.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <MessageBubble message={message} />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      <div className="border-t border-border bg-background/80 p-4">
        <InputBar input={input} onInputChange={onInputChange} onSubmit={onSubmit} disabled={isLoading} />
      </div>
    </div>
  );
}
