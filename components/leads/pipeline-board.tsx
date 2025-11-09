'use client'

import React, { useState } from 'react'
import { Lead, PipelineStage, getStageDisplayName } from '@/lib/types/lead'
import AIScoreBadge from './ai-score-badge'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, User, DollarSign, Calendar } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface PipelineBoardProps {
  leads: Lead[]
  onStageChange?: (leadId: string, newStage: PipelineStage) => void
}

const stages: PipelineStage[] = [
  'prospecting',
  'contact_made',
  'meeting_scheduled',
  'proposal_sent',
  'negotiating',
  'onboarding',
]

const stageColors: Record<PipelineStage, string> = {
  prospecting: 'bg-yellow-100 border-yellow-300',
  contact_made: 'bg-orange-100 border-orange-300',
  meeting_scheduled: 'bg-purple-100 border-purple-300',
  proposal_sent: 'bg-blue-100 border-blue-300',
  negotiating: 'bg-primary-100 border-primary-300',
  onboarding: 'bg-green-100 border-green-300',
  converted: 'bg-emerald-100 border-emerald-300',
  lost: 'bg-red-100 border-red-300',
}

export default function PipelineBoard({ leads, onStageChange }: PipelineBoardProps) {
  const [draggedLead, setDraggedLead] = useState<string | null>(null)
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null)

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

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLead(leadId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', leadId)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stage)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, newStage: PipelineStage) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    if (leadId && onStageChange) {
      onStageChange(leadId, newStage)
    }
    setDraggedLead(null)
    setDragOverStage(null)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = leadsByStage[stage] || []
        const totals = stageTotals[stage]

        return (
          <div
            key={stage}
            className="flex-shrink-0 w-80"
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {/* Stage Header */}
            <div className={cn(
              'rounded-t-lg p-4 border-2 transition-colors duration-200',
              stageColors[stage],
              dragOverStage === stage && 'ring-2 ring-primary-500 ring-offset-2'
            )}>
              <h3 className="font-sans font-semibold text-neutral-900 mb-1">
                {getStageDisplayName(stage)}
              </h3>
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <span>{totals.count} lead{totals.count !== 1 ? 's' : ''}</span>
                <span className="font-semibold">{formatCurrency(totals.value)}</span>
              </div>
            </div>

            {/* Stage Content */}
            <div className={cn(
              'min-h-[600px] bg-neutral-50 border-2 border-t-0 rounded-b-lg p-3 space-y-3',
              stageColors[stage].split(' ')[1] // Use border color
            )}>
              <AnimatePresence>
                {stageLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, lead.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'cursor-move',
                      draggedLead === lead.id && 'opacity-50'
                    )}
                  >
                    <Link href={`/leads/${lead.id}`} className="block">
                      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Company Name & AI Score */}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Building2 className="h-4 w-4 text-primary-600 flex-shrink-0" />
                                  <h4 className="font-sans font-semibold text-neutral-900 text-sm leading-tight">
                                    {lead.companyName}
                                  </h4>
                                </div>
                                <p className="text-xs text-neutral-600">{lead.industry}</p>
                              </div>
                              <AIScoreBadge score={lead.aiScore} breakdown={lead.aiScoreBreakdown} size="sm" />
                            </div>

                            {/* Contact */}
                            <div className="flex items-center gap-2 text-xs text-neutral-700">
                              <User className="h-3 w-3 text-neutral-500" />
                              <span className="truncate">{lead.contactName}</span>
                            </div>

                            {/* Revenue */}
                            {lead.estimatedRevenue && (
                              <div className="flex items-center gap-2 text-xs">
                                <DollarSign className="h-3 w-3 text-green-600" />
                                <span className="font-semibold text-neutral-900">
                                  {formatCurrency(lead.estimatedRevenue)}
                                </span>
                              </div>
                            )}

                            {/* Expected Close Date */}
                            {lead.expectedCloseDate && (
                              <div className="flex items-center gap-2 text-xs text-neutral-600">
                                <Calendar className="h-3 w-3 text-neutral-500" />
                                <span>
                                  {new Date(lead.expectedCloseDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}

                            {/* Assigned To */}
                            <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">
                                {lead.assignedToName}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>

              {stageLeads.length === 0 && (
                <div className="flex items-center justify-center h-32 text-neutral-400 text-sm">
                  Drop leads here
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

