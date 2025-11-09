'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AtmosphericBackground } from '@/components/landing/atmospheric-background'

export default function ForbiddenPage() {
  const router = useRouter()

  const handleGoBack = () => {
    // Go back to previous page or home
    router.back()
  }

  const handleGoDashboard = () => {
    // This will be redirected by middleware to the appropriate dashboard
    router.push('/dashboard')
  }

  return (
    <AtmosphericBackground variant="light">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          <div className="rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl p-8 md:p-12 shadow-2xl text-center">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 text-orange-600"
            >
              <Shield className="h-12 w-12" />
            </motion.div>

            {/* Error Code */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-2 text-6xl font-sans font-bold text-neutral-900"
            >
              403
            </motion.h1>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-4 text-2xl font-semibold text-neutral-900 font-sans"
            >
              Access Forbidden
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8 text-neutral-600 leading-relaxed max-w-md mx-auto"
            >
              You don't have permission to access this page. This area is restricted to specific user roles.
            </motion.p>

            {/* Information Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8 rounded-xl bg-orange-50 border border-orange-100 p-4 flex items-start gap-3 text-left max-w-md mx-auto"
            >
              <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900">
                <p className="font-medium mb-1">Why am I seeing this?</p>
                <p className="text-orange-800">
                  This page requires specific user permissions. Please contact your administrator if you believe you should have access.
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={handleGoDashboard}
                className="gap-2"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AtmosphericBackground>
  )
}

