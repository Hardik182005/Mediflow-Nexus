import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Simplified and more robust redirection logic
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isLandingPage = request.nextUrl.pathname === '/'
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Method: ${request.method}, User: ${!!user}`)

  if (!user && !isLoginPage && !isLandingPage && !isAuthRoute) {
    console.log(`[Middleware] Redirecting to login: ${request.nextUrl.pathname}`)
    // If no user and not on a public page, redirect to login
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If user exists and tries to go to login, send them to workspace selector
  if (user && isLoginPage) {
    console.log(`[Middleware] User already logged in, redirecting from login page`)
    const url = request.nextUrl.clone()
    url.pathname = '/'
    url.hash = 'workspaces'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
