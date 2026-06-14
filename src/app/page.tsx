import Hero from "@/components/landing/Hero";
import LiveDemo from "@/components/landing/LiveDemo";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import CompanyMarquee from "@/components/landing/CompanyMarquee";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.08),_transparent_30%),linear-gradient(180deg,#04070f_0%,#070b14_45%,#04070f_100%)] text-foreground">
      <Navbar />
      <Hero />
      <LiveDemo />
      <Features />
      <HowItWorks />
      <Stats />
      <CompanyMarquee />
      <Pricing />
      <Footer />
    </main>
  );
}
