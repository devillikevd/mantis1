"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Paperclip, Mic, Send } from "lucide-react";
import { toast } from "sonner";

interface InputBarProps {
  input: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  disabled?: boolean;
  onImageUpload?: (file: File) => void;
}

export default function InputBar({ input, onInputChange, onSubmit, disabled, onImageUpload }: InputBarProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (input.trim()) {
        onSubmit(event as unknown as React.FormEvent);
      }
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedImage(file);
    toast.success("Image attached for diagnostics");
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);

        const chunks: BlobPart[] = [];
        mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
        mediaRecorder.onstop = () => {
          toast.success("Voice capture is ready for a future AI integration step");
          stream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch {
        toast.error("Microphone access was denied");
      }
    } else {
      toast.info("Voice capture stopped");
      setIsRecording(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative flex items-end gap-2">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <Paperclip className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={handleVoiceRecord}
        disabled={disabled}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <Mic className="h-5 w-5" />
      </button>

      <div className="relative flex-1">
        <textarea
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Describe the issue, type a symptom, or upload a photo..."
          disabled={disabled}
          className="block w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-3.5 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 disabled:opacity-50"
          rows={1}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={disabled || !input.trim()}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500 text-black transition disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </div>
    </form>
  );
}
