import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VertexAI } from "@google-cloud/vertexai";

async function generateReply(prompt: string): Promise<string> {
  // Try Vertex AI first
  try {
    const vertexAI = new VertexAI({
      project: process.env.GCP_PROJECT_ID || "mediflow-nexus-2026",
      location: process.env.GCP_LOCATION || "us-central1",
    });
    const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return (result.response.candidates?.[0]?.content?.parts?.[0]?.text as string || "").trim();
  } catch (err: any) {
    console.warn("[Roleplay] Vertex AI failed, falling back to Google AI SDK:", err.message);
  }

  // Fallback to Google AI SDK
  const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
  const response = await model.generateContent(prompt);
  return response.response.text().trim();
}

export async function POST(req: Request) {
  try {
    const { startupId, buyerOrg, userPitch } = await req.json();

    if (!userPitch) {
      return NextResponse.json({ error: "userPitch is required" }, { status: 400 });
    }

    const prompt = `
      You are the highly skeptical, busy Director of Procurement at a major healthcare organization named "${buyerOrg}".
      A startup is pitching you their product. 
      Their pitch: "${userPitch}"
      
      Respond directly to their pitch. Be professional but ask a tough, realistic question about ROI, integration (like Epic/Cerner), clinical workflow, or security.
      Keep it short, conversational, and meant to be spoken aloud. (Max 2-3 sentences).
    `;

    const reply = await generateReply(prompt);

    return NextResponse.json({ reply: reply || "That sounds interesting, but how does it integrate with our existing EHR systems?" });
  } catch (error) {
    console.error("Roleplay Generation Error:", error);
    return NextResponse.json({ 
      reply: "That's an interesting pitch. But tell me — what's your implementation timeline, and how does this integrate with Epic or Cerner?" 
    });
  }
}
