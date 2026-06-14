export type DiagPhase = "SYMPTOMS" | "INVESTIGATION" | "DIAGNOSIS" | "RESOLUTION";

export interface MindMapNode {
  id: string;
  label: string;
  type: "product" | "symptom" | "cause" | "eliminated" | "confirmed";
}

export interface MindMapLink {
  source: string;
  target: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface DiagnosticSession {
  id: string;
  productId: string;
  messages: Message[];
  phase: DiagPhase;
  confidence: number;
  mindMap: {
    nodes: MindMapNode[];
    links: MindMapLink[];
  };
}
