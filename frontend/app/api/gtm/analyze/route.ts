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

// ── Condensed system prompt for Groq (fits within token limits) ──
const GROQ_SYSTEM_PROMPT = `You are a Healthcare GTM Strategist AI. Analyze the startup inputs and return ONLY valid JSON (no markdown, no code fences) with these keys: startupSummary{companyName,industry,productType,stage,tagline}, productIntelligence{problemStatement,solutionDescription,keyFeatures[],keyBenefits[],differentiation,complexityLevel,deploymentType,pricingModel}, icp{targetSegments[],specializations[],organizationSize,geography,technologyMaturity,annualRevenue}, buyerPersona{primaryBuyer{title,painPoints[],motivation},secondaryBuyers[{title,role}],buyingTriggers[]}, valueProposition{headline,statements[],roi}, messaging{elevatorPitch,salesPitch,emailOutreach{subject,body},linkedinOutreach,tagline,keyMarketingPoints[]}, demoStrategy{workflowSteps[],talkingPoints[],objectionHandling[{objection,response}]}, buyerDiscovery{targetClinicTypes[],referralPartners[],strategicPartnerships[],sampleBuyerProfiles[{orgName,type,reason}]}, salesStrategy{approach,funnel[],conversionDrivers[],objections[{objection,solution}]}, roiImpact{revenueImpact,costSavings,efficiencyGain,paybackPeriod,metrics[]}, marketplaceMatch{idealMatches[{clinicType,reason,fitScore}],recommendedAction}. Be specific with healthcare language.`;

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

// ── OpenAI GPT-4o (Primary — reliable) ──────────
async function callOpenAI(systemPrompt: string, userContent: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── OpenAI with vision support (for images/PDFs) ──────────
async function callOpenAIWithVision(systemPrompt: string, parts: any[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  // Build OpenAI-format messages with image_url for visual content
  const contentParts: any[] = [];
  for (const part of parts) {
    if (part.text) {
      contentParts.push({ type: "text", text: part.text });
    } else if (part.inlineData) {
      const { mimeType, data } = part.inlineData;
      if (mimeType.startsWith("image/")) {
        contentParts.push({
          type: "image_url",
          image_url: { url: `data:${mimeType};base64,${data}`, detail: "low" },
        });
      } else {
        // For non-image files (PDF, video, audio), decode text if possible
        try {
          const decoded = Buffer.from(data, "base64").toString("utf-8");
          contentParts.push({ type: "text", text: decoded.substring(0, 5000) });
        } catch {
          contentParts.push({ type: "text", text: "[Binary file content - make reasonable assumptions]" });
        }
      }
    }
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: contentParts },
      ],
      temperature: 0.4,
      max_tokens: 8000,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI Vision API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Groq Fallback (when OpenAI fails) ──────────
async function callGroqFallback(systemPrompt: string, userContent: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const maxContentChars = 6000;
  const truncatedContent = userContent.length > maxContentChars
    ? userContent.substring(0, maxContentChars) + "\n[Content truncated for processing]"
    : userContent;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: truncatedContent },
      ],
      temperature: 0.4,
      max_tokens: 4096,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ── Build a text-only prompt from file parts (for fallbacks) ──
function buildTextPrompt(files: any[], textContext?: string, buyersData?: string): string {
  let prompt = "";
  for (const file of files ?? []) {
    prompt += `\n--- ${(file.label || file.name || "FILE").toUpperCase()} (${file.name}) ---\n`;
    const ext = (file.ext || "").toLowerCase().replace(".", "");
    if (["txt", "md", "csv", "html"].includes(ext) && file.base64) {
      try {
        const decoded = Buffer.from(file.base64, "base64").toString("utf-8");
        prompt += decoded.substring(0, 3000) + "\n";
      } catch {
        prompt += "[Binary file - content extracted by AI]\n";
      }
    } else {
      prompt += `[${file.name} - ${ext.toUpperCase()} file uploaded, make reasonable assumptions]\n`;
    }
  }
  if (textContext?.trim()) prompt += `\n--- CONTEXT ---\n${textContext.trim().substring(0, 2000)}\n`;
  if (buyersData) {
    try {
      const parsed = JSON.parse(buyersData);
      const limited = Array.isArray(parsed) ? parsed.slice(0, 5) : parsed;
      prompt += `\n--- SAMPLE BUYERS ---\n${JSON.stringify(limited)}\n`;
    } catch {
      prompt += `\n--- BUYER DATA ---\n${buyersData.substring(0, 1000)}\n`;
    }
  }
  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await req.json() as any;
    const { files, textContext, discoveryMode, startupId } = body;

    // ── Discovery Mode ──
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
        BUYER DATASET: ${JSON.stringify(buyersData.slice(0, 30))}
        RETURN JSON: { "matches": [{ "name": "string", "organization": "string", "score": number, "reason": "string" }] }`;

      // Try OpenAI → Groq
      try {
        const result = await callOpenAI(
          "You are a healthcare buyer matching AI. Return valid JSON only with a 'matches' array.",
          prompt
        );
        const cleanText = result.replace(/```json|```/g, "").trim();
        return NextResponse.json(JSON.parse(cleanText));
      } catch (openaiErr: any) {
        console.warn("OpenAI failed for discovery, using Groq:", openaiErr.message);
        const groqResult = await callGroqFallback(
          "You are a healthcare buyer matching AI. Return valid JSON only with a 'matches' array.",
          prompt.substring(0, 5000)
        );
        const cleanText = groqResult.replace(/```json|```/g, "").trim();
        return NextResponse.json(JSON.parse(cleanText));
      }
    }

    // ── Standard Mode: Strategy Generation ──
    // Build multimodal parts for OpenAI vision
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

    // PRIMARY: OpenAI GPT-4o (supports vision)
    try {
      const rawText = await callOpenAIWithVision(GTM_SYSTEM_PROMPT, parts);
      const jsonText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      const strategy = JSON.parse(jsonText);

      // Save to Supabase
      if (startupId) {
        await supabase.from('gtm_recommendations').insert([{
          startup_id: startupId,
          strategy_json: strategy,
          icp_data: strategy.icp,
          persona_data: strategy.buyerPersona,
          messaging_data: strategy.messaging,
          status: 'completed'
        }]);
      }

      return NextResponse.json({ strategy });
    } catch (openaiErr: any) {
      console.warn("OpenAI GPT-4o failed, using Groq fallback:", openaiErr.message);

      // FALLBACK: Groq (text-only, condensed)
      try {
        const textPrompt = buildTextPrompt(files, textContext, buyers || undefined);
        const groqResult = await callGroqFallback(GROQ_SYSTEM_PROMPT, textPrompt);
        const jsonText = groqResult.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
        return NextResponse.json({ strategy: JSON.parse(jsonText) });
      } catch (groqErr: any) {
        console.error("Both OpenAI and Groq failed:", groqErr.message);
        throw new Error(`All AI providers failed. OpenAI: ${openaiErr.message}. Groq: ${groqErr.message}`);
      }
    }
  } catch (err: any) {
    console.error("Fatal GTM Error:", err);
    return NextResponse.json({
      error: err.message || "Unknown error",
      possibleCauses: [
        "OPENAI_API_KEY not set in .env.local",
        "File too large or format unsupported",
        "API quota exceeded on all providers"
      ]
    }, { status: 500 });
  }
}
