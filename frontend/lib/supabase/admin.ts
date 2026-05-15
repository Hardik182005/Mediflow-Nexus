import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client that bypasses RLS.
 * Uses SUPABASE_SERVICE_ROLE_KEY if available, falls back to anon key.
 * Only use this in server-side API routes, never expose to the client.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  // Prefer service role key (bypasses RLS), fall back to anon key
  const key = serviceRoleKey || anonKey

  if (serviceRoleKey) {
    console.log('[Supabase Admin] Using service role key (RLS bypassed)')
  } else {
    console.warn('[Supabase Admin] No service role key found, using anon key (RLS active)')
  }

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
