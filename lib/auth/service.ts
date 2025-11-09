'use client'

import { createClient } from '@/lib/supabase/client'
import { SignUpData, SignInData, AuthResponse, AuthErrorCode } from './types'
import { formatAuthError, AuthServiceError } from './errors'
import { validateSignUpForm, validateSignInForm } from './validation'

export class AuthService {
  private supabase = createClient()

  /**
   * Sign up a new user with comprehensive error handling
   * Handles: duplicate emails, weak passwords, invalid emails, rate limiting, network errors
   */
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      // Client-side validation first
      const validation = validateSignUpForm(
        data.email,
        data.password,
        data.password, // We don't pass confirmPassword to service, validation happens in UI
        data.name
      )

      if (!validation.valid) {
        return {
          success: false,
          error: {
            message: Object.values(validation.errors)[0],
            field: Object.keys(validation.errors)[0],
          },
        }
      }

      // Normalize email
      const normalizedEmail = data.email.toLowerCase().trim()

      // Check if user already exists (Supabase will also check, but we can provide better UX)
      const { data: existingUser } = await this.supabase
        .from('users')
        .select('email')
        .eq('email', normalizedEmail)
        .single()

      if (existingUser) {
        return {
          success: false,
          error: {
            message: 'An account with this email already exists',
            code: 'EMAIL_EXISTS',
            field: 'email',
          },
        }
      }

      // Create auth user with Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: normalizedEmail,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: data.name.trim(),
            display_name: data.name.trim(),
          },
        },
      })

      if (authError) {
        console.error('Supabase auth error:', authError)
        const formattedError = formatAuthError(authError)
        throw new AuthServiceError(
          authError.message,
          (formattedError.code || 'UNKNOWN_ERROR') as AuthErrorCode,
          authError
        )
      }

      if (!authData.user) {
        throw new AuthServiceError(
          'Failed to create user account',
          'UNKNOWN_ERROR'
        )
      }

      // Check if email confirmation is required
      const requiresVerification = authData.user.identities?.length === 0

      return {
        success: true,
        requiresVerification,
        user: authData.user,
      }
    } catch (error: any) {
      console.error('Sign up error:', error)

      // Handle rate limiting
      if (error.message?.includes('rate limit')) {
        return {
          success: false,
          error: {
            message: 'Too many sign-up attempts. Please try again in a few minutes',
            code: 'TOO_MANY_REQUESTS',
          },
        }
      }

      // Handle network errors
      if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        return {
          success: false,
          error: {
            message: 'Network error. Please check your connection and try again',
            code: 'NETWORK_ERROR',
          },
        }
      }

      // Format and return the error
      const formattedError = formatAuthError(error)
      return {
        success: false,
        error: formattedError,
      }
    }
  }

  /**
   * Sign in an existing user
   * Handles: invalid credentials, unverified email, disabled accounts, rate limiting
   */
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      // Client-side validation
      const validation = validateSignInForm(data.email, data.password)

      if (!validation.valid) {
        return {
          success: false,
          error: {
            message: Object.values(validation.errors)[0],
            field: Object.keys(validation.errors)[0],
          },
        }
      }

      const normalizedEmail = data.email.toLowerCase().trim()

      const { data: authData, error: authError } = await this.supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: data.password,
      })

      if (authError) {
        console.error('Sign in error:', authError)

        // Handle specific error cases
        if (authError.message.includes('Email not confirmed')) {
          return {
            success: false,
            requiresVerification: true,
            error: {
              message: 'Please verify your email before signing in. Check your inbox for the verification link.',
              code: 'EMAIL_NOT_CONFIRMED',
              field: 'email',
            },
          }
        }

        if (authError.message.includes('Invalid login credentials')) {
          return {
            success: false,
            error: {
              message: 'Invalid email or password',
              code: 'INVALID_CREDENTIALS',
            },
          }
        }

        const formattedError = formatAuthError(authError)
        throw new AuthServiceError(
          authError.message,
          (formattedError.code || 'UNKNOWN_ERROR') as AuthErrorCode,
          authError
        )
      }

      if (!authData.user) {
        throw new AuthServiceError(
          'Failed to sign in',
          'UNKNOWN_ERROR'
        )
      }

      return {
        success: true,
        user: authData.user,
      }
    } catch (error: any) {
      console.error('Sign in error:', error)

      // Handle rate limiting
      if (error.message?.includes('rate limit')) {
        return {
          success: false,
          error: {
            message: 'Too many sign-in attempts. Please try again in a few minutes',
            code: 'TOO_MANY_REQUESTS',
          },
        }
      }

      // Handle network errors
      if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        return {
          success: false,
          error: {
            message: 'Network error. Please check your connection and try again',
            code: 'NETWORK_ERROR',
          },
        }
      }

      const formattedError = formatAuthError(error)
      return {
        success: false,
        error: formattedError,
      }
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.signOut()

      if (error) {
        const formattedError = formatAuthError(error)
        throw new AuthServiceError(
          error.message,
          (formattedError.code || 'UNKNOWN_ERROR') as AuthErrorCode,
          error
        )
      }

      return { success: true }
    } catch (error: any) {
      console.error('Sign out error:', error)
      const formattedError = formatAuthError(error)
      return {
        success: false,
        error: formattedError,
      }
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<AuthResponse> {
    try {
      const normalizedEmail = email.toLowerCase().trim()

      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('rate limit')) {
          return {
            success: false,
            error: {
              message: 'Please wait a few minutes before requesting another verification email',
              code: 'TOO_MANY_REQUESTS',
            },
          }
        }

        const formattedError = formatAuthError(error)
        throw new AuthServiceError(
          error.message,
          (formattedError.code || 'UNKNOWN_ERROR') as AuthErrorCode,
          error
        )
      }

      return { success: true }
    } catch (error: any) {
      console.error('Resend verification error:', error)
      const formattedError = formatAuthError(error)
      return {
        success: false,
        error: formattedError,
      }
    }
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const normalizedEmail = email.toLowerCase().trim()

      const { error } = await this.supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        if (error.message.includes('rate limit')) {
          return {
            success: false,
            error: {
              message: 'Please wait a few minutes before requesting another password reset',
              code: 'TOO_MANY_REQUESTS',
            },
          }
        }

        const formattedError = formatAuthError(error)
        throw new AuthServiceError(
          error.message,
          (formattedError.code || 'UNKNOWN_ERROR') as AuthErrorCode,
          error
        )
      }

      return { success: true }
    } catch (error: any) {
      console.error('Password reset error:', error)
      const formattedError = formatAuthError(error)
      return {
        success: false,
        error: formattedError,
      }
    }
  }

  /**
   * Update password (when user is authenticated)
   */
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        const formattedError = formatAuthError(error)
        throw new AuthServiceError(
          error.message,
          (formattedError.code || 'UNKNOWN_ERROR') as AuthErrorCode,
          error
        )
      }

      return { success: true }
    } catch (error: any) {
      console.error('Update password error:', error)
      const formattedError = formatAuthError(error)
      return {
        success: false,
        error: formattedError,
      }
    }
  }

  /**
   * Get current user session
   */
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession()
    
    if (error) {
      console.error('Get session error:', error)
      return null
    }

    return session
  }

  /**
   * Get current user
   */
  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      return null
    }

    return user
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }
}

// Export a singleton instance
export const authService = new AuthService()

