import { NextResponse } from "next/server";
import { callOpenAI, callOpenAIVision, callGroqFallback, cleanJsonResponse } from "@/lib/ai-provider";
import { createClient } from "@/lib/supabase/server";

const VOB_SYSTEM_PROMPT = `You are a healthcare insurance verification (VOB) expert.
Analyze the provided insurance inputs and generate a clinic-ready VOB intelligence report.

Return ONLY a valid JSON object with these 8 sections:
{
  "insuranceSummary": { "patientName": "", "dob": "", "payerName": "", "planType": "", "memberId": "", "groupNumber": "", "coverageStatus": "Active" },
  "dataConfidence": { "score": 85, "missingFields": [], "assumptions": [], "conflicts": [] },
  "coverageBenefits": { "coverageStatus": "Active", "serviceEligibility": "Covered", "deductibleTotal": "", "deductibleRemaining": "", "copay": "", "coinsurance": "", "outOfPocketMax": "", "outOfPocketMet": "", "patientResponsibilityEstimate": "", "expectedReimbursement": "", "notes": [] },
  "priorAuth": { "required": "Not Required", "submissionReadiness": "Ready", "requiredDocuments": [], "missingDocuments": [], "notes": "" },
  "denialRisk": { "level": "Low", "reasons": [], "mitigationSteps": [] },
  "revenueIntelligence": { "expectedReimbursementRange": "", "patientResponsibilityRange": "", "revenueAtRisk": "Low", "delayRisk": "Low", "revenueNotes": [] },
  "operationalRecommendation": { "action": "Proceed with scheduling", "reasoning": "", "urgentActions": [] },
  "patientSummary": { "estimatedCost": "", "whatInsuranceCovers": "", "nextSteps": [] }
}`;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();

    const parts: any[] = [];
    if (body.inputs && Array.isArray(body.inputs)) {
      parts.push({ text: "Analyze the following insurance inputs and generate a clinic-ready VOB intelligence report as JSON:\n\n" });
      for (const inp of body.inputs) {
        if (inp.fileBase64) {
          parts.push({ text: `--- ${(inp.type || "Document").toUpperCase()} (${inp.fileName || "uploaded"}) ---\n` });
          parts.push({ inlineData: { data: inp.fileBase64, mimeType: inp.mimeType || "application/pdf" } });
        } else if (inp.content && inp.content.trim()) {
          parts.push({ text: `--- ${(inp.type || "Input").toUpperCase()} ---\n${inp.content.trim()}\n\n` });
        }
      }
    } else {
      return NextResponse.json({ error: "No inputs provided" }, { status: 400 });
    }

    let vobReport: any = null;

    // PRIMARY: OpenAI GPT-4o-mini
    try {
      console.log("[VOB] Using OpenAI GPT-4o-mini...");
      const hasFiles = body.inputs.some((inp: any) => inp.fileBase64);

      let rawText: string;
      if (hasFiles) {
        rawText = await callOpenAIVision(VOB_SYSTEM_PROMPT, parts, { maxTokens: 4096 });
      } else {
        const textPrompt = body.inputs.map((inp: any) => `--- ${(inp.type || "Input").toUpperCase()} ---\n${inp.content?.trim() || "[File]"}`).join("\n\n");
        rawText = await callOpenAI(VOB_SYSTEM_PROMPT, textPrompt, { maxTokens: 4096 });
      }

      const jsonText = cleanJsonResponse(rawText);
      vobReport = JSON.parse(jsonText);
      console.log("[VOB] OpenAI Success.");
    } catch (openaiErr: any) {
      console.warn("[VOB] OpenAI failed, trying Groq:", openaiErr.message);

      // FALLBACK: Groq (text-only)
      const textPrompt = body.inputs.map((inp: any) => `--- ${(inp.type || "Input").toUpperCase()} ---\n${inp.content?.trim() || "[File uploaded]"}`).join("\n\n");
      const groqResult = await callGroqFallback(VOB_SYSTEM_PROMPT, textPrompt, { maxTokens: 4096 });
      const jsonText = cleanJsonResponse(groqResult);
      vobReport = JSON.parse(jsonText);
    }

    // Save to Supabase (non-blocking)
    try {
      await supabase.from('insurance_cases').insert([{
        patient_name: vobReport.insuranceSummary?.patientName || "Unknown",
        vob_data: vobReport,
        status: 'verified',
        cpt_code: "VOB-AI",
        insurance_provider: vobReport.insuranceSummary?.payerName || "AI Analyzed",
        denial_risk_score: vobReport.denialRisk?.level === "High" ? 80 : vobReport.denialRisk?.level === "Medium" ? 50 : 20,
      }]);
    } catch (dbErr) {
      console.error("Supabase save error (non-blocking):", dbErr);
    }

    return NextResponse.json({ report: vobReport });
  } catch (error: any) {
    console.error("VOB Analysis Fatal Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze insurance data." }, { status: 500 });
  }
}
