import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { deck, buyerName, startupId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Fetch Startup Profile for extra context
    const { data: startup } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('id', startupId)
      .single();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
      You are an expert in B2B healthcare sales outreach.
      Draft a personalized, high-conversion cold outreach email for the following scenario:
      
      STARTUP: ${startup?.name}
      PRODUCT: ${startup?.description}
      TARGET BUYER: ${buyerName}
      
      KEY DATA POINTS (Use these for credibility):
      - Headline: ${deck.slide1.headline}
      - Annual Revenue At Risk: ${deck.slide3.revenue_at_risk}
      - Estimated Savings: ${deck.slide6.savings}
      - Payback Period: ${deck.slide6.payback_period}
      - Year 1 ROI: ${deck.slide6.year1_roi}
      
      EMAIL RULES:
      1. Subject line must be punchy and personalized (mention the buyer).
      2. First paragraph must state the specific problem (from the data).
      3. Second paragraph must offer the solution with the specific ROI numbers.
      4. Call to Action: Request a brief 20-minute discussion for a no-cost pilot.
      5. Tone: Professional, clinically-aware, and business-focused.
      6. No fluff. Keep it under 150 words.
      
      Return ONLY the email text. Use placeholders like [Name] for the recipient.
    `;

    const result = await model.generateContent(prompt);
    const email = result.response.text().trim();

    return NextResponse.json({ email });
  } catch (error: any) {
    console.error("Email drafting error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
