'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import LeadForm from '@/components/leads/lead-form'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { BackButton } from '@/components/layout/back-button'
import { useAuth } from '@/lib/hooks/useAuth'

export default function NewLeadPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleCancel = () => {
    router.push('/leads')
  }

  return (
    <DashboardShell title="Add New Lead" userRole="relationship_manager" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-4xl mx-auto">
        <BackButton href="/leads" label="Back to Leads" />
        
        <div>
          <h1 className="font-sans text-4xl font-bold text-neutral-900">Add New Lead</h1>
          <p className="mt-2 text-neutral-600">
            Enter the details of a new prospect to add them to your pipeline
          </p>
        </div>

        {/* Form */}
        <LeadForm onCancel={handleCancel} />
      </div>
    </DashboardShell>
  )
}

