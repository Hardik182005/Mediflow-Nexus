import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VertexAI } from "@google-cloud/vertexai";
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
    } else {
      return NextResponse.json({ error: "No inputs provided" }, { status: 400 });
    }

    let vobReport: any = null;

    // TRY VERTEX AI FIRST (Higher Limits)
    try {
      console.log("[VOB] Attempting Vertex AI Analysis...");
      const vertexAI = new VertexAI({
        project: process.env.GCP_PROJECT_ID || "mediflow-nexus-2026",
        location: process.env.GCP_LOCATION || "us-central1"
      });

      const vertexModel = vertexAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: { role: "system", parts: [{ text: VOB_SYSTEM_PROMPT }] }
      });

      const result = await vertexModel.generateContent({ contents: [{ role: "user", parts }] });
      const rawText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonText = (rawText as string).replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      vobReport = JSON.parse(jsonText);
      console.log("[VOB] Vertex AI Success.");
    } catch (vertexErr: any) {
      console.error("[VOB] Vertex AI failed, falling back to Google AI SDK:", vertexErr.message);
      
      // FALLBACK TO GOOGLE AI SDK
      if (!process.env.GEMINI_API_KEY) {
        throw new Error("No API keys available for analysis.");
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: VOB_SYSTEM_PROMPT,
      });

      const result = await model.generateContent(parts);
      const rawText = result.response.text().trim();
      const jsonText = rawText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();
      vobReport = JSON.parse(jsonText);
    }

    // Try to save to Supabase (non-blocking)
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
    return NextResponse.json({ error: error.message || "Failed to analyze insurance data. Please try with smaller documents." }, { status: 500 });
  }
}
