'use client'

import React, { useState, useEffect } from 'react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Lead, PipelineStage } from '@/lib/types/lead'
import PipelineBoard from '@/components/leads/pipeline-board'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Loader2, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'
import { Alert } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function PipelinePage() {
  const { user } = useAuth()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Fetch leads on mount
  useEffect(() => {
    async function fetchLeads() {
      try {
        setLoading(true)
        setError(null)
        const fetchedLeads = await mockDataService.getLeads()
        setLeads(fetchedLeads)
      } catch (error) {
        console.error('Failed to fetch leads:', error)
        setError('Failed to load leads. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeads()
  }, [])

  const handleStageChange = async (leadId: string, newStage: PipelineStage) => {
    // Clear any previous messages
    setSuccessMessage(null)
    setError(null)

    // Optimistically update UI
    const previousLeads = [...leads]
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, pipelineStage: newStage, updatedAt: new Date().toISOString() }
          : lead
      )
    )
    
    // Persist the change
    try {
      await mockDataService.updateLead(leadId, {
        pipelineStage: newStage,
      })
      
      const lead = leads.find(l => l.id === leadId)
      setSuccessMessage(`${lead?.companyName || 'Lead'} moved to ${newStage.replace('_', ' ')}`)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Failed to update lead stage:', error)
      // Revert the optimistic update
      setLeads(previousLeads)
      setError('Failed to update lead stage. Please try again.')
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    }
  }

  if (loading) {
    return (
      <DashboardShell title="Sales Pipeline" userRole="relationship_manager" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  // Filter to only active leads for pipeline
  const activeLeads = leads.filter((lead) => lead.status === 'active')

  return (
    <DashboardShell title="Sales Pipeline" userRole="relationship_manager" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-sans text-4xl font-bold text-neutral-900">Sales Pipeline</h1>
            <p className="mt-2 text-neutral-600">Track and manage your leads through the sales process</p>
          </div>
          <Link href="/leads/new">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              Add New Lead
            </Button>
          </Link>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <p>{successMessage}</p>
          </Alert>
        )}

        {error && (
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <p>{error}</p>
          </Alert>
        )}

        {/* Pipeline Board */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
          <PipelineBoard leads={activeLeads} onStageChange={handleStageChange} />
        </div>

        {/* Help Text */}
        <Card className="bg-primary-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-neutral-900 mb-1">How to use the Pipeline</p>
                <ul className="text-sm text-neutral-700 space-y-1 list-disc list-inside">
                  <li>Click on any stage card to view leads in that stage</li>
                  <li>Use the arrow buttons on lead cards to move them between stages</li>
                  <li>Click on a lead name to view full details</li>
                  <li>Track your pipeline value and progress at a glance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}