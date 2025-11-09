import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle errors from Supabase
  if (error) {
    console.error('Auth callback error:', error, errorDescription)
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, requestUrl.origin)
    )
  }

  if (code) {
    try {
      const supabase = await createServerSupabaseClient()

      // Exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent('Failed to verify email')}`, requestUrl.origin)
        )
      }

      // Get the verified user
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('Error getting user:', userError)
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent('Authentication failed')}`, requestUrl.origin)
        )
      }

      // Check if this is an email verification or password reset
      const type = requestUrl.searchParams.get('type')
      
      if (type === 'recovery') {
        // Password reset flow - redirect to password reset page
        return NextResponse.redirect(new URL('/auth/reset-password', requestUrl.origin))
      }

      // Email verification successful - redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard?verified=true', requestUrl.origin))
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent('An unexpected error occurred')}`, requestUrl.origin)
      )
    }
  }

  // No code present, redirect to login
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}

