import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getMarketplaceProduct } from "@/lib/marketplace";

function determinePhase(messages: { role: string; content: string }[]) {
  if (messages.length <= 2) return "SYMPTOMS";
  if (messages.length <= 5) return "INVESTIGATION";
  if (messages.length <= 8) return "DIAGNOSIS";
  return "RESOLUTION";
}

function detectIssueType(text: string) {
  const normalized = text.toLowerCase();

  if (/overheat|heat|thermal|fan|cool|temperature/i.test(normalized)) return "thermal";
  if (/power|battery|voltage|charge|startup|boot/i.test(normalized)) return "power";
  if (/noise|vibration|bearing|loose|rattle|mechanic/i.test(normalized)) return "mechanical";
  if (/error|fault|code|sensor|firmware|calibration|warning/i.test(normalized)) return "software";
  if (/network|connect|signal|wifi|bluetooth|latency/i.test(normalized)) return "connectivity";

  return "general";
}

function calculateConfidence(messages: { role: string; content: string }[], issueType: string) {
  const symptomKeywords = /(noise|overheat|leak|vibration|error|start|power|battery|warning|fault|slow|heat|signal|fan|sensor)/i;
  const mentionCount = messages.filter((message) => symptomKeywords.test(message.content)).length;
  const issueWeight = issueType === "general" ? 0 : 8;

  return Math.min(95, 48 + mentionCount * 6 + Math.min(messages.length * 3, 18) + issueWeight);
}

function createChecklist(issueType: string) {
  if (issueType === "thermal") {
    return [
      "Inspect airflow paths, fan operation, and surrounding ventilation.",
      "Confirm whether the symptom appears only under sustained load or idle conditions.",
      "Compare recent changes in temperature, placement, or environment settings.",
    ];
  }

  if (issueType === "power") {
    return [
      "Verify the power source, cables, and battery health before any part replacement.",
      "Check for sudden drops in voltage or unexpected startup behavior under load.",
      "Review whether the issue started after a recent firmware or power-event change.",
    ];
  }

  if (issueType === "mechanical") {
    return [
      "Inspect moving parts, mounts, and any signs of looseness or wear.",
      "Confirm the symptom occurs during motion, startup, or vibration-heavy operations.",
      "Compare current behavior with service history and maintenance intervals.",
    ];
  }

  if (issueType === "software") {
    return [
      "Review recent warnings, calibration changes, and firmware update history.",
      "Re-check sensor readings and control logic after a clean restart.",
      "Validate whether the fault follows a specific operating mode or workflow.",
    ];
  }

  if (issueType === "connectivity") {
    return [
      "Verify signal quality, network stability, and any recent environment changes.",
      "Check the device link path, connectors, and communication settings.",
      "Confirm whether the symptom only appears when the unit is remote or under load.",
    ];
  }

  return [
    "Confirm the exact symptom and the conditions under which it appears.",
    "Compare the report with the product manual and recent maintenance notes.",
    "Capture the outcome of the next test cycle before escalating the case.",
  ];
}

function createReply(product: { name: string; description?: string | null }, text: string, phase: string) {
  const issueType = detectIssueType(text);
  const checklist = createChecklist(issueType);
  const confidence = Math.round(calculateConfidence([{ role: "user", content: text }], issueType));

  let summary = `I’m tracing the symptom profile for ${product.name} and prioritizing the most likely fault path first.`;

  if (issueType === "mechanical") {
    summary = `The symptom pattern for ${product.name} points to a mechanical or wear-related issue. The next best checks are around movement, mounts, and vibration behavior.`;
  } else if (issueType === "thermal") {
    summary = `The report suggests a thermal or airflow problem in ${product.name}. Focus on cooling, fan health, and operating temperature changes.`;
  } else if (issueType === "power") {
    summary = `The issue looks energy-related in ${product.name}. Confirm input power, battery status, and load conditions before deeper troubleshooting.`;
  } else if (issueType === "software") {
    summary = `The symptom pattern in ${product.name} is consistent with a sensor, firmware, or control-system fault. Review recent warnings and any recent updates first.`;
  } else if (issueType === "connectivity") {
    summary = `The signal or communication path appears to be involved in ${product.name}. Check stability, connectors, and network quality before replacing hardware.`;
  }

  const phaseAdvice =
    phase === "SYMPTOMS"
      ? "Start by confirming the symptom, the exact trigger, and when it happens."
      : phase === "INVESTIGATION"
        ? "Compare the evidence against the product documentation and recent service observations."
        : phase === "DIAGNOSIS"
          ? "The likely fault path is narrowed; verify the highest-probability cause before escalating the case."
          : "The resolution path is clear; confirm the fix with the next test cycle and capture the result for the ticket.";

  const contextLine = product.description ? `Context: ${product.description}` : "Context: product guidance is available from the marketplace record.";

  return [
    summary,
    "",
    contextLine,
    "",
    phaseAdvice,
    "",
    "Recommended actions:",
    ...checklist.map((item) => `- ${item}`),
    "",
    `Confidence score: ${confidence}%`,
  ].join("\n");
}

async function getGeminiReply(product: { name: string; description?: string | null; company?: { name?: string | null } | null }, messages: { role: string; content: string }[]) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;

  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const recentHistory = messages
    .slice(-6)
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 500,
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are Mantis AI, a troubleshooting assistant for industrial products. Use the product context and recent conversation.
Product: ${product.name}${product.company?.name ? ` | Company: ${product.company.name}` : ""}
Description: ${product.description || "No extra description provided."}
Current conversation:
${recentHistory}

