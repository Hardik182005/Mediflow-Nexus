import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export default async function checkDatabase() {
  const admin = createAdminClient();
  let info = {
    clinicsCount: 0,
    patientsCount: 0,
    userHasClinic: false,
    clinicId: "" as string,
    userId: "" as string,
    message: ""
  };

  // 1. Check/create clinics using admin client (bypasses RLS)
  const { data: clinics, error: clinicsError } = await admin.from('clinics').select('id, name');
  
  if (clinicsError) {
    info.message += `Clinics error: ${clinicsError.message}. `;
  }
  
  info.clinicsCount = clinics?.length || 0;

  let defaultClinicId: string;

  if (info.clinicsCount === 0) {
    const { data: newClinic, error: insertError } = await admin.from('clinics').insert([
      {
        name: "Mediflow General Clinic",
        specialty: "General Practice",
        status: "active"
      }
    ]).select('id').single();

    if (insertError) {
      info.message += `Failed to create clinic: ${insertError.message}. `;
      defaultClinicId = "00000000-0000-0000-0000-000000000000";
    } else {
      defaultClinicId = newClinic.id;
      info.clinicsCount = 1;
      info.message += "Created default clinic. ";
    }
  } else {
    defaultClinicId = clinics![0].id;
  }

  info.clinicId = defaultClinicId;

  // 2. Check user and ensure clinic assignment
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      info.userId = user.id;
      
      // Use admin client to read user profile (bypasses RLS)
      const { data: profile, error: profileError } = await admin
        .from('users')
        .select('clinic_id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // User record doesn't exist — create it
        const { error: createError } = await admin.from('users').insert([{
          id: user.id,
          email: user.email || '',
          name: user.email?.split('@')[0] || 'User',
          clinic_id: defaultClinicId,
          role: 'clinic_staff'
        }]);

        if (createError) {
          info.message += `Failed to create user profile: ${createError.message}. `;
        } else {
          info.userHasClinic = true;
          info.message += "Created user profile with clinic assignment. ";
        }
      } else if (profile && !profile.clinic_id) {
        // User exists but has no clinic — assign one
        const { error: updateError } = await admin
          .from('users')
          .update({ clinic_id: defaultClinicId })
          .eq('id', user.id);

        if (updateError) {
          info.message += `Failed to assign clinic: ${updateError.message}. `;
        } else {
          info.userHasClinic = true;
          info.message += "Auto-assigned clinic to user. ";
        }
      } else if (profile?.clinic_id) {
        info.userHasClinic = true;
      }
    } else {
      info.message += "No authenticated user found. ";
    }
  } catch (authErr: any) {
    info.message += `Auth check error: ${authErr.message}. `;
  }

  // 3. Check patients count using admin client (bypasses RLS)
  const { count, error: countError } = await admin
    .from('patients')
    .select('*', { count: 'exact', head: true });
  
  if (countError) {
    info.message += `Patient count error: ${countError.message}. `;
  }
  
  info.patientsCount = count || 0;

  info.message += `Clinics: ${info.clinicsCount}, Patients: ${info.patientsCount}, User linked: ${info.userHasClinic}.`;
  return info;
}
