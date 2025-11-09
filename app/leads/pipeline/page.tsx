'use client'

import React, { useState } from 'react'
import { mockLeads } from '@/lib/mock-data/leads'
import { Lead, PipelineStage } from '@/lib/types/lead'
import PipelineBoard from '@/components/leads/pipeline-board'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, DollarSign, Target, Plus } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function PipelinePage() {
  // In a real app, this would come from a global state or API
  const [leads, setLeads] = useState<Lead[]>(mockLeads)

  const handleStageChange = (leadId: string, newStage: PipelineStage) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === leadId
          ? { ...lead, pipelineStage: newStage, updatedAt: new Date().toISOString() }
          : lead
      )
    )
    // In a real app, you'd also call an API to persist this change
    console.log(`Lead ${leadId} moved to ${newStage}`)
  }

  // Calculate stats
  const activeLeads = leads.filter((lead) => lead.status === 'active')
  const totalPipelineValue = activeLeads.reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0)
  const avgDealSize = activeLeads.length > 0 ? totalPipelineValue / activeLeads.length : 0
  const conversionRate = leads.length > 0
    ? (leads.filter((lead) => lead.status === 'converted').length / leads.length) * 100
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-4xl font-bold text-neutral-900">Sales Pipeline</h1>
          <p className="mt-2 text-neutral-600">Manage your leads through the sales funnel</p>
        </div>
        <Link href="/leads/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add New Lead
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-l-4 border-l-primary-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Pipeline Value</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{formatCurrency(totalPipelineValue)}</p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Avg Deal Size</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{formatCurrency(avgDealSize)}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-turquoise-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Conversion Rate</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{conversionRate.toFixed(1)}%</p>
                </div>
                <div className="rounded-full bg-turquoise-100 p-3">
                  <TrendingUp className="h-6 w-6 text-turquoise-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Board */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="font-sans text-xl font-semibold text-neutral-900">Pipeline Board</h2>
          <p className="text-sm text-neutral-600 mt-1">Drag and drop leads to move them through stages</p>
        </div>
        <PipelineBoard leads={activeLeads} onStageChange={handleStageChange} />
      </div>

      {/* Help Text */}
      <Card className="bg-primary-50 border-primary-200">
        <CardContent className="p-4">
          <p className="text-sm text-neutral-700">
            <span className="font-semibold">💡 Tip:</span> Drag leads between columns to update their pipeline stage.
            Click on any lead card to view details and add notes.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

