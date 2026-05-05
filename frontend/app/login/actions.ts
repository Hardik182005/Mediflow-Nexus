'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  console.log(`[Login] Attempt for: ${email}`)
  
  const supabase = await createClient()

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error(`[Login] Error: ${error.message}`)
    return redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  console.log(`[Login] Success for: ${email}`)

  // Route based on stored role or next param
  const role = authData.user?.user_metadata?.role || 'startup'
  const nextPath = formData.get('next') as string;
  revalidatePath('/', 'layout')
  
  if (nextPath && nextPath !== '/login') {
    redirect(nextPath)
  } else {
    redirect(role === 'clinic' ? '/dashboard' : '/launch-engine')
  }
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

  // Route based on selected role or next param
  const nextPath = formData.get('next') as string;
  revalidatePath('/', 'layout')
  
  if (nextPath && nextPath !== '/login') {
    redirect(nextPath)
  } else {
    redirect(role === 'clinic' ? '/dashboard' : '/launch-engine')
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
