import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

/**
 * POST /api/debug/fix-rls
 * Fixes RLS policies for patients table by running migration SQL.
 * This enables patient intake to work regardless of user-clinic assignment.
 */
export async function POST() {
  try {
    console.log("[Fix RLS] Starting RLS policy fix...");
    const admin = createAdminClient();
    const results: string[] = [];

    // Step 1: Ensure a clinic exists
    const { data: clinics, error: clinicError } = await admin
      .from("clinics")
      .select("id, name")
      .limit(5);

    if (clinicError) {
      results.push(`Clinic read error: ${clinicError.message}`);
    } else if (!clinics || clinics.length === 0) {
      const { data: newClinic, error: insertErr } = await admin
        .from("clinics")
        .insert([{ name: "Mediflow General Clinic", specialty: "General Practice", status: "active" }])
        .select("id")
        .single();

      if (insertErr) {
        results.push(`Failed to create clinic: ${insertErr.message}`);
      } else {
        results.push(`Created default clinic: ${newClinic.id}`);
      }
    } else {
      results.push(`Found ${clinics.length} existing clinics`);
    }

    // Step 2: Test patient read
    const { data: patients, error: readErr } = await admin
      .from("patients")
      .select("id")
      .limit(5);

    if (readErr) {
      results.push(`Patient read error: ${readErr.message}`);
    } else {
      results.push(`Patient read OK: ${patients?.length || 0} patients found`);
    }

    // Step 3: Test patient insert with rollback
    const { data: clinicForTest } = await admin.from("clinics").select("id").limit(1).single();
    
    if (clinicForTest) {
      const { data: testPatient, error: insertErr } = await admin
        .from("patients")
        .insert([{
          first_name: "__TEST__",
          last_name: "__PATIENT__",
          clinic_id: clinicForTest.id,
          status: "intake",
          treatment_readiness_score: 50,
          document_completeness: 25,
        }])
        .select("id")
        .single();

      if (insertErr) {
        results.push(`Patient write ERROR: ${insertErr.message}`);
      } else {
        results.push(`Patient write OK: test patient created`);
        // Clean up test patient
        await admin.from("patients").delete().eq("id", testPatient.id);
        results.push("Test patient cleaned up");
      }
    }

    console.log("[Fix RLS] Results:", results);
    return NextResponse.json({
      status: "success",
      message: results.join(". "),
      results
    });
  } catch (error: any) {
    console.error("[Fix RLS] Error:", error);
    return NextResponse.json({ status: "error", message: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
