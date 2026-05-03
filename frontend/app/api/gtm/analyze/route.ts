import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
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
  // PPT/PPTX/DOCX are not natively supported — handled as plain text if possible
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
- Read and extract information from ALL provided files (PDFs, slides, videos, images, documents)
- Be specific, use healthcare-specific language
- If data is missing, make reasonable expert assumptions
- Output must be investor-ready quality
- Return ONLY the JSON object, nothing else
- VERY IMPORTANT: For 'buyerDiscovery.sampleBuyerProfiles', YOU MUST ONLY select 3-5 organizations from the provided 'BUYER DATASET' in the context. Use their exact 'name' for 'orgName', 'type' for 'type', and provide a 'reason' explaining why they are an ideal fit based on their specific 'key_challenges' and 'specialties'.`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { files, textContext, discoveryMode, startupId } = body;

    // ── Discovery Mode ────────────────────────────────────
    if (discoveryMode && startupId) {
      const { data: startup } = await supabase
        .from('startup_profiles')
        .select('*')
        .eq('id', startupId)
        .single();

      if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });

      const buyersPath = path.join(process.cwd(), "buyers.json");
      const buyersData = JSON.parse(fs.readFileSync(buyersPath, "utf-8"));

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `
        You are a MedTech Market Analyst. 
        Match this startup to the best 5 potential buyers from the provided dataset.
        
        STARTUP PROFILE:
        - Name: ${startup.name}
        - Description: ${startup.description}
        - Solution Type: ${startup.solution_type}
        - Target Market: ${startup.target_market}
        
        BUYER DATASET (Top 100 sample):
        ${JSON.stringify(buyersData.slice(0, 100))}
        
        TASK:
        1. Select 5 entities from the dataset that have the highest synergy with the startup's solution.
        2. Assign a match score (0-100).
        3. Provide a 1-sentence "AI Match Rationale" for each.
        
        RETURN JSON ONLY in this format:
        {
          "matches": [
            { "name": "Contact Person", "organization": "Hospital Name", "score": 95, "reason": "Rationale here" }
          ]
        }
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(text));
    }

    // ── Standard GTM Generation Mode ──────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Add your key to .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    const body = await req.json() as {
      files: { name: string; ext: string; base64: string; label: string }[];
      textContext?: string;
    };

    if ((!body.files || body.files.length === 0) && !body.textContext) {
      return NextResponse.json({ error: "No files or context provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: GTM_SYSTEM_PROMPT,
    });

    // ── Build content parts ───────────────────────────────────
    const parts: Part[] = [];

    // Opening instruction
    parts.push({
      text: "Analyze the following healthcare startup documents and generate a complete GTM strategy as JSON:",
    });

    // File parts (inline base64)
    for (const file of body.files ?? []) {
      const mimeType = MIME_MAP[file.ext.toLowerCase()] ?? "application/octet-stream";

      // Skip unsupported binary formats gracefully
      if (mimeType === "application/octet-stream") {
        parts.push({ text: `[File "${file.name}" could not be read directly — skipping]` });
        continue;
      }

      parts.push({ text: `--- ${file.label.toUpperCase()} (${file.name}) ---` });
      parts.push({
        inlineData: {
          mimeType,
          data: file.base64,
        },
      });
    }

    // Optional free-text context
    if (body.textContext?.trim()) {
      parts.push({ text: `--- ADDITIONAL CONTEXT ---\n${body.textContext.trim()}` });
    }

    try {
      const buyersPath = path.join(process.cwd(), "..", "buyers.json");
      const buyersData = fs.readFileSync(buyersPath, "utf8");
      parts.push({ text: `\n\n--- BUYER DATASET (USE FOR sampleBuyerProfiles) ---\n${buyersData}\n--- END BUYER DATASET ---\n` });
    } catch (err) {
      console.warn("[GTM Analyze] Could not load buyers.json dataset", err);
    }

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    const rawText = result.response.text().trim();

    const jsonText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ raw: rawText }, { status: 200 });
    }

    return NextResponse.json({ strategy: parsed }, { status: 200 });
  } catch (err: unknown) {
    console.error("[GTM Analyze Error]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
