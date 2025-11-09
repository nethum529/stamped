'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Eye, EyeOff, Briefcase } from 'lucide-react'

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Mock authentication - in real app, would call auth service and get role
    setTimeout(() => {
      setLoading(false)
      // For demo, route to dashboard
      // In real app, would route based on role:
      // - relationship_manager -> /dashboard
      // - compliance_officer -> /dashboard
      // - risk_analyst -> /risk-analyst/dashboard
      // - executive -> /executive/dashboard
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-100/30 to-neutral-50 p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="relative mx-auto h-16 w-48 mb-4">
              <Image
                src="/logo.png"
                alt="Stamped"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-primary-600" />
              <h2 className="font-sans text-2xl font-semibold text-neutral-900">
                Employee Portal
              </h2>
            </div>
            <p className="text-sm text-neutral-600">
              Sign in with your company credentials
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Work Email"
              type="email"
              placeholder="name@goldmansachs.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center text-sm text-neutral-600">
              Client?{' '}
              <Link
                href="/client-login"
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                Access client portal
              </Link>
            </div>
            <div className="text-center text-sm text-neutral-600">
              Need access?{' '}
              <button className="font-medium text-primary-600 hover:text-primary-700">
                Contact IT support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-neutral-500">
            © 2025 Stamped. Confidential and proprietary.
          </p>
        </div>
      </div>
    </div>
  )
}

