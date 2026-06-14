"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import type { Message } from "@/types";
import MessageBubble from "./Message";
import InputBar from "./InputBar";
import TypingIndicator from "./TypingIndicator";
import ImageScanner from "./ImageScanner";

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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const lastSpokenMessageId = useRef<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isVoiceEnabled || messages.length === 0) {
      window.speechSynthesis.cancel();
      return;
    }

    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role === "assistant" && latestMessage.id !== lastSpokenMessageId.current && !isLoading) {
      const utterance = new SpeechSynthesisUtterance(latestMessage.content.replace(/[*#]/g, ""));
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Google US English"));
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
      lastSpokenMessageId.current = latestMessage.id;
    }
  }, [messages, isVoiceEnabled, isLoading]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setScannedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScannerComplete = () => {
    setScannedImage(null);
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    // We mock submitting the extracted image data as text to trigger AI
    onInputChange({ target: { value: "[IMAGE SCANNED: Structural damage detected on mounting bracket]" } } as any);
    onSubmit(mockEvent);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-background/70 shadow-2xl shadow-black/10 relative">
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
          className={`p-2 rounded-full border transition-colors ${isVoiceEnabled ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'}`}
          title={isVoiceEnabled ? "Voice Output On" : "Voice Output Off"}
        >
          {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-6 pt-16">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex h-full min-h-[320px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-2xl shadow-[0_0_30px_rgba(99,102,241,0.5)]">🤖</div>
                <h3 className="text-2xl font-black text-white">Hi! I’m your {productName} assistant</h3>
                <p className="mt-3 text-muted-foreground">Describe the issue, upload an image, or share what changed recently. I’ll guide the next best troubleshooting step.</p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about the symptom and when it happens</li>
                  <li>• Use the attachment pin to upload hardware images for scanning</li>
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
        <InputBar input={input} onInputChange={onInputChange} onSubmit={onSubmit} disabled={isLoading} onImageUpload={handleImageUpload} />
      </div>

      {scannedImage && (
        <ImageScanner
          image={scannedImage}
          onComplete={handleScannerComplete}
          onCancel={() => setScannedImage(null)}
        />
      )}
    </div>
  );
}
