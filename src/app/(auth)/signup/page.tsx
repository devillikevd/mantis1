"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DiagnosticOrb = dynamic(() => import("@/components/three/DiagnosticOrb"), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-3xl border border-border bg-background/70 animate-pulse" />,
});

const floatingDots = Array.from({ length: 18 }, (_, index) => ({
  left: `${(index * 13 + 9) % 100}%`,
  top: `${(index * 17 + 4) % 100}%`,
  delay: `${(index * 0.18).toFixed(2)}s`,
}));

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [website, setWebsite] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const preferredRole = params.get("role")?.toUpperCase();

    if (preferredRole === "COMPANY" || preferredRole === "PARTNER" || preferredRole === "USER") {
      setRole(preferredRole);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          companyName: role === "COMPANY" ? companyName : undefined,
          gstNumber: role === "COMPANY" ? gstNumber : undefined,
          website: role === "COMPANY" ? website : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create your account right now.");
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error("Account created, but sign-in failed. Please try logging in manually.");
      }

      toast.success("Account created successfully");
      router.push("/products");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong while creating your account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      <div className="hidden lg:flex lg:col-span-2 bg-linear-to-br from-indigo-500/10 via-background to-cyan-500/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {floatingDots.map((dot, index) => (
            <div
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-400 animate-float"
              style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <Link href="/" className="mb-12 flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-indigo-500 to-cyan-500">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <span className="font-display text-2xl gradient-text">MANTIS</span>
          </Link>

          <div className="mb-8 h-64">
            <DiagnosticOrb />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-background/70 p-6 shadow-2xl shadow-indigo-500/10"
          >
            <p className="mb-4 text-lg">Create a real workspace for your company, partner team, or personal diagnostics.</p>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Fast onboarding, real AI diagnostics, and secure account access.</span>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">Start with a real account — no placeholder demo path required.</div>
      </div>

      <div className="flex items-center justify-center p-8 lg:col-span-3">
        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">Set up your real workspace and get started with Mantis in minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-border bg-background/80 p-6 shadow-2xl shadow-indigo-500/10">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={name} onChange={(event) => setName(event.target.value)} required disabled={isLoading} className="mt-1" placeholder="Asha Mehta" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isLoading} className="mt-1" placeholder="you@company.com" />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={isLoading} className="mt-1" placeholder="At least 6 characters" />
            </div>

            <div>
              <Label htmlFor="role">Account type</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger id="role" className="mt-1">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">Individual user</SelectItem>
                  <SelectItem value="COMPANY">Company</SelectItem>
                  <SelectItem value="PARTNER">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {role === "COMPANY" && (
              <div className="grid gap-4 rounded-2xl border border-border bg-background/70 p-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input id="companyName" value={companyName} onChange={(event) => setCompanyName(event.target.value)} disabled={isLoading} className="mt-1" placeholder="Acme Diagnostics" />
                </div>
                <div>
                  <Label htmlFor="gstNumber">GST / Tax ID</Label>
                  <Input id="gstNumber" value={gstNumber} onChange={(event) => setGstNumber(event.target.value)} disabled={isLoading} className="mt-1" placeholder="Optional" />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" value={website} onChange={(event) => setWebsite(event.target.value)} disabled={isLoading} className="mt-1" placeholder="https://example.com" />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-linear-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600" size="lg" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <UserRound className="h-4 w-4 text-cyan-400" />
              <span>Already have an account?</span>
            </div>
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">Sign in</Link>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4 text-sm text-muted-foreground">
            <div className="mb-2 flex items-center space-x-2">
              <Briefcase className="h-4 w-4 text-cyan-400" />
              <span className="font-semibold text-foreground">Why this works</span>
            </div>
            <ul className="space-y-1">
              <li>• Real account creation via the existing signup API.</li>
              <li>• Automatic sign-in after registration.</li>
              <li>• Company details are saved when you select the company role.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
