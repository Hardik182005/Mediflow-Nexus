import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { startupId, buyerOrg, userPitch } = await req.json();

    if (!userPitch) {
      return NextResponse.json({ error: "userPitch is required" }, { status: 400 });
    }

    const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

    const prompt = `
      You are the highly skeptical, busy Director of Procurement at a major healthcare organization named "${buyerOrg}".
      A startup is pitching you their product. 
      Their pitch: "${userPitch}"
      
      Respond directly to their pitch. Be professional but ask a tough, realistic question about ROI, integration (like Epic/Cerner), clinical workflow, or security.
      Keep it short, conversational, and meant to be spoken aloud. (Max 2-3 sentences).
    `;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(prompt);

    const reply = response.response.text() || "That sounds interesting, but how does it integrate with our existing EHR systems?";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Roleplay Generation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
