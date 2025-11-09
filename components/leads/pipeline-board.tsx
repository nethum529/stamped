'use client'

import React, { useState } from 'react'
import { Lead, PipelineStage, getStageDisplayName } from '@/lib/types/lead'
import AIScoreBadge from './ai-score-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, User, DollarSign, Calendar, ChevronRight, MoreVertical, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface PipelineBoardProps {
  leads: Lead[]
  onStageChange?: (leadId: string, newStage: PipelineStage) => void
}

// Simplified to 5 key stages
const stages: PipelineStage[] = [
  'prospecting',
  'contact_made',
  'meeting_scheduled',
  'proposal_sent',
  'onboarding',
]

// Clean, minimal stage configuration
const stageConfig: Record<PipelineStage, { label: string; color: string; bgColor: string; description: string }> = {
  prospecting: { 
    label: 'Prospecting', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    description: 'New leads identified' 
  },
  contact_made: { 
    label: 'Contact Made', 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    description: 'Initial contact established' 
  },
  meeting_scheduled: { 
    label: 'Meeting Scheduled', 
    color: 'text-indigo-600', 
    bgColor: 'bg-indigo-50',
    description: 'Meetings booked' 
  },
  proposal_sent: { 
    label: 'Proposal Sent', 
    color: 'text-primary-600', 
    bgColor: 'bg-primary-50',
    description: 'Proposals under review' 
  },
  onboarding: { 
    label: 'Onboarding', 
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    description: 'Ready to onboard' 
  },
  negotiating: {
    label: 'Negotiating',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    description: 'In negotiation'
  },
}

