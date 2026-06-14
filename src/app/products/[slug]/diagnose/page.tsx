"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import DiagnosticLayout from "@/components/diagnostic/DiagnosticLayout";
import ChatPanel from "@/components/diagnostic/ChatPanel";
import ConfidenceGauge from "@/components/diagnostic/ConfidenceGauge";
import DiagnosticStepper from "@/components/diagnostic/DiagnosticStepper";
import MindMap from "@/components/diagnostic/MindMap";
import SymptomChips from "@/components/diagnostic/SymptomChips";
import BootSequence from "@/components/diagnostic/BootSequence";
import SystemMetrics from "@/components/diagnostic/SystemMetrics";
import DispatchRadar from "@/components/diagnostic/DispatchRadar";
import type { DiagnosticSession, Message } from "@/types";

export default function DiagnosePage() {
  const params = useParams();
  const productId = params?.slug as string;

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();

        if (isMounted) {
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to load product for diagnosis", error);
      }
    }

    if (productId) {
      loadProduct();
    }

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const [session, setSession] = useState<DiagnosticSession>({
    id: "demo-session",
    productId,
    messages: [],
    phase: "SYMPTOMS",
    confidence: 0,
    mindMap: { nodes: [], links: [] },
  });

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showBoot, setShowBoot] = useState(true);
  const [showRadar, setShowRadar] = useState(false);

  useEffect(() => {
    if (product && session.mindMap.nodes.length === 0) {
      setSession((prev) => ({
        ...prev,
        mindMap: {
          nodes: [{ id: "product", label: product.name, type: "product" }],
          links: [],
        },
      }));
    }
  }, [product, session.mindMap.nodes.length]);

  const messages = useMemo<Message[]>(() => session.messages, [session.messages]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (
    event: React.FormEvent,
    options?: { imageBase64?: string; imageMimeType?: string; manualContext?: string[] },
  ) => {
    event.preventDefault();

    const userMessage = input.trim() || (options?.imageBase64 ? "Image uploaded for diagnosis." : "");
    if (!userMessage) return;
    const nextMessages = [
      ...session.messages,
      { id: `${Date.now()}-user`, role: "user" as const, content: userMessage },
    ];

    setSession((prev) => ({ ...prev, messages: nextMessages, phase: "INVESTIGATION", confidence: prev.confidence > 50 ? prev.confidence + 5 : 65 }));
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          productId,
          sessionId: session.id,
          imageBase64: options?.imageBase64,
          imageMimeType: options?.imageMimeType,
          manualContext: options?.manualContext ?? [product?.description ?? "", `Product: ${product?.name ?? ""}`],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate a diagnosis");
      }

      setSession((prev) => ({
        ...prev,
        messages: [
          ...nextMessages,
          { id: `${Date.now()}-assistant`, role: "assistant" as const, content: data.reply || "I’ve prepared a guided next step for this issue." },
        ],
        phase: data.phase || "DIAGNOSIS",
        confidence: data.confidence || 72,
        mindMap: {
          nodes: [
            ...prev.mindMap.nodes,
            { id: `symptom-${Date.now()}`, label: "Symptom review", type: "symptom" },
            { id: `cause-${Date.now()}`, label: "Likely cause", type: "cause" },
          ],
          links: [
            ...prev.mindMap.links,
            { source: "product", target: `symptom-${Date.now()}` },
            { source: `symptom-${Date.now()}`, target: `cause-${Date.now()}` },
          ],
        },
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to get a diagnostic response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSession = () => {
    setSession({
      id: "demo-session",
      productId,
      messages: [],
      phase: "SYMPTOMS",
      confidence: 0,
      mindMap: {
        nodes: product ? [{ id: "product", label: product.name, type: "product" }] : [],
        links: [],
      },
    });
    setInput("");
  };

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading diagnostic workspace…</div>;
  }

  return (
    <>
      {showBoot && <BootSequence onComplete={() => setShowBoot(false)} />}
      {showRadar && <DispatchRadar onComplete={() => { setShowRadar(false); handleNewSession(); }} />}
      
      {!showBoot && (
        <main className="min-h-screen bg-background">
          <div className="sticky top-16 z-40 border-b border-border bg-background/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">AI diagnostic</p>
                  <h1 className="text-xl font-black text-white sm:text-2xl">{product.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  {session.confidence >= 85 && (
                    <button
                      onClick={() => setShowRadar(true)}
                      className="animate-pulse rounded-full border border-emerald-500 bg-emerald-500/20 px-4 py-2 text-sm font-bold tracking-wider text-emerald-400 hover:bg-emerald-500 hover:text-black hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                    >
                      DISPATCH TECHNICIAN
                    </button>
                  )}
                  <button type="button" onClick={handleNewSession} className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground hover:text-white">New session</button>
                  <a href={`/products/${product.slug}`} className="rounded-full border border-border bg-background/70 px-4 py-2 text-sm text-muted-foreground hover:text-white">Back to product</a>
                </div>
              </div>
              <DiagnosticStepper currentPhase={session.phase} confidence={session.confidence} />
            </div>
          </div>

          <div className="container mx-auto px-4 py-6">
            <DiagnosticLayout
              leftPanel={
                <div className="flex h-full flex-col gap-6">
                  <section className="glass rounded-3xl p-4">
                    <div className="flex items-center gap-3">
                      {product.company?.logo ? <img src={product.company.logo} alt="" className="h-12 w-12 rounded-xl object-cover" /> : null}
                      <div>
                        <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Product</div>
                        <div className="text-lg font-semibold text-white">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.company?.name}</div>
                      </div>
                    </div>
                  </section>

                  <SystemMetrics isProcessing={isLoading} />
                  <ConfidenceGauge confidence={session.confidence} phase={session.phase} />
                  <section className="glass flex-1 rounded-3xl p-4">
                    <h4 className="mb-3 text-sm font-semibold text-white">Diagnostic mind map</h4>
                    <MindMap nodes={session.mindMap.nodes} links={session.mindMap.links} />
                  </section>
                </div>
              }
              chatPanel={
                <ChatPanel
                  messages={messages}
                  input={input}
                  onInputChange={handleInputChange}
                  onSubmit={handleSubmit}
                  productName={product.name}
                  isLoading={isLoading}
                />
              }
            />
          </div>
        </main>
      )}
    </>
  );
}
