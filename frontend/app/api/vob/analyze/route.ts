import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

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
      inputs: { type: string; content: string }[];
    };

    if (!inputs || inputs.length === 0) {
      return NextResponse.json({ error: "No inputs provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured. Please add your key to .env.local and restart the dev server." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: VOB_SYSTEM_PROMPT,
    });

    const userContent = inputs
      .map((inp) => `--- ${inp.type.toUpperCase()} ---\n${inp.content.trim()}`)
      .join("\n\n");

    const prompt = `Analyze the following insurance inputs and generate a clinic-ready VOB intelligence report as JSON:\n\n${userContent}`;

    const result = await model.generateContent(prompt);
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

    return NextResponse.json({ report: parsed }, { status: 200 });
  } catch (err: unknown) {
    console.error("[VOB Analyze Error]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
