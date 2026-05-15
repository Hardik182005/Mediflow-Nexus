import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { VertexAI } from "@google-cloud/vertexai";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

// ── MIME type map ─────────────────────────────────────────────
const MIME_MAP: Record<string, string> = {
  pdf: "application/pdf",
  txt: "text/plain",
  md: "text/plain",
  csv: "text/csv",
  html: "text/html",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/avi",
  webm: "video/webm",
  mp3: "audio/mp3",
  wav: "audio/wav",
  ogg: "audio/ogg",
};

const GTM_SYSTEM_PROMPT = `You are an expert Healthcare Go-To-Market (GTM) Strategist AI.

Your task is to analyze multi-modal startup inputs (PDFs, presentations, videos, images, documents) and generate a complete GTM strategy.

You MUST return ONLY a valid JSON object (no markdown, no code fences, no explanation text) with exactly these keys:

{
  "startupSummary": {
    "companyName": "string",
    "industry": "string",
    "productType": "string",
    "stage": "string",
    "tagline": "string"
  },
  "productIntelligence": {
    "problemStatement": "string",
    "solutionDescription": "string",
    "keyFeatures": ["string"],
    "keyBenefits": ["string"],
    "differentiation": "string",
    "complexityLevel": "string",
    "deploymentType": "string",
    "pricingModel": "string"
  },
  "icp": {
    "targetSegments": ["string"],
    "specializations": ["string"],
    "organizationSize": "string",
    "geography": "string",
    "technologyMaturity": "string",
    "annualRevenue": "string"
  },
  "buyerPersona": {
    "primaryBuyer": {
      "title": "string",
      "painPoints": ["string"],
      "motivation": "string"
    },
    "secondaryBuyers": [{ "title": "string", "role": "string" }],
    "buyingTriggers": ["string"]
  },
  "valueProposition": {
    "headline": "string",
    "statements": ["string"],
    "roi": "string"
  },
  "messaging": {
    "elevatorPitch": "string",
    "salesPitch": "string",
    "emailOutreach": { "subject": "string", "body": "string" },
    "linkedinOutreach": "string",
    "tagline": "string",
    "keyMarketingPoints": ["string"]
  },
  "demoStrategy": {
    "workflowSteps": ["string"],
    "talkingPoints": ["string"],
    "objectionHandling": [{ "objection": "string", "response": "string" }]
  },
  "buyerDiscovery": {
    "targetClinicTypes": ["string"],
    "referralPartners": ["string"],
    "strategicPartnerships": ["string"],
    "sampleBuyerProfiles": [{ "orgName": "string", "type": "string", "reason": "string" }]
  },
  "salesStrategy": {
    "approach": "string",
    "funnel": ["string"],
    "conversionDrivers": ["string"],
    "objections": [{ "objection": "string", "solution": "string" }]
  },
  "roiImpact": {
    "revenueImpact": "string",
    "costSavings": "string",
    "efficiencyGain": "string",
    "paybackPeriod": "string",
    "metrics": ["string"]
  },
  "marketplaceMatch": {
    "idealMatches": [{ "clinicType": "string", "reason": "string", "fitScore": number }],
    "recommendedAction": "string"
  }
}

RULES:
- Read and extract information from ALL provided files
- Be specific, use healthcare-specific language
- If data is missing, make reasonable expert assumptions
- VERY IMPORTANT: For 'buyerDiscovery.sampleBuyerProfiles', YOU MUST ONLY select 3-5 organizations from the provided 'BUYER DATASET' in the context.`;

function loadBuyersJson(): string | null {
  const candidates = [
    path.join(process.cwd(), "data", "buyers.json"),
    path.join(process.cwd(), "buyers.json"),
    path.join(process.cwd(), "public", "data", "buyers.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
    } catch { /* try next */ }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json() as any;
    const { files, textContext, discoveryMode, startupId } = body;

    // ── Shared Logic: Discovery Mode ──
    if (discoveryMode && startupId) {
      const { data: startup } = await supabase.from('startup_profiles').select('*').eq('id', startupId).single();
      if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });

      const { data: gtmRecord } = await supabase.from('gtm_recommendations').select('strategy_json').eq('startup_id', startupId).order('created_at', { ascending: false }).limit(1).maybeSingle();
      const gtmData = gtmRecord?.strategy_json || null;

      const buyersRaw = loadBuyersJson();
      if (!buyersRaw) return NextResponse.json({ error: "Buyer dataset not found" }, { status: 500 });
      const buyersData = JSON.parse(buyersRaw);

      const prompt = `Match this startup to 5 potential buyers.
        STARTUP: ${startup.name}, Description: ${startup.description}.
        GTM CONTEXT: ${JSON.stringify(gtmData?.icp || {})}
        BUYER DATASET: ${JSON.stringify(buyersData.slice(0, 50))}
        RETURN JSON: { "matches": [{ "name", "organization", "score", "reason" }] }`;

      try {
        const vertexAI = new VertexAI({ project: process.env.GCP_PROJECT_ID || "mediflow-nexus-2026", location: process.env.GCP_LOCATION || "us-central1" });
        const model = vertexAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const text = (result.response.candidates?.[0]?.content?.parts?.[0]?.text as string || "").replace(/```json|```/g, "").trim();
        return NextResponse.json(JSON.parse(text));
      } catch (err) {
        // Fallback to Google AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json|```/g, "").trim();
        return NextResponse.json(JSON.parse(text));
      }
    }

    // ── Standard Mode: Strategy Generation ──
    const parts: any[] = [];
    for (const file of files ?? []) {
      const mimeType = MIME_MAP[file.ext.toLowerCase().replace(".", "")] ?? "application/octet-stream";
      if (mimeType !== "application/octet-stream") {
        parts.push({ text: `--- ${file.label.toUpperCase()} (${file.name}) ---` });
        parts.push({ inlineData: { mimeType, data: file.base64 } });
      }
    }
    if (textContext?.trim()) parts.push({ text: `--- CONTEXT ---\n${textContext.trim()}` });
    const buyers = loadBuyersJson();
    if (buyers) parts.push({ text: `\n\n--- BUYER DATASET ---\n${buyers}\n` });

    try {
      const vertexAI = new VertexAI({ project: process.env.GCP_PROJECT_ID || "mediflow-nexus-2026", location: process.env.GCP_LOCATION || "us-central1" });
      const model = vertexAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: { role: "system", parts: [{ text: GTM_SYSTEM_PROMPT }] }
      });
      const result = await model.generateContent({ contents: [{ role: "user", parts }] });
      const rawText = result.response.candidates?.[0]?.content?.parts?.[0]?.text as string || "";
      const jsonText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      return NextResponse.json({ strategy: JSON.parse(jsonText) });
    } catch (err: any) {
      console.warn("Vertex failed, using Google AI SDK:", err.message);
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction: GTM_SYSTEM_PROMPT });
      const result = await model.generateContent({ contents: [{ role: "user", parts }] });
      const rawText = result.response.text().trim();
      const jsonText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      return NextResponse.json({ strategy: JSON.parse(jsonText) });
    }
  } catch (err: any) {
    console.error("Fatal GTM Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
