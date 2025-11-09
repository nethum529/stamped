'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import { useParams, useRouter } from 'next/navigation'
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Globe,
  Building2,
  Users,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function RiskAnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const entityId = params.id as string

  // Find the risk score data
  const riskData = mockRiskScores.find((s) => s.entityId === entityId)

  if (!riskData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Shield className="h-16 w-16 text-neutral-300 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Entity Not Found</h2>
        <p className="text-neutral-600 mb-4">The requested risk analysis could not be found.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
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

  // Mock adverse media findings
  const adverseMedia = [
    {
      id: '1',
      title: 'Regulatory Investigation Notice',
      source: 'Financial Times',
      date: '2024-10-15',
      severity: 'High',
      summary: 'Regulatory body announced investigation into business practices.',
    },
    {
      id: '2',
      title: 'Compliance Violation Report',
      source: 'Reuters',
      date: '2023-08-22',
      severity: 'Medium',
      summary: 'Minor compliance violations reported in quarterly filing.',
    },
  ]

  // Mock sanctions screening results
  const sanctionsResults = {
    matchesFound: riskData.riskLevel === 'Critical' ? 1 : 0,
    lastScreened: '2025-11-08',
    status: riskData.riskLevel === 'Critical' ? 'MATCH_FOUND' : 'CLEAR',
    details: riskData.riskLevel === 'Critical' 
      ? 'Potential match found in OFAC sanctions list. Requires immediate review.'
      : 'No matches found in sanctions databases (OFAC, UN, EU).',
  }

  const breakdownItems = [
    { label: 'Geographic Risk', value: riskData.breakdown.geographic, description: 'Risk based on operating jurisdictions' },
    { label: 'Industry Risk', value: riskData.breakdown.industry, description: 'Sector-specific risk factors' },
    { label: 'Ownership Structure', value: riskData.breakdown.ownership, description: 'Corporate structure complexity' },
    { label: 'Compliance History', value: riskData.breakdown.compliance, description: 'Past compliance track record' },
    { label: 'Adverse Media', value: riskData.breakdown.adverseMedia, description: 'Negative media coverage' },
    { label: 'Sanctions Screening', value: riskData.breakdown.sanctions, description: 'Sanctions list matches' },
  ]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Risk Assessment
      </Button>

      {/* Entity Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-sans text-4xl font-bold text-neutral-900">{riskData.entityName}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-sm">
              {riskData.entityType === 'client' ? 'Client' : 'Vendor'}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                'text-sm font-medium',
                riskData.riskLevel === 'Critical' && 'bg-red-100 text-red-800 border-red-300',
                riskData.riskLevel === 'High' && 'bg-orange-100 text-orange-800 border-orange-300',
                riskData.riskLevel === 'Medium' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                riskData.riskLevel === 'Low' && 'bg-green-100 text-green-800 border-green-300'
              )}
            >
              {riskData.riskLevel} Risk
            </Badge>
            <span className="text-sm text-neutral-600">ID: {riskData.entityId}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-neutral-600">Overall Risk Score</p>
          <p className={cn('text-5xl font-bold', getScoreColor(riskData.overallScore))}>
            {riskData.overallScore}
          </p>
        </div>
      </div>

      {/* Sanctions Alert (if applicable) */}
      {sanctionsResults.status === 'MATCH_FOUND' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">CRITICAL: Sanctions Match Found</h3>
                  <p className="text-sm text-red-800 mb-3">{sanctionsResults.details}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive">Escalate to Legal</Button>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Risk Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Risk Score Breakdown</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Detailed analysis by category</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {breakdownItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">{item.label}</p>
                    <p className="text-xs text-neutral-600">{item.description}</p>
                  </div>
                  <span className={cn('text-2xl font-bold', getScoreColor(item.value))}>
                    {item.value}
                  </span>
                </div>
                <Progress
                  value={item.value}
                  className="h-2"
                  indicatorClassName={getProgressColor(item.value)}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Adverse Media Findings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-sans text-2xl">Adverse Media Findings</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">
                {adverseMedia.length} finding{adverseMedia.length !== 1 ? 's' : ''} identified
              </p>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
              {adverseMedia.length} Alert{adverseMedia.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adverseMedia.map((finding) => (
              <div key={finding.id} className="rounded-lg border border-neutral-200 p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-neutral-900">{finding.title}</h4>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      finding.severity === 'High' && 'bg-red-100 text-red-800 border-red-300',
                      finding.severity === 'Medium' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                      finding.severity === 'Low' && 'bg-green-100 text-green-800 border-green-300'
                    )}
                  >
                    {finding.severity}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-700 mb-2">{finding.summary}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-600">
                  <span>Source: {finding.source}</span>
                  <span>•</span>
                  <span>{new Date(finding.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sanctions Screening Results */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Sanctions Screening</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">
            Last screened: {new Date(sanctionsResults.lastScreened).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-neutral-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              {sanctionsResults.status === 'CLEAR' ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <XCircle className="h-12 w-12 text-red-500" />
              )}
              <div>
                <p className="font-semibold text-lg text-neutral-900">
                  {sanctionsResults.status === 'CLEAR' ? 'No Matches Found' : 'Match Detected'}
                </p>
                <p className="text-sm text-neutral-600">{sanctionsResults.details}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">{sanctionsResults.matchesFound}</p>
                <p className="text-xs text-neutral-600">Match{sanctionsResults.matchesFound !== 1 ? 'es' : ''} Found</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">3</p>
                <p className="text-xs text-neutral-600">Lists Checked</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-neutral-900">100%</p>
                <p className="text-xs text-neutral-600">Coverage</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Flags */}
      {riskData.flags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Risk Flags</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">
              {riskData.flags.length} flag{riskData.flags.length !== 1 ? 's' : ''} requiring attention
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskData.flags.map((flag, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                  <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-900">{flag}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Recommendations</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Suggested actions and mitigation strategies</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskData.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 border border-primary-200">
                <Shield className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-primary-900">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="flex-1">
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline" className="flex-1">
          Update Risk Assessment
        </Button>
        <Button variant="outline" className="flex-1">
          Schedule Review
        </Button>
      </div>
    </div>
  )
}

