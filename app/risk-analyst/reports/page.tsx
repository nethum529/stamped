'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'
import { BackButton } from '@/components/layout/back-button'

export default function RiskReportsPage() {
  const { user } = useAuth()

  return (
    <DashboardShell title="Reports" userRole="risk_analyst" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <BackButton href="/risk-analyst/dashboard" label="Back to Dashboard" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-primary-100 to-turquoise-100 rounded-full p-8">
                <FileText className="h-16 w-16 text-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Coming Soon
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-md">
              The Reports feature is currently under development. We're working hard to bring you comprehensive risk analysis reports.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-2 border-dashed border-neutral-300 bg-neutral-50/50">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 text-neutral-600">
                  <Clock className="h-5 w-5" />
                  <p className="text-sm font-medium">
                    This feature will be available in a future update
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </DashboardShell>
  )
}
