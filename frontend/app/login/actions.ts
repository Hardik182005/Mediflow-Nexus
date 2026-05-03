'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error, data: authData } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return redirect('/login?message=Could not authenticate user')
  }

  // Route based on stored role
  const role = authData.user?.user_metadata?.role || 'startup'
  revalidatePath('/', 'layout')
  redirect(role === 'clinic' ? '/dashboard' : '/launch-engine')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  
  const role = formData.get('role') as string || 'startup'

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        name: formData.get('name') as string,
        organization: formData.get('organization') as string,
        role: role, // 'startup' or 'clinic'
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return redirect('/login?message=Could not create user')
  }

  revalidatePath('/', 'layout')
  redirect(role === 'clinic' ? '/dashboard' : '/launch-engine')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
