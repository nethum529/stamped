import { createClient } from '@/lib/supabase/client'

export interface VerificationRequest {
  type: 'password_change' | 'email_change' | 'delete_account'
  userId: string
  requestedAt: Date
  verificationCode?: string
}

/**
 * Request email verification for sensitive operations
 * Sends a verification code to the user's email
 */
export async function requestEmailVerification(
  email: string,
  operationType: 'password_change' | 'email_change' | 'delete_account'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store the verification code in local storage temporarily (5 minutes)
    const verificationData = {
      code: verificationCode,
      email,
      type: operationType,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    }
    
    localStorage.setItem('pending_verification', JSON.stringify(verificationData))
    
    // TODO: In production, send this via email using Supabase Edge Functions or your backend
    // For now, we'll show it in console for development
    console.log('Verification Code:', verificationCode)
    console.log('Email:', email)
    console.log('Type:', operationType)
    
    // You can implement email sending using Supabase Edge Functions:
    // const { error } = await supabase.functions.invoke('send-verification-email', {
    //   body: { email, code: verificationCode, type: operationType }
    // })
    
    return { success: true }
  } catch (error: any) {
    console.error('Verification request error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send verification code',
    }
  }
}

/**
 * Verify the code entered by the user
 */
export function verifyCode(
  enteredCode: string,
  operationType: 'password_change' | 'email_change' | 'delete_account'
): { verified: boolean; error?: string } {
  try {
    const stored = localStorage.getItem('pending_verification')
    if (!stored) {
      return {
        verified: false,
        error: 'No verification request found. Please request a new code.',
      }
    }
    
    const verificationData = JSON.parse(stored)
    
    // Check if expired
    if (Date.now() > verificationData.expiresAt) {
      localStorage.removeItem('pending_verification')
      return {
        verified: false,
        error: 'Verification code expired. Please request a new one.',
      }
    }
    
    // Check if type matches
    if (verificationData.type !== operationType) {
      return {
        verified: false,
        error: 'Invalid verification code.',
      }
    }
    
    // Check if code matches
    if (verificationData.code !== enteredCode) {
      return {
        verified: false,
        error: 'Incorrect verification code. Please try again.',
      }
    }
    
    // Success - clear the verification data
    localStorage.removeItem('pending_verification')
    
    return { verified: true }
  } catch (error: any) {
    console.error('Verification error:', error)
    return {
      verified: false,
      error: 'Failed to verify code. Please try again.',
    }
  }
}

/**
 * Clear any pending verification
 */
export function clearPendingVerification() {
  localStorage.removeItem('pending_verification')
}

/**
 * Get the email from pending verification
 */
export function getPendingVerificationEmail(): string | null {
  try {
    const stored = localStorage.getItem('pending_verification')
    if (!stored) return null
    
    const data = JSON.parse(stored)
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem('pending_verification')
      return null
    }
    
    return data.email
  } catch {
    return null
  }
}

