import { NextResponse } from "next/server";
import { callOpenAI, callOpenAIVision, callGroqFallback, cleanJsonResponse } from "@/lib/ai-provider";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";
import { FALLBACK_PITCH_DECK, FALLBACK_EMAIL_DRAFT } from "@/lib/fallback-responses";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    console.log("Pitch Deck API hit", body);

    // Handle email generation requests
    if (body.type === 'email') {
      try {
        const result = await callOpenAI(
          "You are a B2B healthcare sales email writer. Return the email text only, no JSON.",
          `Draft a professional sales outreach email based on this pitch deck data. Make it concise, specific, and action-oriented. Pitch deck: ${JSON.stringify(body.pitchDeck)}. Target: ${body.buyerOrg || 'the hospital'}. Return just the email text.`,
          { maxTokens: 1024, jsonMode: false }
        );
        return NextResponse.json({ email: result });
      } catch {
        return NextResponse.json({ email: FALLBACK_EMAIL_DRAFT });
      }
    }

    const { startupId, buyerId, buyerOrg, matchReason, productFiles } = body;

    // 1. Fetch Startup Profile
    const { data: startup } = await supabase
      .from('startup_profiles')
      .select('*')
      .eq('id', startupId)
      .single();

    // 2. Fetch Buyer Match Data
    const { data: match } = await supabase
      .from('marketplace_matches')
      .select('*')
      .eq('id', buyerId)
      .single();

    const actualBuyerOrg = buyerOrg || match?.buyer_org || "Target Organization";
    const actualMatchReason = matchReason || match?.match_reason || "Inefficiency and high costs.";

    const generateDynamicFallback = (startupData: any, targetOrg: string, reason: string) => ({
      slide1: { headline: `Accelerating ${targetOrg}'s Clinical Workflows`, subline: `AI-powered solution by ${startupData?.name || 'our platform'}` },
      slide2: { title: `${targetOrg}'s Current Challenge`, pain_points: [reason, "High operational costs", "Resource constraints"], key_stat: "High impact area" },
      slide3: { title: "The Cost of Inaction", consequences: ["Decreased patient satisfaction", "Revenue leakage", "Staff burnout"], revenue_at_risk: "Significant" },
      slide4: { solution_line: startupData?.description ? (startupData.description.substring(0, 100) + "...") : "Our AI solution optimizes your operations.", steps: ["Integration", "Optimization", "Measurable Results"] },
      slide5: { title: "Proven Results", proof_points: ["Increased efficiency by up to 40%", "Reduced costs significantly", "Seamless deployment in weeks"] },
      slide6: { current_loss: "High", savings: "Targeted 30% reduction", payback_period: "90 days", year1_roi: "150%" },
      slide7: { integration_title: `Seamless Fit with ${targetOrg}'s Stack`, tech_points: ["Direct integration", "No hardware changes required", "Secure and compliant data handling"] },
      slide8: { cta: `Start a 30-day pilot at ${targetOrg}`, contact: `Schedule a 15-minute call with ${startupData?.name || 'our team'}` }
    });

    const fallbackDeck = startup ? generateDynamicFallback(startup, actualBuyerOrg, actualMatchReason) : FALLBACK_PITCH_DECK;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ pitchDeck: fallbackDeck });
    }

    if (!startup) {
      return NextResponse.json({ pitchDeck: fallbackDeck });
    }

    // 3. Load full buyer details
    const buyersPath = path.join(process.cwd(), "buyers.json");
    let buyersData: any[] = [];
    try {
      buyersData = JSON.parse(fs.readFileSync(buyersPath, "utf-8"));
    } catch { /* ignore */ }
    const fullBuyer = buyersData.find((b: any) => b.organization === actualBuyerOrg) || {
      organization: actualBuyerOrg,
      key_challenges: [actualMatchReason],
      annual_revenue: "₹500Cr+",
      total_beds: 500
    };

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
      Their challenges: ${fullBuyer.key_challenges?.join(', ') || actualMatchReason}
      Match Rationale: ${actualMatchReason}
      
      ROI CALCULATION FORMULA:
      Monthly Revenue Loss = total_beds × avg_occupancy(70%) × avg_revenue_per_bed(₹8,000) × denial_rate(15%)
      Annual Savings = Monthly Revenue Loss × 12 × improvement_factor(40%)
      Show the real calculated numbers in Slide 6.
      
      RETURN JSON ONLY with this exact structure:
      {
        "slide1": { "headline": "A punchy personalized headline", "subline": "Specific value prop" },
        "slide2": { "title": "Their Current Crisis", "pain_points": ["Point 1", "Point 2", "Point 3"], "key_stat": "A striking stat" },
        "slide3": { "title": "The Cost of Inaction", "consequences": ["Consequence 1", "Consequence 2"], "revenue_at_risk": "Currency value" },
        "slide4": { "solution_line": "60-word max solution", "steps": ["Step 1", "Step 2", "Step 3"] },
        "slide5": { "title": "Social Proof & Results", "proof_points": ["Proof 1", "Proof 2"] },
        "slide6": { "current_loss": "Currency", "savings": "Currency", "payback_period": "Days", "year1_roi": "Percentage" },
        "slide7": { "integration_title": "Seamless Fit", "tech_points": ["Integration 1", "Integration 2"] },
        "slide8": { "cta": "The specific ask", "contact": "Contact info" }
      }
      
      Make every slide specific to ${fullBuyer.organization}. Return ONLY valid JSON.
    `;

    // Build parts for vision (if product files attached)
    const parts: any[] = [{ text: prompt }];
    if (productFiles && Array.isArray(productFiles)) {
      for (const f of productFiles) {
        parts.push({ inlineData: { data: f.base64, mimeType: f.mimeType } });
      }
    }

    // PRIMARY: OpenAI GPT-4o
    try {
      console.log("[PitchDeck] Using OpenAI GPT-4o...");
      let rawText: string;
      
      if (productFiles && productFiles.length > 0) {
        rawText = await callOpenAIVision(
          "You are an enterprise sales pitch deck generator. Return valid JSON only.",
          parts,
          { maxTokens: 4096 }
        );
      } else {
        rawText = await callOpenAI(
          "You are an enterprise sales pitch deck generator. Return valid JSON only.",
          prompt,
          { maxTokens: 4096 }
        );
      }

      const text = cleanJsonResponse(rawText);
      return NextResponse.json({ pitchDeck: JSON.parse(text) });
    } catch (openaiErr: any) {
      console.warn("[PitchDeck] OpenAI failed, trying Groq:", openaiErr.message);

      // FALLBACK: Groq
      try {
        const groqResult = await callGroqFallback(
          "You are an enterprise sales pitch deck generator. Return valid JSON only.",
          prompt,
          { maxTokens: 4096 }
        );
        const text = cleanJsonResponse(groqResult);
        return NextResponse.json({ pitchDeck: JSON.parse(text) });
      } catch (groqErr) {
        console.warn("[PitchDeck] All engines failed — using fallback pitch deck");
        return NextResponse.json({ pitchDeck: fallbackDeck });
      }
    }
  } catch (error: any) {
    console.error("Pitch generation error:", error);
    return NextResponse.json({ pitchDeck: FALLBACK_PITCH_DECK });
  }
}
