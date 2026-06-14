"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/layout/ThemeToggle";
import LanguageToggle from "@/components/layout/LanguageToggle";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/products", label: "Marketplace" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => setIsScrolled(latest > 50));
  }, [scrollY]);

  return (
    <>
      <motion.nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled && "border-b border-white/10 bg-background/80 backdrop-blur-xl",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-lg font-black text-white shadow-lg shadow-indigo-500/30">M</div>
            <span className="font-display text-xl font-black tracking-[0.2em] text-white">MANTIS</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition hover:text-foreground">{link.label}</Link>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/register"><Button size="sm" className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600">Get Started</Button></Link>
          </div>

          <button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 top-16 z-40 bg-background/95 p-6 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl border border-white/10 bg-white/5 p-3 text-lg font-medium text-foreground">{link.label}</Link>
            ))}
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Link href="/register" onClick={() => setOpen(false)}><Button className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500">Get Started</Button></Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
