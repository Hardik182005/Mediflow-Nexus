import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

function loadBuyersJson(): any[] {
  const candidates = [
    path.join(process.cwd(), "data", "buyers.json"),
    path.join(process.cwd(), "buyers.json"),
    path.join(process.cwd(), "..", "buyers.json"),
    path.join(process.cwd(), "..", "data", "buyers.json"),
  ];
  for (const p of candidates) {
    try {
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { /* try next */ }
  }
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const { startupId, buyerOrg, buyerName } = await req.json();

    if (!startupId || !buyerOrg) {
      return NextResponse.json({ error: "startupId and buyerOrg are required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
    }

    // Fetch startup from Supabase
    const supabase = await createClient();
    const { data: startup, error: startupErr } = await supabase
      .from("startup_profiles")
      .select("*")
      .eq("id", startupId)
      .single();

    if (startupErr || !startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

    // Look up the buyer in buyers.json by org name (fuzzy match)
    const allBuyers = loadBuyersJson();
    const buyer = allBuyers.find(
      (b: any) => b.name?.toLowerCase().includes(buyerOrg.toLowerCase()) ||
                 buyerOrg.toLowerCase().includes(b.name?.toLowerCase())
    ) || {
      name: buyerOrg,
      headquarter: "India",
      total_beds: 500,
      annual_revenue_usd: "50M",
      key_challenges: ["operational efficiency", "patient throughput"],
      current_tech_stack: ["existing HIS"],
      decision_makers: [{ name: buyerName || "the Decision Maker", role: "Hospital Director" }],
    };

    const dm = buyer.decision_makers?.[0] || { name: buyerName || "Director", role: "Hospital Director" };
    const firstName = dm.name.split(" ")[0];

    // ROI calculation
    const beds = buyer.total_beds || 500;
    const monthlyLoss = Math.round(beds * 0.70 * 8000 * 0.15);
    const annualSavings = Math.round(monthlyLoss * 12 * 0.40);
    const currency = (buyer.headquarter || "").toLowerCase().includes("singapore") ||
                     (buyer.headquarter || "").toLowerCase().includes("malaysia") ||
                     (buyer.headquarter || "").toLowerCase().includes("indonesia")
                     ? "SGD" : "Rs.";

    const formatAmount = (n: number) => {
      if (currency === "Rs.") {
        if (n >= 10000000) return `Rs. ${(n / 10000000).toFixed(1)}Cr`;
        if (n >= 100000) return `Rs. ${(n / 100000).toFixed(1)}L`;
        return `Rs. ${n.toLocaleString()}`;
      }
      return `SGD ${(n / 1000).toFixed(0)}K`;
    };

    const paybackDays = Math.round(30 / 0.40);

    const prompt = `You are an expert B2B healthcare sales writer.

Write a cold outreach email from ${startup.name} to ${firstName} (${dm.role}) at ${buyer.name}.

STRICT RULES:
- Maximum 170 words total (count carefully)
- NEVER use "I hope this email finds you well" or any generic opener
- NEVER use filler phrases like "I wanted to reach out" or "We believe"
- Every single line must be specific to ${buyer.name}
- Use ONLY the numbers provided below — do not invent any
- Use bullet arrows (→) for the 3 outcome bullets
- End with a single, specific CTA asking for a 20-minute call
- Sign off with the startup founder's name and contact

STARTUP DATA:
Name: ${startup.name}
Product: ${startup.description || startup.solution_type}
Value Proposition: ${startup.value_proposition || startup.target_market}

BUYER DATA:
Hospital: ${buyer.name}
Location: ${buyer.headquarter}
Beds: ${beds}
Their challenges: ${(buyer.key_challenges || []).join(", ")}
Their tech stack: ${(buyer.current_tech_stack || []).join(", ")}
Decision maker: ${dm.name}, ${dm.role}

CALCULATED ROI (use these exact numbers):
Monthly revenue loss (current): ${formatAmount(monthlyLoss)}/month
Annual savings if implemented: ${formatAmount(annualSavings)}/year
Payback period: ${paybackDays} days

EMAIL STRUCTURE (follow exactly):
- Line 1: One striking specific fact about ${buyer.name} (beds, scale, or challenge)
- Line 2: Their specific pain point with the monthly loss number
- Line 3: One-line what ${startup.name} does + one key differentiator
- Line 4: A proof point from a similar hospital (make it realistic and specific)
- Lines 5-7: Three → bullet outcomes specific to ${buyer.name} using the calculated numbers
- Line 8: Request for a 20-min call, specific day suggestion (e.g., "this Thursday or Friday")

SUBJECT LINE RULES — pick the best formula:
Formula 1: "Reducing ${buyer.name}'s [Key Metric] by [Number]% — ${startup.name}"
Formula 2: "${formatAmount(annualSavings)}/yr Recovery Opportunity for ${buyer.name} — ${startup.name}"
Formula 3: "[Their specific challenge] at ${buyer.name} — ${startup.name}"

RETURN JSON ONLY in this exact format:
{
  "subject": "Subject line here",
  "body": "Full email body here (use actual newlines, not \\\\n)",
  "recipientName": "${firstName}",
  "recipientRole": "${dm.role}",
  "hospitalName": "${buyer.name}",
  "wordCount": 0
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw }, { status: 500 });
    }

    // Add word count
    parsed.wordCount = parsed.body.split(/\s+/).length;

    return NextResponse.json({ email: parsed });
  } catch (err: any) {
    console.error("[Outreach Generate Error]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
