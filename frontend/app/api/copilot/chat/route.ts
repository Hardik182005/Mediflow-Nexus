import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { FALLBACK_COPILOT_RESPONSES } from "@/lib/fallback-responses";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

async function geminiWithTimeout(promise: Promise<any>, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs))
  ]);
}

const SYSTEM_PROMPT = `You are MediFlow Copilot — an elite healthcare intelligence assistant embedded inside the MediFlow Nexus platform.

You have deep knowledge of:
- Revenue Cycle Management (RCM): claims, denials, prior authorizations, CPT/ICD codes
- Insurance verification (VOB): policy parsing, coverage analysis, denial prediction
- Go-To-Market strategy for healthcare startups: buyer discovery, pitch decks, market sizing
- Clinical operations: patient intake, payer analytics, growth intelligence
- Healthcare compliance: HIPAA, SOC2, NABH, JCI
- Indian & ASEAN healthcare markets: Star Health, ICICI Lombard, Apollo, Fortis, Manipal, NHIS Singapore

Rules:
1. Always be concise and actionable. Use bullet points for lists.
2. If asked about data you don't have, say what data would be needed.
3. Never hallucinate patient data. Use realistic examples clearly marked as examples.
4. Format responses with markdown for readability.
5. When recommending actions, prioritize revenue impact.
6. You can reference MediFlow Nexus features like "check the Denial Intelligence page" or "run a VOB analysis."`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // Build chat history for Gemini
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "System instruction: " + SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am MediFlow Copilot, ready to assist with healthcare intelligence, RCM, VOB, GTM strategy, and clinical operations. How can I help?" }] },
        ...chatHistory,
      ],
    });

    const lastMessage = messages[messages.length - 1];

    try {
      const result = await geminiWithTimeout(chat.sendMessage(lastMessage.content));
      const response = (result as any).response.text();
      return NextResponse.json({ reply: response });
    } catch (timeoutErr) {
      // Gemini timeout or error — use fallback
      console.warn("Copilot: Gemini timeout, using fallback");
      const query = lastMessage.content.toLowerCase();
      const fallbackKey = query.includes("denial") ? "denial" : query.includes("vob") || query.includes("insurance") ? "vob" : "default";
      return NextResponse.json({ reply: FALLBACK_COPILOT_RESPONSES[fallbackKey] });
    }
  } catch (error: any) {
    console.error("Copilot error:", error);
    return NextResponse.json({ reply: FALLBACK_COPILOT_RESPONSES["default"] });
  }
}
