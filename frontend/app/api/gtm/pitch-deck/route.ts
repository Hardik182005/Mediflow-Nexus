import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { FALLBACK_PITCH_DECK, FALLBACK_EMAIL_DRAFT } from "@/lib/fallback-responses";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Helper: race Gemini against a timeout
async function geminiWithTimeout(promise: Promise<any>, timeoutMs = 8000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs))
  ]);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle email generation requests
    if (body.type === 'email') {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const emailResult = await geminiWithTimeout(
          model.generateContent(`Draft a professional sales outreach email based on this pitch deck data. Make it concise, specific, and action-oriented. Pitch deck: ${JSON.stringify(body.pitchDeck)}. Target: ${body.buyerOrg || 'the hospital'}. Return just the email text, no JSON.`)
        );
        return NextResponse.json({ email: (emailResult as any).response.text() });
      } catch {
        return NextResponse.json({ email: FALLBACK_EMAIL_DRAFT });
      }
    }

    const { startupId, buyerId } = body;

    if (!process.env.GEMINI_API_KEY) {
      // No API key — return fallback immediately
      return NextResponse.json({ pitchDeck: FALLBACK_PITCH_DECK });
    }

    // 1. Fetch Startup Profile
    const { data: startup } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('id', startupId)
      .single();

    // 2. Fetch Buyer Match Data (to get the specific buyer details)
    const { data: match } = await supabase
      .from('marketplace_matches')
      .select('*')
      .eq('id', buyerId)
      .single();

    if (!startup || !match) {
      // No context — return fallback
      return NextResponse.json({ pitchDeck: FALLBACK_PITCH_DECK });
    }

    // 3. Load full buyer details for better ROI calculation
    const buyersPath = path.join(process.cwd(), "buyers.json");
    const buyersData = JSON.parse(fs.readFileSync(buyersPath, "utf-8"));
    const fullBuyer = buyersData.find((b: any) => b.organization === match.buyer_org) || {
      organization: match.buyer_org,
      key_challenges: ["Inefficiency", "High Costs"],
      annual_revenue: "₹500Cr+",
      total_beds: 500
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = `
      You are an enterprise sales expert for healthcare startups.
      Generate a hyper-personalized 8-slide pitch deck in JSON format for this specific match.
      
      STARTUP:
      Name: ${startup.name}
      Product: ${startup.description}
      Solution Type: ${startup.solution_type}
      Target Market: ${startup.target_market}
      
      BUYER:
      Hospital: ${fullBuyer.organization}
      Estimated Beds: ${fullBuyer.total_beds || 500}
      Estimated Revenue: ${fullBuyer.annual_revenue || "₹500Cr+"}
      Their challenges: ${fullBuyer.key_challenges?.join(', ') || match.match_reason}
      Match Rationale (from previous AI analysis): ${match.match_reason}
      
      ROI CALCULATION FORMULA (use this exact method):
      Monthly Revenue Loss = total_beds × avg_occupancy(70%) × avg_revenue_per_bed(₹8,000) × denial_rate(15%)
      Annual Savings = Monthly Revenue Loss × 12 × improvement_factor(40%)
      Show the real calculated numbers in Slide 6.
      
      RETURN JSON ONLY with this exact structure:
      {
        "slide1": { "headline": "A punchy personalized headline", "subline": "Specific value prop" },
        "slide2": { "title": "Their Current Crisis", "pain_points": ["Point 1", "Point 2", "Point 3"], "key_stat": "A striking currency/stat value" },
        "slide3": { "title": "The Cost of Inaction", "consequences": ["Consequence 1", "Consequence 2"], "revenue_at_risk": "Currency value" },
        "slide4": { "solution_line": "The 60-word max solution description", "steps": ["Step 1", "Step 2", "Step 3"] },
        "slide5": { "title": "Social Proof & Results", "proof_points": ["Proof 1", "Proof 2"] },
        "slide6": { "current_loss": "Currency", "savings": "Currency", "payback_period": "Number of days", "year1_roi": "Percentage" },
        "slide7": { "integration_title": "Seamless Fit", "tech_points": ["Integration 1", "Integration 2"] },
        "slide8": { "cta": "The specific ask (e.g. 30-day pilot)", "contact": "Contact info placeholders" }
      }
      
      Make every slide specific to ${fullBuyer.organization}. 
      Return ONLY valid JSON.
    `;

    try {
      const result = await geminiWithTimeout(model.generateContent(prompt));
      const text = (result as any).response.text().replace(/```json|```/g, "").trim();
      
      // Save the pitch deck to the match record
      await supabase.from('marketplace_matches').update({
        pitch_deck_json: JSON.parse(text)
      }).eq('id', buyerId);

      return NextResponse.json({ pitchDeck: JSON.parse(text) });
    } catch (timeoutErr) {
      console.warn("Gemini timeout/error — using fallback pitch deck");
      return NextResponse.json({ pitchDeck: FALLBACK_PITCH_DECK });
    }
  } catch (error: any) {
    console.error("Pitch generation error:", error);
    // Always fallback gracefully
    return NextResponse.json({ pitchDeck: FALLBACK_PITCH_DECK });
  }
}

