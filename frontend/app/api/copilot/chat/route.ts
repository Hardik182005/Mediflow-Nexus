import { NextResponse } from "next/server";
import { callOpenAIChat, callGroqFallback } from "@/lib/ai-provider";
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

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // PRIMARY: OpenAI GPT-4o-mini
    try {
      console.log("[Copilot] Using OpenAI GPT-4o-mini...");
      const response = await callOpenAIChat(SYSTEM_PROMPT, messages, { maxTokens: 2048 });
      return NextResponse.json({ reply: response });
    } catch (openaiErr: any) {
      console.warn("[Copilot] OpenAI failed, trying Groq:", openaiErr.message);

      // FALLBACK: Groq
      try {
        const lastMessage = messages[messages.length - 1];
        const contextMessages = messages.slice(-4).map((m: any) => `${m.role}: ${m.content}`).join("\n");
        const response = await callGroqFallback(
          SYSTEM_PROMPT,
          contextMessages + "\n\nRespond to the latest user message.",
          { jsonMode: false }
        );
        return NextResponse.json({ reply: response });
      } catch (groqErr: any) {
        console.error("[Copilot] All AI providers failed:", groqErr.message);
        throw groqErr;
      }
    }
  } catch (error: any) {
    console.error("Copilot Fatal Error:", error);
    try {
      const body = await req.clone().json();
      const lastMessage = body.messages?.pop();
      const query = lastMessage?.content?.toLowerCase() || "";
      const fallbackKey = query.includes("denial") ? "denial" : query.includes("vob") || query.includes("insurance") ? "vob" : "default";
      return NextResponse.json({ reply: FALLBACK_COPILOT_RESPONSES[fallbackKey] });
    } catch {
      return NextResponse.json({ reply: FALLBACK_COPILOT_RESPONSES["default"] });
    }
  }
}
