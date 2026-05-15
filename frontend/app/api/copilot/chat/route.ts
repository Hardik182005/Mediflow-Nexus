import { GoogleGenerativeAI } from "@google/generative-ai";
import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";
import { FALLBACK_COPILOT_RESPONSES } from "@/lib/fallback-responses";

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

async function geminiWithTimeout(promise: Promise<any>, timeoutMs = 12000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs))
  ]);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];

    // TRY VERTEX AI FIRST
    try {
      console.log("[Copilot] Attempting Vertex AI Chat...");
      const vertexAI = new VertexAI({
        project: process.env.GCP_PROJECT_ID || "mediflow-nexus-2026",
        location: process.env.GCP_LOCATION || "us-central1"
      });

      const vertexModel = vertexAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: { role: "system", parts: [{ text: SYSTEM_PROMPT }] }
      });

      const history = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      const chat = vertexModel.startChat({ history });
      const result = await geminiWithTimeout(chat.sendMessage(lastMessage.content));
      const response = (result as any).response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return NextResponse.json({ reply: response });

    } catch (vertexErr) {
      console.error("[Copilot] Vertex AI failed, falling back to Google AI SDK:", (vertexErr as Error).message);

      // FALLBACK TO GOOGLE AI SDK
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: SYSTEM_PROMPT });

      const chatHistory = messages.slice(0, -1).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({ history: chatHistory });
      const result = await geminiWithTimeout(chat.sendMessage(lastMessage.content));
      const response = result.response.text();
      return NextResponse.json({ reply: response });
    }
  } catch (error: any) {
    console.error("Copilot Fatal Error:", error);
    const lastMessage = (await req.clone().json()).messages.pop();
    const query = lastMessage?.content?.toLowerCase() || "";
    const fallbackKey = query.includes("denial") ? "denial" : query.includes("vob") || query.includes("insurance") ? "vob" : "default";
    return NextResponse.json({ reply: FALLBACK_COPILOT_RESPONSES[fallbackKey] });
  }
}
