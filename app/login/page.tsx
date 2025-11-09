'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Eye, EyeOff, Mail } from 'lucide-react'
import { authService } from '@/lib/auth/service'
import { validateSignInForm } from '@/lib/auth/validation'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const validation = validateSignInForm(formData.email, formData.password)
    setErrors(validation.errors)
    return validation.valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      const result = await authService.signIn({
        email: formData.email,
        password: formData.password,
      })

      if (!result.success) {
        // Handle field-specific errors
        if (result.error?.field) {
          setErrors({ [result.error.field]: result.error.message })
        } else {
          setError(result.error?.message || 'Failed to sign in')
        }

        // If email not confirmed, show option to resend
        if (result.requiresVerification) {
          setError(
            result.error?.message ||
            'Please verify your email before signing in. Check your inbox for the verification link.'
          )
        }
        return
      }

      // Successful sign in - redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authService.resetPassword(resetEmail)

      if (!result.success) {
        setError(result.error?.message || 'Failed to send reset email')
        return
      }

      setResetEmailSent(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setLoading(true)
    setError('')

    try {
      const result = await authService.resendVerificationEmail(formData.email)
      
      if (result.success) {
        alert('Verification email sent! Please check your inbox.')
      } else {
        setError(result.error?.message || 'Failed to resend verification email')
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Show forgot password modal - success state
  if (showForgotPassword && resetEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-neutral-900">
                Check Your Email
              </h2>
              <p className="mb-6 text-neutral-600">
                We've sent a password reset link to <strong>{resetEmail}</strong>
              </p>
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                <p>Click the link in the email to reset your password.</p>
              </div>
              <Button
                onClick={() => {
                  setShowForgotPassword(false)
                  setResetEmailSent(false)
                }}
                className="mt-6 w-full"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show forgot password form
  if (showForgotPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
            <h2 className="mb-2 text-2xl font-semibold text-neutral-900">
              Reset Password
            </h2>
            <p className="mb-6 text-sm text-neutral-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-5">
              <Input
                label="Email"
                type="email"
                placeholder="name@company.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  loading={loading}
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl transition-all duration-300 hover:shadow-3xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="relative h-20 w-60 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Stamped"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <div className="flex-1">
              <h2 className="font-sans text-3xl font-semibold text-neutral-900">
                Welcome back
              </h2>
              <p className="mt-1 font-sans italic text-base text-neutral-600">
                compliance made simple.
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Sign in to your account to continue
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              error={errors.email}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </button>
            </div>

            {error?.includes('verify') && formData.email && (
              <div className="rounded-lg bg-yellow-50 p-3 text-sm">
                <p className="text-yellow-900">
                  Haven't received the verification email?{' '}
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="font-medium text-primary-600 hover:text-primary-700"
                    disabled={loading}
                  >
                    Resend it
                  </button>
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center text-sm text-neutral-600">
            Need help?{' '}
            <button className="font-medium text-primary-600 hover:text-primary-700">
              Contact support
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            © 2025 Stamped. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
