"use client";

import { useRef, useState } from "react";
import { Paperclip, Mic, Send, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface InputBarProps {
  input: string;
  onInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: React.FormEvent) => void;
  disabled?: boolean;
}

export default function InputBar({ input, onInputChange, onSubmit, disabled }: InputBarProps) {
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
          const blob = new Blob(chunks, { type: "audio/webm" });
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

  return (
    <div className="space-y-2">
      {selectedImage && (
        <div className="flex items-center gap-2 rounded-xl bg-muted/80 p-2 text-sm">
          <Image className="h-4 w-4 text-cyan-200" />
          <span className="flex-1 truncate">{selectedImage.name}</span>
          <button type="button" onClick={() => setSelectedImage(null)} className="rounded-md p-1 hover:bg-background">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />

        <Button type="button" size="icon" variant="ghost" className="shrink-0" disabled={disabled} onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            value={input}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe the symptom, recent change, or error you are seeing..."
            disabled={disabled}
            className="min-h-[60px] max-h-40 resize-none pr-12"
            rows={1}
          />
        </div>

        <Button type="button" size="icon" variant="ghost" className={`shrink-0 ${isRecording ? "text-red-500" : ""}`} disabled={disabled} onClick={handleVoiceRecord}>
          <Mic className="h-5 w-5" />
        </Button>

        <Button
          type="button"
          size="icon"
          className="shrink-0 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600"
          disabled={disabled || (!input.trim() && !selectedImage)}
          onClick={(event) => onSubmit(event as unknown as React.FormEvent)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
