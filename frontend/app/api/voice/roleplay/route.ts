import { NextResponse } from "next/server";
import { callOpenAI } from "@/lib/ai-provider";

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
      Return JSON: { "reply": "your response here" }
    `;

    const result = await callOpenAI(
      "You are a tough healthcare buyer in a roleplay. Return JSON with a 'reply' key.",
      prompt,
      { maxTokens: 512, temperature: 0.7 }
    );

    const parsed = JSON.parse(result);
    return NextResponse.json({ reply: parsed.reply || "That sounds interesting, but how does it integrate with our existing EHR systems?" });
  } catch (error) {
    console.error("Roleplay Generation Error:", error);
    return NextResponse.json({ 
      reply: "That's an interesting pitch. But tell me — what's your implementation timeline, and how does this integrate with Epic or Cerner?" 
    });
  }
}
