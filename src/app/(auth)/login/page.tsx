"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowRight, Chrome, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const DiagnosticOrb = dynamic(() => import("@/components/three/DiagnosticOrb"), {
  ssr: false,
  loading: () => <div className="h-64 w-full rounded-3xl border border-border bg-background/70 animate-pulse" />,
});

const testimonials = [
  {
    text: "Mantis reduced our support tickets by 73%. Our customers love getting instant answers.",
    author: "Rajesh Kumar",
    role: "CTO, Honda India",
    avatar: "🏍️",
  },
  {
    text: "We uploaded our manuals and within hours, our entire product line had AI support. Game changer.",
    author: "Sarah Lee",
    role: "Product Manager, Samsung",
    avatar: "📱",
  },
  {
    text: "The diagnostic accuracy is incredible. It's like having a senior technician available 24/7.",
    author: "Michael Chen",
    role: "Service Head, Bosch",
    avatar: "🔧",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@company.com");
  const [password, setPassword] = useState("demo123");
  const [isLoading, setIsLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDemoLogin = async () => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: "demo@company.com",
        password: "demo123",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Demo login is unavailable right now");
        return;
      }

      toast.success("Demo session ready");
      router.push("/products");
    } catch {
      toast.error("Unable to start demo session");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/products");
      }
    } catch {
      toast.error("Something went wrong while signing in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-5">
      <div className="hidden lg:flex lg:col-span-2 bg-linear-to-br from-indigo-500/10 via-background to-cyan-500/10 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 18 }).map((_, index) => (
            <div
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-400 animate-float"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s` }}
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
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-background/70 p-6 shadow-2xl shadow-indigo-500/10"
          >
            <p className="mb-4 text-lg italic">“{testimonials[currentTestimonial].text}”</p>
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{testimonials[currentTestimonial].avatar}</div>
              <div>
                <div className="font-semibold">{testimonials[currentTestimonial].author}</div>
                <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">Join 1,200+ products already on Mantis</div>
      </div>

      <div className="flex items-center justify-center p-8 lg:col-span-3">
        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <Button variant="outline" className="mb-6 w-full" size="lg" disabled={isLoading} onClick={() => signIn("google", { callbackUrl: "/products" })}>
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="mb-6 w-full border-emerald-500/60 bg-emerald-500/8 text-emerald-200 hover:bg-emerald-500/12"
            size="lg"
            disabled={isLoading}
            onClick={handleDemoLogin}
          >
            ⚡ Try Demo — No signup needed
          </Button>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs uppercase tracking-[0.35em] text-muted-foreground">or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isLoading} className="mt-1" />
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</Link>
              </div>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={isLoading} className="mt-1" />
            </div>

            <Button type="submit" className="w-full bg-linear-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have an account? <Link href="/signup" className="font-semibold text-indigo-400 hover:text-indigo-300">Sign up for free</Link>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-background/70 p-4 shadow-xl shadow-indigo-500/5">
            <div className="mb-2 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-semibold">Demo Credentials</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>Email: demo@company.com</div>
              <div>Password: demo123</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
