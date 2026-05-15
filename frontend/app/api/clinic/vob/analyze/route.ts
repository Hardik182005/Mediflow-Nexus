import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: VOB_SYSTEM_PROMPT,
    });

    // Support both the old format (documentBase64) and new multi-input format (inputs[])
    const parts: any[] = [];

    if (body.inputs && Array.isArray(body.inputs)) {
      parts.push({ text: "Analyze the following insurance inputs and generate a clinic-ready VOB intelligence report as JSON:\n\n" });
      for (const inp of body.inputs) {
        if (inp.fileBase64) {
          parts.push({ text: `--- ${(inp.type || "Document").toUpperCase()} (${inp.fileName || "uploaded"}) ---\n` });
          parts.push({
            inlineData: {
              data: inp.fileBase64,
              mimeType: inp.mimeType || "application/pdf"
            }
          });
        } else if (inp.content && inp.content.trim()) {
          parts.push({ text: `--- ${(inp.type || "Input").toUpperCase()} ---\n${inp.content.trim()}\n\n` });
        }
      }
    } else if (body.documentBase64) {
      // Legacy format
      const base64Data = body.documentBase64.includes(",") ? body.documentBase64.split(",")[1] : body.documentBase64;
      parts.push({ text: `Analyze this insurance document for treatment: ${body.treatmentType || "General"}\n\n` });
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      });
    } else {
      return NextResponse.json({ error: "No inputs provided" }, { status: 400 });
    }

    const result = await model.generateContent(parts);
    const rawText = result.response.text().trim();
    const jsonText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
    const vobReport = JSON.parse(jsonText);

    // Try to save to Supabase (non-blocking)
    try {
      await supabase.from('insurance_cases').insert([{
        patient_name: vobReport.insuranceSummary?.patientName || vobReport.patient_info?.name || "Unknown",
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
    console.error("VOB Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
