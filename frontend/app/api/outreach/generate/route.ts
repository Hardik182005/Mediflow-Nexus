import { NextRequest, NextResponse } from "next/server";
import { callOpenAI, cleanJsonResponse } from "@/lib/ai-provider";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

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

    const supabase = await createClient();
    const { data: startup, error: startupErr } = await supabase
      .from("startup_profiles")
      .select("*")
      .eq("id", startupId)
      .single();

    if (startupErr || !startup) {
      return NextResponse.json({ error: "Startup not found" }, { status: 404 });
    }

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
- Maximum 170 words total
- NEVER use "I hope this email finds you well" or any generic opener
- NEVER use filler phrases
- Every line must be specific to ${buyer.name}
- Use ONLY the numbers provided below
- Use bullet arrows (→) for the 3 outcome bullets
- End with a single, specific CTA asking for a 20-minute call

STARTUP DATA:
Name: ${startup.name}
Product: ${startup.description || startup.solution_type}
Value Proposition: ${startup.value_proposition || startup.target_market}

BUYER DATA:
Hospital: ${buyer.name}
Location: ${buyer.headquarter}
Beds: ${beds}
Challenges: ${(buyer.key_challenges || []).join(", ")}
Tech stack: ${(buyer.current_tech_stack || []).join(", ")}
Decision maker: ${dm.name}, ${dm.role}

CALCULATED ROI:
Monthly revenue loss: ${formatAmount(monthlyLoss)}/month
Annual savings: ${formatAmount(annualSavings)}/year
Payback period: ${paybackDays} days

RETURN JSON ONLY:
{
  "subject": "Subject line here",
  "body": "Full email body here",
  "recipientName": "${firstName}",
  "recipientRole": "${dm.role}",
  "hospitalName": "${buyer.name}",
  "wordCount": 0
}`;

    const raw = await callOpenAI(
      "You are a B2B healthcare sales email writer. Return valid JSON only.",
      prompt,
      { maxTokens: 1024 }
    );

    const cleaned = cleanJsonResponse(raw);
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: cleaned }, { status: 500 });
    }

    parsed.wordCount = parsed.body?.split(/\s+/).length || 0;
    return NextResponse.json({ email: parsed });
  } catch (err: any) {
    console.error("[Outreach Generate Error]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