export default function PipelineBoard({ leads, onStageChange }: PipelineBoardProps) {
  const [selectedStage, setSelectedStage] = useState<PipelineStage | null>(null)

  // Group leads by stage
  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage] = leads.filter((lead) => lead.pipelineStage === stage && lead.status === 'active')
    return acc
  }, {} as Record<PipelineStage, Lead[]>)

  // Calculate totals
  const stageTotals = stages.reduce((acc, stage) => {
    const stageLeads = leadsByStage[stage] || []
    acc[stage] = {
      count: stageLeads.length,
      value: stageLeads.reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0),
    }
    return acc
  }, {} as Record<PipelineStage, { count: number; value: number }>)

  const handleStageChange = (leadId: string, newStage: PipelineStage) => {
    if (onStageChange) {
      onStageChange(leadId, newStage)
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount === 0) return '$0'
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
    return `$${amount.toLocaleString()}`
  }

  // Get available next/previous stages for a lead
  const getAvailableStages = (currentStage: PipelineStage) => {
    const currentIndex = stages.indexOf(currentStage)
    const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null
    const prevStage = currentIndex > 0 ? stages[currentIndex - 1] : null
    return { nextStage, prevStage }
  }

  // If a stage is selected, show only that stage's leads in detail view
  if (selectedStage) {
    const stageLeads = leadsByStage[selectedStage] || []
    const config = stageConfig[selectedStage]
    const totals = stageTotals[selectedStage]

    return (
      <div className="space-y-6">
        {/* Stage Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedStage(null)}
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Pipeline</span>
            </button>
            <div className={cn('px-4 py-2 rounded-lg', config.bgColor)}>
              <h2 className={cn('text-lg font-semibold', config.color)}>{config.label}</h2>
              <p className="text-sm text-neutral-600">{config.description}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Total Value</p>
            <p className="text-2xl font-bold text-neutral-900">{formatCurrency(totals.value)}</p>
            <p className="text-sm text-neutral-500">{totals.count} lead{totals.count !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Leads Grid */}
        {stageLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stageLeads.map((lead, index) => {
              const { nextStage, prevStage } = getAvailableStages(lead.pipelineStage)
              
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200 border-neutral-200">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                            <Link href={`/leads/${lead.id}`}>
                              <h4 className="font-sans font-semibold text-base text-neutral-900 hover:text-primary-600 transition-colors truncate">
                                {lead.companyName}
                              </h4>
                            </Link>
                          </div>
                          <p className="text-sm text-neutral-500 truncate">{lead.industry}</p>
                        </div>
                        <AIScoreBadge score={lead.aiScore} breakdown={lead.aiScoreBreakdown} size="sm" />
                      </div>

                      {/* Contact Info */}
                      <div className="flex items-center gap-2 mb-4 text-sm text-neutral-600">
                        <User className="h-3.5 w-3.5 text-neutral-400" />
                        <span className="truncate">{lead.contactName}</span>
                      </div>

                      {/* Revenue and Date */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-neutral-100">
                        {lead.estimatedRevenue && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Revenue</span>
                            <span className="font-semibold text-neutral-900">
                              {formatCurrency(lead.estimatedRevenue)}
                            </span>
                          </div>
                        )}
                        {lead.expectedCloseDate && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Close Date</span>
                            <span className="text-neutral-700">
                              {new Date(lead.expectedCloseDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Stage Navigation */}
                      <div className="flex items-center gap-2">
                        {prevStage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStageChange(lead.id, prevStage)}
                            className="flex-1 text-xs"
                          >
                            <ArrowLeft className="h-3 w-3 mr-1" />
                            {stageConfig[prevStage].label}
                          </Button>
                        )}
                        {nextStage && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStageChange(lead.id, nextStage)}
                            className="flex-1 text-xs"
                          >
                            {stageConfig[nextStage].label}
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        )}
                        {!prevStage && !nextStage && (
                          <Link href={`/leads/${lead.id}`} className="flex-1">
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              View Details
                            </Button>
                          </Link>
                        )}
                      </div>

                      {/* Assigned To */}
                      <div className="mt-3 pt-3 border-t border-neutral-100">
                        <Badge variant="outline" className="text-xs font-normal text-neutral-600 border-neutral-200">
                          {lead.assignedToName}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent>
              <div className="text-center text-neutral-500">
                <Building2 className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                <p className="text-lg font-medium">No leads in this stage</p>
                <p className="text-sm mt-1">Leads will appear here as they progress</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Default view: Show all stages as cards
  return (
    <div className="space-y-6">
      {/* Stages Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const config = stageConfig[stage]
          const totals = stageTotals[stage]
          const stageLeads = leadsByStage[stage] || []

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  'cursor-pointer hover:shadow-lg transition-all duration-200 border-2',
                  selectedStage === stage ? 'border-primary-500 shadow-md' : 'border-neutral-200 hover:border-primary-300'
                )}
                onClick={() => setSelectedStage(stage)}
              >
                <CardContent className="p-5">
                  <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-3', config.bgColor)}>
                    <span className={cn('text-2xl font-bold', config.color)}>{totals.count}</span>
                  </div>
                  <h3 className={cn('font-sans font-semibold text-sm mb-1', config.color)}>
                    {config.label}
                  </h3>
                  <p className="text-xs text-neutral-500 mb-3">{config.description}</p>
                  <div className="pt-3 border-t border-neutral-100">
                    <p className="text-lg font-bold text-neutral-900">{formatCurrency(totals.value)}</p>
                    <p className="text-xs text-neutral-500">Total Value</p>
                  </div>
                  {stageLeads.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedStage(stage)
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                      >
                        View {stageLeads.length} lead{stageLeads.length !== 1 ? 's' : ''}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-50 to-turquoise-50 border-primary-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Active Leads</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {leads.filter(l => l.status === 'active').length}
                </p>
              </div>
              <Building2 className="h-8 w-8 text-primary-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(
                    leads.filter(l => l.status === 'active').reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0)
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Avg Deal Size</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">
                  {formatCurrency(
                    leads.filter(l => l.status === 'active').length > 0
                      ? leads.filter(l => l.status === 'active').reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0) / leads.filter(l => l.status === 'active').length
                      : 0
                  )}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}