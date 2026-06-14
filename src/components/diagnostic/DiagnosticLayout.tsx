import type { ReactNode } from "react";

interface DiagnosticLayoutProps {
  leftPanel: ReactNode;
  chatPanel: ReactNode;
}

export default function DiagnosticLayout({ leftPanel, chatPanel }: DiagnosticLayoutProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <div className="hidden lg:block">{leftPanel}</div>
      <div>{chatPanel}</div>
    </div>
  );
}
