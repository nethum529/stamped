'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Select } from '@/components/ui/select'
import { Eye, EyeOff, Briefcase, Users } from 'lucide-react'
import { authService } from '@/lib/auth/service'
import { validateSignUpForm } from '@/lib/auth/validation'

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'employee' as 'client' | 'employee',
    role: 'compliance_officer' as 'relationship_manager' | 'compliance_officer' | 'risk_analyst' | 'executive',
    companyName: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const validation = validateSignUpForm(
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.name
    )
    
    setErrors(validation.errors)
    return validation.valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        user_type: formData.userType,
        role: formData.userType === 'employee' ? formData.role : undefined,
        companyName: formData.userType === 'client' ? formData.companyName : undefined,
      })

      if (!result.success) {
        // Handle field-specific errors
        if (result.error?.field) {
          setErrors({ [result.error.field]: result.error.message })
        } else {
          setError(result.error?.message || 'Failed to create account')
        }
        return
      }

      // Redirect to login with verification message
      if (result.requiresVerification) {
        // Use router.push for proper Next.js navigation
        router.push(`/login?verified=pending&email=${encodeURIComponent(formData.email)}`)
      } else {
        // User is automatically signed in, redirect to dashboard
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Signup error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl transition-shadow duration-200 hover:shadow-3xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-neutral-900 mb-2 font-sans">
              Create Account
            </h2>
            <p className="text-neutral-600">
              Get started with your free account
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-neutral-700">
                Account Type <span className="text-error-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'employee' })}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    formData.userType === 'employee'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}
                >
                  <Briefcase className={`h-5 w-5 ${formData.userType === 'employee' ? 'text-primary-600' : 'text-neutral-600'}`} />
                  <div className="text-left">
                    <p className={`text-sm font-medium ${formData.userType === 'employee' ? 'text-primary-900' : 'text-neutral-900'}`}>
                      Employee
                    </p>
                    <p className="text-xs text-neutral-600">Internal team member</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: 'client' })}
                  className={`flex items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    formData.userType === 'client'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-300 bg-white hover:border-neutral-400'
                  }`}
                >
                  <Users className={`h-5 w-5 ${formData.userType === 'client' ? 'text-primary-600' : 'text-neutral-600'}`} />
                  <div className="text-left">
                    <p className={`text-sm font-medium ${formData.userType === 'client' ? 'text-primary-900' : 'text-neutral-900'}`}>
                      Client
                    </p>
                    <p className="text-xs text-neutral-600">External partner</p>
                  </div>
                </button>
              </div>
            </div>

            <Input
              label="Full Name"
              type="text"
              placeholder="John Smith"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              error={errors.name}
              required
              autoComplete="name"
            />

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

            {/* Employee Role Selection */}
            {formData.userType === 'employee' && (
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                options={[
                  { value: 'relationship_manager', label: 'Relationship Manager' },
                  { value: 'compliance_officer', label: 'Compliance Officer' },
                  { value: 'risk_analyst', label: 'Risk Analyst' },
                  { value: 'executive', label: 'Executive' },
                ]}
                required
              />
            )}

            {/* Client Company Name */}
            {formData.userType === 'client' && (
              <Input
                label="Company Name"
                type="text"
                placeholder="Acme Corporation"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required={formData.userType === 'client'}
              />
            )}

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={errors.password}
                required
                autoComplete="new-password"
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

            <div className="relative">
              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                error={errors.confirmPassword}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <span className="text-xs text-neutral-600">
                I agree to the{' '}
                <button
                  type="button"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Privacy Policy
                </button>
              </span>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
