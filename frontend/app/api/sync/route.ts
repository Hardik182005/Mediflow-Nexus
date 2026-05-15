import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Fetch all critical data in parallel using admin client
    const [
      { data: patients, error: pError },
      { data: insuranceCases, error: iError },
      { data: dropoffs, error: dError }
    ] = await Promise.all([
      supabase.from('patients').select('*').order('created_at', { ascending: false }),
      supabase.from('insurance_cases').select('*').order('created_at', { ascending: false }),
      supabase.from('dropoff_predictions').select('*, patients(first_name, last_name)')
    ]);

    if (pError || iError || dError) {
      console.error("[Sync API Error]", { pError, iError, dError });
    }

    return NextResponse.json({
      patients: patients || [],
      insuranceCases: insuranceCases || [],
      dropoffs: dropoffs || [],
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[Sync API Critical Error]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
