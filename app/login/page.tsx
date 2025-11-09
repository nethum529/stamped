'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Eye, EyeOff, Mail, CheckCircle2, Building2, Briefcase, ShoppingBag, ArrowLeft } from 'lucide-react'
import { authService } from '@/lib/auth/service'
import { validateSignInForm } from '@/lib/auth/validation'
import { AtmosphericBackground } from '@/components/landing/atmospheric-background'

type UserType = 'client' | 'vendor' | 'employee' | null

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState<{email: string} | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Check for verification pending message from signup
  useEffect(() => {
    try {
      const verified = searchParams?.get('verified')
      const email = searchParams?.get('email')
      
      console.log('Login page - verified:', verified, 'email:', email) // Debug log
      
      if (verified === 'pending' && email) {
        setVerificationMessage({ email: decodeURIComponent(email) })
        setFormData(prev => ({ ...prev, email: decodeURIComponent(email) }))
        // Automatically show login form when coming from signup
        // Default to employee if no user type selected
        setSelectedUserType(prev => prev || 'employee')
      }
    } catch (error) {
      console.error('Error reading search params:', error)
    }
  }, [searchParams])

  const validateForm = () => {
    const validation = validateSignInForm(formData.email, formData.password)
    setErrors(validation.errors)
    return validation.valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setVerificationMessage(null) // Clear verification message on submit
    
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

      // Successful sign in - check if user has metadata for proper routing
      const session = await authService.getSession()
      const userType = session?.user?.user_metadata?.user_type
      const userRole = session?.user?.user_metadata?.role

      // If user has metadata, use it; otherwise use selected type
      if (userType === 'client') {
        router.push('/client-portal/dashboard')
      } else if (userType === 'vendor') {
        router.push('/vendor-portal/dashboard')
      } else if (userType === 'employee') {
        // Route based on employee role
        if (userRole === 'compliance_officer') {
          router.push('/compliance')
        } else if (userRole === 'risk_analyst') {
          router.push('/risk-analyst/dashboard')
        } else if (userRole === 'executive') {
          router.push('/executive/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else if (selectedUserType === 'client') {
        // Fallback to selected type if no metadata
        router.push('/client-portal/dashboard')
      } else if (selectedUserType === 'vendor') {
        router.push('/vendor-portal/dashboard')
      } else {
        // Default fallback to employee dashboard
        router.push('/dashboard')
      }
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
        setVerificationMessage({ email: formData.email })
        setError('')
      } else {
        setError(result.error?.message || 'Failed to resend verification email')
      }
    } catch (err) {
      setError('Failed to resend verification email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // User type selection cards
  const userTypeCards = [
    {
      type: 'client' as UserType,
      title: 'Client',
      description: 'Access your onboarding portal and compliance documents',
      icon: Building2,
      gradient: 'from-primary-100/20 via-turquoise-100/10 to-primary-50/20',
    },
    {
      type: 'vendor' as UserType,
      title: 'Vendor',
      description: 'Manage your vendor onboarding and documentation',
      icon: ShoppingBag,
      gradient: 'from-turquoise-100/20 via-cyan-100/10 to-turquoise-50/20',
    },
    {
      type: 'employee' as UserType,
      title: 'Employee',
      description: 'Access employee dashboard and internal tools',
      icon: Briefcase,
      gradient: 'from-navy-100/20 via-primary-100/10 to-navy-50/20',
    },
  ]

  // Show user type selection screen
  if (!selectedUserType) {
    return (
      <AtmosphericBackground variant="light">
        <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
          <div className="w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-sans font-bold text-neutral-900 mb-4">
                Welcome to Stamped
              </h1>
              <p className="text-lg text-neutral-600">
                Please select your user type to continue
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userTypeCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.button
                    key={card.type}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    onClick={() => setSelectedUserType(card.type)}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 text-left transition-all duration-500 hover:-translate-y-2 hover:border-primary-200 hover:shadow-2xl"
                  >
                    {/* Gradient glow effect on hover */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`} />
                    </div>

                    <div className="relative">
                      {/* Icon */}
                      <div className="inline-flex rounded-xl bg-gradient-to-br from-primary-500/10 via-turquoise-500/10 to-primary-400/10 p-4 text-primary-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg mb-6">
                        <Icon className="h-8 w-8" />
                      </div>

                      {/* Title */}
                      <h3 className="font-sans text-2xl font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-primary-700 mb-3">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-neutral-600 leading-relaxed transition-colors duration-300 group-hover:text-neutral-700">
                        {card.description}
                      </p>

                      {/* Arrow indicator on hover */}
                      <div className="mt-6 flex items-center text-primary-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="text-sm font-medium">Continue</span>
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="ml-2"
                        >
                          →
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>
      </AtmosphericBackground>
    )
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
              <h2 className="mb-2 text-2xl font-semibold text-neutral-900 font-sans">
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
            <h2 className="mb-2 text-2xl font-semibold text-neutral-900 font-sans">
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

  // Get user type label
  const userTypeLabel = selectedUserType
    ? selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)
    : ''

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl transition-shadow duration-200 hover:shadow-3xl"
        >
          {/* Back button */}
          <button
            onClick={() => setSelectedUserType(null)}
            className="mb-6 flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to selection
          </button>

          <div className="mb-8">
            {/* User type badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
              {selectedUserType === 'client' && <Building2 className="h-4 w-4" />}
              {selectedUserType === 'vendor' && <ShoppingBag className="h-4 w-4" />}
              {selectedUserType === 'employee' && <Briefcase className="h-4 w-4" />}
              <span>{userTypeLabel} Login</span>
            </div>

            <h2 className="text-3xl font-semibold text-neutral-900 mb-2 font-sans">
              Welcome Back
            </h2>
            <p className="text-neutral-600">
              Sign in to your {userTypeLabel.toLowerCase()} account to continue
            </p>
          </div>

          {/* Email Verification Success Message */}
          {verificationMessage && (
            <Alert 
              variant="success" 
              className="mb-6"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900 mb-1">Account Created Successfully!</p>
                  <p className="text-sm text-green-800">
                    We've sent a verification link to <strong>{verificationMessage.email}</strong>
                  </p>
                  <p className="text-sm text-green-800 mt-2">
                    Please check your email and click the verification link before signing in.
                  </p>
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="text-sm font-medium text-green-700 hover:text-green-900 underline mt-2 transition-colors"
                  >
                    Resend verification email
                  </button>
                </div>
              </div>
            </Alert>
          )}

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
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <span className="text-sm text-neutral-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
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
                    className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
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
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50">
        <div className="text-neutral-600">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
