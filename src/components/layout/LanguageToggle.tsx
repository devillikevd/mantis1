"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LanguageToggle() {
  return (
    <Button variant="ghost" size="icon" aria-label="Choose language" className="rounded-full">
      <Languages className="h-4 w-4" />
    </Button>
  );
}
