'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import LeadForm from '@/components/leads/lead-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewLeadPage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push('/leads')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/leads"
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Leads</span>
        </Link>
      </div>

      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Add New Lead</h1>
        <p className="mt-2 text-neutral-600">
          Enter the details of a new prospect to add them to your pipeline
        </p>
      </div>

      {/* Form */}
      <LeadForm onCancel={handleCancel} />
    </div>
  )
}

