"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-3xl border border-border bg-background/90 p-4 text-sm text-muted-foreground">
      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:120ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400 [animation-delay:240ms]" />
      <span className="ml-2">MANTIS is analyzing the symptom pattern...</span>
    </div>
  );
}
