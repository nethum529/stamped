'use client'

import React from 'react'
import Link from 'next/link'
import { Lead } from '@/lib/types/lead'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AIScoreBadge from './ai-score-badge'
import { Building2, User, Mail, Phone, Globe, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { getStageDisplayName, getStageProgress } from '@/lib/types/lead'

interface LeadCardProps {
  lead: Lead
  index?: number
}

export default function LeadCard({ lead, index = 0 }: LeadCardProps) {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'converted':
        return 'bg-blue-100 text-blue-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getStageColor = (stage: Lead['pipelineStage']) => {
    switch (stage) {
      case 'prospecting':
        return 'bg-yellow-100 text-yellow-800'
      case 'contact_made':
        return 'bg-orange-100 text-orange-800'
      case 'meeting_scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'proposal_sent':
        return 'bg-blue-100 text-blue-800'
      case 'negotiating':
        return 'bg-primary-100 text-primary-800'
      case 'onboarding':
        return 'bg-green-100 text-green-800'
      case 'converted':
        return 'bg-emerald-100 text-emerald-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const progress = getStageProgress(lead.pipelineStage)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/leads/${lead.id}`}>
        <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-l-primary-500">
          <CardContent className="p-5">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="h-5 w-5 text-primary-600" />
                    <h3 className="font-sans text-lg font-semibold text-neutral-900 hover:text-primary-600 transition-colors">
                      {lead.companyName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <span className="font-medium">{lead.industry}</span>
                    <span>•</span>
                    <span>{lead.country}</span>
                    {lead.companySize && (
                      <>
                        <span>•</span>
                        <span>{lead.companySize}</span>
                      </>
                    )}
                  </div>
                </div>
                <AIScoreBadge score={lead.aiScore} breakdown={lead.aiScoreBreakdown} size="md" />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-neutral-700">
                  <User className="h-4 w-4 text-neutral-500" />
                  <span className="truncate">{lead.contactName}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-700">
                  <Mail className="h-4 w-4 text-neutral-500" />
                  <span className="truncate">{lead.contactEmail}</span>
                </div>
                {lead.contactPhone && (
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Phone className="h-4 w-4 text-neutral-500" />
                    <span>{lead.contactPhone}</span>
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center gap-2 text-neutral-700">
                    <Globe className="h-4 w-4 text-neutral-500" />
                    <span className="truncate">{lead.website.replace('https://', '')}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>Pipeline Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary-500 to-turquoise-500 rounded-full"
                  />
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn('text-xs font-medium', getStatusColor(lead.status))}>
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
                <Badge variant="outline" className={cn('text-xs font-medium', getStageColor(lead.pipelineStage))}>
                  {getStageDisplayName(lead.pipelineStage)}
                </Badge>
              </div>

              {/* Revenue & Date */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                <div className="flex items-center gap-2 text-sm text-neutral-700">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">{formatCurrency(lead.estimatedRevenue)}</span>
                </div>
                {lead.expectedCloseDate && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="h-4 w-4 text-neutral-500" />
                    <span>{formatDate(lead.expectedCloseDate)}</span>
                  </div>
                )}
              </div>

              {/* Assigned To */}
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Assigned to: <span className="font-medium text-neutral-700">{lead.assignedToName}</span></span>
                <span>Updated {formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

