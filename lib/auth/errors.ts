import { AuthError, AuthErrorCode } from './types'

export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // Supabase auth errors
  'User already registered': 'An account with this email already exists',
  'Email not confirmed': 'Please verify your email before signing in',
  'Invalid login credentials': 'Invalid email or password',
  'Email rate limit exceeded': 'Too many attempts. Please try again later',
  'Signup disabled': 'New account registration is currently disabled',
  'User not found': 'No account found with this email',
  'Invalid email': 'Please enter a valid email address',
  'Password should be at least 6 characters': 'Password must be at least 8 characters',
  'Anonymous sign-ins are disabled': 'Please create an account to continue',
  
  // Network errors
  'Failed to fetch': 'Network error. Please check your connection',
  'NetworkError': 'Network error. Please check your connection',
  
  // Rate limiting
  'over_email_send_rate_limit': 'Too many emails sent. Please wait before trying again',
  'over_request_rate_limit': 'Too many requests. Please wait a moment',
  
  // Generic
  'Unknown error': 'Something went wrong. Please try again',
}

export function getAuthErrorCode(error: any): AuthErrorCode {
  const message = error?.message || ''
  
  if (message.includes('already registered') || message.includes('duplicate')) {
    return 'EMAIL_EXISTS'
  }
  if (message.includes('not confirmed') || message.includes('email not confirmed')) {
    return 'EMAIL_NOT_CONFIRMED'
  }
  if (message.includes('Invalid login') || message.includes('Invalid email or password')) {
    return 'INVALID_CREDENTIALS'
  }
  if (message.includes('rate limit') || message.includes('Too many')) {
    return 'TOO_MANY_REQUESTS'
  }
  if (message.includes('Password') && message.includes('characters')) {
    return 'WEAK_PASSWORD'
  }
  if (message.includes('Invalid email') || message.includes('valid email')) {
    return 'INVALID_EMAIL'
  }
  if (message.includes('Network') || message.includes('fetch')) {
    return 'NETWORK_ERROR'
  }
  if (message.includes('disabled')) {
    return 'USER_DISABLED'
  }
  
  return 'UNKNOWN_ERROR'
}

export function formatAuthError(error: any): AuthError {
  const message = error?.message || error?.error_description || 'An error occurred'
  const code = getAuthErrorCode(error)
  
  // Check if we have a friendly message for this error
  const friendlyMessage = AUTH_ERROR_MESSAGES[message] || message
  
  return {
    message: friendlyMessage,
    code,
  }
}

export class AuthServiceError extends Error {
  code: AuthErrorCode
  originalError?: any

  constructor(message: string, code: AuthErrorCode, originalError?: any) {
    super(message)
    this.name = 'AuthServiceError'
    this.code = code
    this.originalError = originalError
  }
}