Latest user symptom: ${lastUserMessage?.content || "No symptom provided."}

Return JSON only with fields: reply, phase, confidence. The reply should include: 1) a brief summary, 2) the likely fault path, 3) 2-4 practical next steps, and 4) a confidence percentage between 0 and 100. Do not claim certainty beyond the evidence provided.`,
              },
            ],
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const raw = data.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n") || "";

  try {
    const parsed = JSON.parse(raw) as { reply?: string; phase?: string; confidence?: number };
    return {
      reply: parsed.reply || raw,
      phase: parsed.phase || "DIAGNOSIS",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 72,
    };
  } catch {
    return {
      reply: raw || "I’m unable to generate a model response right now.",
      phase: "DIAGNOSIS",
      confidence: 72,
    };
  }
}

async function getAnthropicReply(product: { name: string; description?: string | null; company?: { name?: string | null } | null }, messages: { role: string; content: string }[]) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const client = new Anthropic({ apiKey });
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const recentHistory = messages
    .slice(-6)
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n");

  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest",
    max_tokens: 700,
    temperature: 0.35,
    system:
      "You are Mantis AI, a troubleshooting assistant for industrial products. Give concise, practical guidance. Reply with JSON only using fields: reply, phase, confidence.",
    messages: [
      {
        role: "user",
        content: `Product: ${product.name}${product.company?.name ? ` | Company: ${product.company.name}` : ""}\nDescription: ${product.description || "No extra description provided."}\nCurrent conversation:\n${recentHistory}\n\nLatest user symptom: ${lastUserMessage?.content || "No symptom provided."}\n\nProvide a diagnostic response that includes: 1) a brief summary, 2) the likely fault path, 3) 2-4 practical next steps, and 4) a confidence percentage between 0 and 100. Return JSON only.`,
      },
    ],
  });

  const text = response.content
    .filter((block): block is { type: "text"; text: string } => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  try {
    const parsed = JSON.parse(text) as { reply?: string; phase?: string; confidence?: number };
    return {
      reply: parsed.reply || text,
      phase: parsed.phase || "DIAGNOSIS",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 72,
    };
  } catch {
    return {
      reply: text || "I’m unable to generate a model response right now.",
      phase: "DIAGNOSIS",
      confidence: 72,
    };
  }
}

async function getModelReply(product: { name: string; description?: string | null; company?: { name?: string | null } | null }, messages: { role: string; content: string }[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const recentHistory = messages
    .slice(-6)
    .map((message) => `${message.role === "user" ? "User" : "Assistant"}: ${message.content}`)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.35,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "You are Mantis AI, a troubleshooting assistant for industrial products. Give concise, practical guidance. Return JSON with fields: reply, phase, confidence. Use the product context and recent conversation. Do not claim certainty beyond the evidence provided.",
        },
        {
          role: "user",
          content: `Product: ${product.name}${product.company?.name ? ` | Company: ${product.company.name}` : ""}\nDescription: ${product.description || "No extra description provided."}\nCurrent conversation:\n${recentHistory}\n\nLatest user symptom: ${lastUserMessage?.content || "No symptom provided."}\n\nProvide a diagnostic response that includes: 1) a brief summary, 2) the likely fault path, 3) 2-4 practical next steps, and 4) a confidence percentage between 0 and 100.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const raw = data.choices?.[0]?.message?.content ?? "";

  try {
    const parsed = JSON.parse(raw) as { reply?: string; phase?: string; confidence?: number };
    return {
      reply: parsed.reply || raw,
      phase: parsed.phase || "DIAGNOSIS",
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 72,
    };
  } catch {
    return {
      reply: raw || "I’m unable to generate a model response right now.",
      phase: "DIAGNOSIS",
      confidence: 72,
    };
  }
}

export async function POST(request: Request) {
  try {
    const { messages, productId } = await request.json();

    if (!Array.isArray(messages) || !productId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await getMarketplaceProduct(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "user") {
      return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
    }

    const phase = determinePhase(messages);

    try {
      const geminiResponse = await getGeminiReply(product, messages);
      if (geminiResponse) {
        return NextResponse.json({
          reply: geminiResponse.reply,
          phase: geminiResponse.phase,
          confidence: Math.min(95, Math.max(0, geminiResponse.confidence)),
        });
      }
    } catch (error) {
      console.warn("Gemini diagnosis unavailable, falling back to the existing providers or heuristics:", error);
    }

    try {
      const anthropicResponse = await getAnthropicReply(product, messages);
      if (anthropicResponse) {
        return NextResponse.json({
          reply: anthropicResponse.reply,
          phase: anthropicResponse.phase,
          confidence: Math.min(95, Math.max(0, anthropicResponse.confidence)),
        });
      }
    } catch (error) {
      console.warn("Anthropic diagnosis unavailable, falling back to OpenAI or heuristics:", error);
    }

    try {
      const modelResponse = await getModelReply(product, messages);
      if (modelResponse) {
        return NextResponse.json({
          reply: modelResponse.reply,
          phase: modelResponse.phase,
          confidence: Math.min(95, Math.max(0, modelResponse.confidence)),
        });
      }
    } catch (error) {
      console.warn("OpenAI diagnosis unavailable, falling back to heuristic guidance:", error);
    }

    const issueType = detectIssueType(lastMessage.content);
    const confidence = Math.min(95, calculateConfidence(messages, issueType));
    const reply = createReply(product, lastMessage.content, phase);

    return NextResponse.json({ reply, phase, confidence });
  } catch (error) {
    console.error("Diagnose API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
