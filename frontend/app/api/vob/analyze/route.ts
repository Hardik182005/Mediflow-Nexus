import { NextRequest, NextResponse } from "next/server";
import { callOpenAI, callOpenAIVision, callGroqFallback, cleanJsonResponse } from "@/lib/ai-provider";

const VOB_SYSTEM_PROMPT = `You are an AI Healthcare Revenue Cycle Assistant specializing in Insurance Verification (VOB), Prior Authorization, and Revenue Risk Analysis.

You receive one or more unstructured healthcare inputs and produce a structured, accurate, clinic-ready insurance intelligence report.

INPUT TYPES you may receive:
1) Insurance Card (image OCR text)
2) Eligibility / Benefits PDF text
3) Manual Form Inputs
4) Clinical context (Diagnosis, CPT codes, notes)

You MUST return ONLY a valid JSON object (no markdown, no code fences, no explanation) with exactly these keys:

{
  "insuranceSummary": {
    "patientName": "string or Unknown",
    "dob": "string or Unknown",
    "payerName": "string",
    "memberId": "string or Unknown",
    "groupNumber": "string or Unknown",
    "planType": "PPO | HMO | EPO | Medicare | Medicaid | Unknown",
    "coverageStatus": "Active | Inactive | Unknown"
  },
  "dataConfidence": {
    "score": number (0-100),
    "missingFields": ["string"],
    "conflicts": ["string"],
    "assumptions": ["string"]
  },
  "coverageBenefits": {
    "coverageStatus": "Active | Inactive | Unknown",
    "serviceEligibility": "Covered | Possibly Covered | Not Determined | Not Covered",
    "deductibleTotal": "string (e.g. $3,000)",
    "deductibleRemaining": "string",
    "copay": "string",
    "coinsurance": "string (e.g. 20%)",
    "outOfPocketMax": "string",
    "outOfPocketMet": "string",
    "patientResponsibilityEstimate": "string",
    "expectedReimbursement": "string",
    "notes": ["string"]
  },
  "priorAuth": {
    "required": "Required | Possibly Required | Not Required | Unknown",
    "requiredDocuments": ["string"],
    "missingDocuments": ["string"],
    "submissionReadiness": "Ready | Missing Docs | Not Ready",
    "notes": "string"
  },
  "denialRisk": {
    "level": "Low | Medium | High",
    "reasons": ["string"],
    "mitigationSteps": ["string"]
  },
  "revenueIntelligence": {
    "expectedReimbursementRange": "string (e.g. $800–$1,200)",
    "patientResponsibilityRange": "string",
    "revenueAtRisk": "Low | Medium | High",
    "delayRisk": "Low | Medium | High",
    "revenueNotes": ["string"]
  },
  "operationalRecommendation": {
    "action": "Proceed with scheduling | Hold until prior auth | Require additional verification | Collect upfront payment estimate",
    "reasoning": "string",
    "urgentActions": ["string"]
  },
  "patientSummary": {
    "estimatedCost": "string",
    "whatInsuranceCovers": "string",
    "nextSteps": ["string"]
  }
}

RULES:
- Do NOT claim real-time payer access
- Use correct healthcare terminology
- Be explicit about assumptions
- If data is missing, make reasonable expert assumptions and flag them in dataConfidence
- Return ONLY the JSON object, nothing else`;

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json() as {
      inputs: { type: string; content: string; fileBase64?: string; fileName?: string; mimeType?: string }[];
    };

    if (!inputs || inputs.length === 0) {
      return NextResponse.json({ error: "No inputs provided" }, { status: 400 });
    }

    // Build parts for multimodal analysis
    const hasFiles = inputs.some(inp => inp.fileBase64);
    let rawText: string;

    if (hasFiles) {
      // Use OpenAI Vision for file-based inputs
      const parts: any[] = [{ text: "Analyze the following insurance inputs and generate a clinic-ready VOB intelligence report as JSON:\n\n" }];
      for (const inp of inputs) {
        if (inp.fileBase64) {
          parts.push({ text: `--- ${inp.type.toUpperCase()} (${inp.fileName}) ---\n` });
          parts.push({ inlineData: { data: inp.fileBase64, mimeType: inp.mimeType || "application/pdf" } });
        } else {
          parts.push({ text: `--- ${inp.type.toUpperCase()} ---\n${inp.content.trim()}\n\n` });
        }
      }

      try {
        rawText = await callOpenAIVision(VOB_SYSTEM_PROMPT, parts, { maxTokens: 4096 });
      } catch (openaiErr: any) {
        console.warn("[VOB] OpenAI Vision failed, trying text-only Groq:", openaiErr.message);
        // Build text-only prompt for Groq fallback
        const textPrompt = inputs.map(inp => `--- ${inp.type.toUpperCase()} ---\n${inp.content || "[File uploaded]"}`).join("\n\n");
        rawText = await callGroqFallback(VOB_SYSTEM_PROMPT, textPrompt, { maxTokens: 4096 });
      }
    } else {
      // Text-only inputs
      const textPrompt = inputs.map(inp => `--- ${inp.type.toUpperCase()} ---\n${inp.content.trim()}`).join("\n\n");

      try {
        rawText = await callOpenAI(VOB_SYSTEM_PROMPT, textPrompt, { maxTokens: 4096 });
      } catch (openaiErr: any) {
        console.warn("[VOB] OpenAI failed, trying Groq:", openaiErr.message);
        rawText = await callGroqFallback(VOB_SYSTEM_PROMPT, textPrompt, { maxTokens: 4096 });
      }
    }

    const jsonText = cleanJsonResponse(rawText);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ raw: rawText }, { status: 200 });
    }

    return NextResponse.json({ report: parsed }, { status: 200 });
  } catch (err: unknown) {
    console.error("[VOB Analyze Error]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
