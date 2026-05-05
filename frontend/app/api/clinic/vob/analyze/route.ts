import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { documentBase64, treatmentType, patientId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Convert base64 to parts for Gemini
    const imageParts = documentBase64 ? [
      {
        inlineData: {
          data: documentBase64.split(",")[1] || documentBase64,
          mimeType: "image/jpeg",
        },
      },
    ] : [];

    const prompt = `
      You are a healthcare insurance verification (VOB) expert in India.
      Analyze the provided insurance document and the patient's requested treatment: ${treatmentType}.
      
      Extract exactly these 8 sections into a structured JSON report:
      1. Patient Information (Name, Policy #, Plan, Dates)
      2. Coverage Summary (Sum Insured, Remaining balance, Waiting periods)
      3. Hospitalization Benefits (Room rent limits, Allowed types)
      4. Financials (Co-pay %, Deductibles, Sub-limits)
      5. Exclusions (What is explicitly NOT covered)
      6. Prior Authorization (Is it required for ${treatmentType}?)
      7. Network Status (In-Network/Cashless status)
      8. AI Risk Assessment (Risk Score, Denial Prob %, ROI Recommendation)
      
      CRITICAL INSTRUCTIONS:
      - Be conservative with ROI estimates.
      - Flag ANY active waiting periods or sub-limits that could lead to a denial for ${treatmentType}.
      - Risk Score must be Low, Medium, or High.
      - Return ONLY a valid JSON object.
      
      JSON Structure:
      {
        "patient_info": { "name": "", "dob": "", "policy_number": "", "group_number": "", "insurance_company": "", "plan_name": "", "valid_from": "", "valid_to": "" },
        "coverage_summary": { "sum_insured": "", "amount_used_ytd": "", "remaining_balance": "", "waiting_periods": [] },
        "hospitalization_benefits": { "inpatient_covered": true, "room_type_allowed": "", "room_rent_limit": "", "day_care_procedures": true },
        "financials": { "copayment_percent": "", "deductible": "", "surgery_sublimit": "", "diagnostics_sublimit": "" },
        "exclusions": [],
        "prior_auth": { "required": true, "procedures": [], "contact_info": "", "tat_hours": "" },
        "network_status": { "status": "IN-NETWORK", "cashless_eligible": true, "limit": "" },
        "ai_risk_assessment": { "risk_score": "Low", "risk_factors": [], "denial_probability": "", "estimated_reimbursement": "", "recommendations": [] }
      }
    `;

    const result = await model.generateContent(imageParts.length > 0 ? [...imageParts, prompt] : [prompt]);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    const vobReport = JSON.parse(text);

    // Save to Supabase
    const { data: savedCase, error: saveError } = await supabase
      .from('insurance_cases')
      .insert([{
        patient_id: patientId,
        vob_data: vobReport,
        risk_score: vobReport.ai_risk_assessment.risk_score,
        denial_probability: parseFloat(vobReport.ai_risk_assessment.denial_probability.replace('%', '')),
        estimated_reimbursement: parseFloat(vobReport.ai_risk_assessment.estimated_reimbursement.replace(/[^0-9.]/g, '')),
        status: 'verified'
      }])
      .select()
      .single();

    if (saveError) console.error("Supabase Save Error:", saveError);

    return NextResponse.json({ report: vobReport, caseId: savedCase?.id });
  } catch (error: any) {
    console.error("VOB Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
