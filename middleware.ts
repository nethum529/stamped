import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, skip auth and allow all requests
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Skipping authentication middleware.')
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired
  const { data: { session } } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/auth/callback', '/employee-login']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/'))

  // If user is not signed in and trying to access protected route
  if (!session && !isPublicRoute) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access auth pages, redirect appropriately
  if (session && (pathname === '/login' || pathname === '/signup')) {
    const userType = session.user.user_metadata?.user_type || 'employee'
    
    // Redirect to appropriate dashboard based on user type
    if (userType === 'client') {
      return NextResponse.redirect(new URL('/client-portal/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Role-based access control for authenticated users
  if (session && !isPublicRoute) {
    const userType = session.user.user_metadata?.user_type
    const role = session.user.user_metadata?.role

    // Client trying to access employee routes
    if (userType === 'client' && !pathname.startsWith('/client-portal') && pathname !== '/settings') {
      return NextResponse.redirect(new URL('/client-portal/dashboard', request.url))
    }

    // Employee trying to access client routes
    if (userType === 'employee' && pathname.startsWith('/client-portal')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Role-specific route access for employees
    if (userType === 'employee') {
      // Compliance-only routes
      if (pathname.startsWith('/compliance') && role !== 'compliance_officer' && role !== 'executive') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Risk analyst routes  
      if (pathname.startsWith('/risk-analyst') && role !== 'risk_analyst' && role !== 'executive') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      // Executive-only routes
      if (pathname.startsWith('/executive') && role !== 'executive') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
