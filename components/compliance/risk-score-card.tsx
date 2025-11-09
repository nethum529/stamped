'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, Shield, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

export interface RiskScoreBreakdown {
  geographic: number // 0-100
  industry: number // 0-100
  ownership: number // 0-100
  compliance: number // 0-100
  adverseMedia: number // 0-100
  sanctions: number // 0-100
}

export interface RiskScoreData {
  entityId: string
  entityName: string
  entityType: 'client' | 'vendor'
  overallScore: number // 0-100, higher is riskier
  riskLevel: RiskLevel
  breakdown: RiskScoreBreakdown
  lastAssessed: string
  nextReview: string
  flags: string[]
  recommendations: string[]
}

interface RiskScoreCardProps {
  data: RiskScoreData
  onViewDetails?: () => void
}

export default function RiskScoreCard({ data, onViewDetails }: RiskScoreCardProps) {
  const getRiskLevelColor = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300'
    }
  }

  const getRiskLevelIcon = (level: RiskLevel) => {
    switch (level) {
      case 'Low':
        return <CheckCircle className="h-4 w-4" />
      case 'Medium':
        return <AlertCircle className="h-4 w-4" />
      case 'High':
        return <AlertTriangle className="h-4 w-4" />
      case 'Critical':
        return <Shield className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 25) return 'text-green-600'
    if (score <= 50) return 'text-yellow-600'
    if (score <= 75) return 'text-orange-600'
    return 'text-red-600'
  }

  const getProgressColor = (score: number) => {
    if (score <= 25) return 'bg-green-500'
    if (score <= 50) return 'bg-yellow-500'
    if (score <= 75) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const breakdownItems = [
    { label: 'Geographic Risk', value: data.breakdown.geographic },
    { label: 'Industry Risk', value: data.breakdown.industry },
    { label: 'Ownership Structure', value: data.breakdown.ownership },
    { label: 'Compliance History', value: data.breakdown.compliance },
    { label: 'Adverse Media', value: data.breakdown.adverseMedia },
    { label: 'Sanctions Screening', value: data.breakdown.sanctions },
  ]

  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'rounded-lg p-2',
                  data.riskLevel === 'Low' && 'bg-green-100',
                  data.riskLevel === 'Medium' && 'bg-yellow-100',
                  data.riskLevel === 'High' && 'bg-orange-100',
                  data.riskLevel === 'Critical' && 'bg-red-100'
                )}
              >
                <Shield
                  className={cn(
                    'h-5 w-5',
                    data.riskLevel === 'Low' && 'text-green-600',
                    data.riskLevel === 'Medium' && 'text-yellow-600',
                    data.riskLevel === 'High' && 'text-orange-600',
                    data.riskLevel === 'Critical' && 'text-red-600'
                  )}
                />
              </div>
              <div>
                <CardTitle className="text-base font-sans">{data.entityName}</CardTitle>
                <p className="text-xs text-neutral-600 mt-1">
                  {data.entityType === 'client' ? 'Client' : 'Vendor'} • ID: {data.entityId}
                </p>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn('text-xs font-medium border', getRiskLevelColor(data.riskLevel))}>
            <span className="mr-1">{getRiskLevelIcon(data.riskLevel)}</span>
            {data.riskLevel} Risk
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall Risk Score */}
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-neutral-700">Overall Risk Score</span>
            <span className={cn('text-2xl font-bold', getScoreColor(data.overallScore))}>
              {data.overallScore}
            </span>
          </div>
          <Progress
            value={data.overallScore}
            className="h-2"
            indicatorClassName={getProgressColor(data.overallScore)}
          />
          <p className="text-xs text-neutral-500 mt-2">
            Score ranges: 0-25 (Low), 26-50 (Medium), 51-75 (High), 76-100 (Critical)
          </p>
        </div>

        {/* Risk Breakdown */}
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 mb-3">Risk Breakdown</h4>
          <div className="space-y-3">
            {breakdownItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-700">{item.label}</span>
                  <span className={cn('font-semibold', getScoreColor(item.value))}>
                    {item.value}
                  </span>
                </div>
                <Progress
                  value={item.value}
                  className="h-1.5"
                  indicatorClassName={getProgressColor(item.value)}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flags */}
        {data.flags.length > 0 && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-orange-900 mb-1">Risk Flags</p>
                <ul className="text-xs text-orange-800 space-y-1">
                  {data.flags.map((flag, index) => (
                    <li key={index}>• {flag}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="rounded-lg border border-primary-200 bg-primary-50 p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary-900 mb-1">Recommendations</p>
                <ul className="text-xs text-primary-800 space-y-1">
                  {data.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Review Dates */}
        <div className="grid grid-cols-2 gap-3 text-sm pt-3 border-t border-neutral-200">
          <div>
            <p className="text-neutral-500">Last Assessed</p>
            <p className="font-medium text-neutral-900">
              {new Date(data.lastAssessed).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Next Review</p>
            <p className="font-medium text-neutral-900">
              {new Date(data.nextReview).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* View Details Button */}
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="w-full text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View Detailed Analysis →
          </button>
        )}
      </CardContent>
    </Card>
  )
}

