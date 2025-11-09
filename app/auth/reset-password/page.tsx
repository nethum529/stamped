'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'
import { authService } from '@/lib/auth/service'
import { validatePassword } from '@/lib/auth/validation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      newErrors.password = passwordError
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setLoading(true)

    try {
      const result = await authService.updatePassword(formData.password)

      if (!result.success) {
        setError(result.error?.message || 'Failed to update password')
        return
      }

      setSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error('Password reset error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-neutral-900">
                Password Updated!
              </h2>
              <p className="mb-6 text-neutral-600">
                Your password has been successfully updated.
              </p>
              <p className="text-sm text-neutral-500">
                Redirecting to dashboard...
              </p>
            </div>
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
                Reset Password
              </h2>
              <p className="mt-1 font-sans italic text-base text-neutral-600">
                compliance made simple.
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Enter your new password
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
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
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
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
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your new password"
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
                className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
              </ul>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Update Password
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Back to Sign In
            </Link>
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

