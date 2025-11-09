'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import { mockDataService } from '@/lib/services/mock-data-service'
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
  Calendar,
  Loader2,
  Scale,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/layout/back-button'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'

export default function RiskAnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const entityId = params.id as string

  // State for modals and loading
  const [generatingReport, setGeneratingReport] = useState(false)
  const [updatingAssessment, setUpdatingAssessment] = useState(false)
  const [schedulingReview, setSchedulingReview] = useState(false)
  const [escalating, setEscalating] = useState(false)
  
  // Modal states
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showEscalateModal, setShowEscalateModal] = useState(false)
  
  // Form states
  const [updateForm, setUpdateForm] = useState({
    riskLevel: '',
    notes: '',
  })
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    notes: '',
  })
  const [escalateNotes, setEscalateNotes] = useState('')

  // Find the risk score data
  const riskData = mockRiskScores.find((s) => s.entityId === entityId)

  if (!riskData) {
    return (
      <DashboardShell title="Risk Analysis" userRole="risk_analyst" userName={user?.name || undefined}>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Shield className="h-16 w-16 text-neutral-300 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Entity Not Found</h2>
          <p className="text-neutral-600 mb-4">The requested risk analysis could not be found.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </DashboardShell>
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

  const getProgressVariant = (score: number): 'default' | 'success' | 'warning' | 'error' => {
    if (score <= 25) return 'success'
    if (score <= 50) return 'warning'
    if (score <= 75) return 'warning'
    return 'error'
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

  // Handlers
  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    try {
      const report = await mockDataService.generateRiskReport(entityId)
      showSuccess(`Risk report generated successfully. Report ID: ${report.reportId}`)
      
      // In a real app, this would download the report
      // For now, we'll simulate a download
      setTimeout(() => {
        showSuccess('Report download started')
      }, 500)
    } catch (error) {
      showError(getUserFriendlyErrorMessage(error))
    } finally {
      setGeneratingReport(false)
    }
  }

  const handleUpdateAssessment = async () => {
    if (!updateForm.riskLevel) {
      showError('Please select a risk level')
      return
    }

    setUpdatingAssessment(true)
    try {
      await mockDataService.updateRiskAssessment(entityId, {
        riskLevel: updateForm.riskLevel as 'Low' | 'Medium' | 'High' | 'Critical',
      })
      showSuccess('Risk assessment updated successfully')
      setShowUpdateModal(false)
      setUpdateForm({ riskLevel: '', notes: '' })
      // Refresh page to show updated data
      window.location.reload()
    } catch (error) {
      showError(getUserFriendlyErrorMessage(error))
    } finally {
      setUpdatingAssessment(false)
    }
  }

  const handleScheduleReview = async () => {
    if (!scheduleForm.date) {
      showError('Please select a review date')
      return
    }

    setSchedulingReview(true)
    try {
      await mockDataService.scheduleReview(entityId, scheduleForm.date, scheduleForm.notes)
      showSuccess(`Review scheduled for ${new Date(scheduleForm.date).toLocaleDateString()}`)
      setShowScheduleModal(false)
      setScheduleForm({ date: '', notes: '' })
    } catch (error) {
      showError(getUserFriendlyErrorMessage(error))
    } finally {
      setSchedulingReview(false)
    }
  }

  const handleEscalateToLegal = async () => {
    setEscalating(true)
    try {
      // Simulate escalation to legal team
      await new Promise(resolve => setTimeout(resolve, 1000))
      showSuccess('Case escalated to legal team. They will review and contact you shortly.')
      setShowEscalateModal(false)
      setEscalateNotes('')
    } catch (error) {
      showError(getUserFriendlyErrorMessage(error))
    } finally {
      setEscalating(false)
    }
  }

  const handleViewDetails = () => {
    // Navigate to adverse media page or open details modal
    router.push(`/adverse-media?entityId=${entityId}`)
  }

  return (
    <DashboardShell title="Risk Analysis" userRole="risk_analyst" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <BackButton href="/compliance/risk-assessment" label="Back to Risk Assessment" />

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
                    <Button 
                      size="sm"
                      variant="danger"
                      onClick={() => setShowEscalateModal(true)}
                      disabled={escalating}
                    >
                      {escalating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Escalating...
                        </>
                      ) : (
                        <>
                          <Scale className="mr-2 h-4 w-4" />
                          Escalate to Legal
                        </>
                      )}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleViewDetails}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
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
                  variant={getProgressVariant(item.value)}
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
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="flex-1" 
          onClick={handleGenerateReport}
          disabled={generatingReport}
        >
          {generatingReport ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            setUpdateForm({ riskLevel: riskData.riskLevel, notes: '' })
            setShowUpdateModal(true)
          }}
          disabled={updatingAssessment}
        >
          {updatingAssessment ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Update Risk Assessment
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setShowScheduleModal(true)}
          disabled={schedulingReview}
        >
          {schedulingReview ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Review
            </>
          )}
        </Button>
      </div>

      {/* Update Risk Assessment Modal */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Update Risk Assessment"
        description="Update the risk level and add notes for this entity"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Risk Level <span className="text-red-500">*</span>
            </label>
            <select
              value={updateForm.riskLevel}
              onChange={(e) => setUpdateForm({ ...updateForm, riskLevel: e.target.value })}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Select risk level...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Notes (Optional)
            </label>
            <Textarea
              value={updateForm.notes}
              onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
              placeholder="Add notes about this risk assessment update..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAssessment} disabled={updatingAssessment}>
              {updatingAssessment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Assessment'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Review Modal */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="Schedule Risk Review"
        description="Schedule a future review for this entity"
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Review Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Notes (Optional)
            </label>
            <Textarea
              value={scheduleForm.notes}
              onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
              placeholder="Add notes about this scheduled review..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleReview} disabled={schedulingReview}>
              {schedulingReview ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                'Schedule Review'
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Escalate to Legal Modal */}
      <Modal
        isOpen={showEscalateModal}
        onClose={() => setShowEscalateModal(false)}
        title="Escalate to Legal Team"
        description="This will escalate this case to the legal team for immediate review"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-900">
              <strong>Warning:</strong> This action will immediately notify the legal team about this sanctions match. 
              Please provide any additional context or urgency details below.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Additional Notes (Optional)
            </label>
            <Textarea
              value={escalateNotes}
              onChange={(e) => setEscalateNotes(e.target.value)}
              placeholder="Add any additional context or urgency details..."
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEscalateModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleEscalateToLegal} disabled={escalating}>
              {escalating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Escalating...
                </>
              ) : (
                <>
                  <Scale className="mr-2 h-4 w-4" />
                  Escalate to Legal
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </DashboardShell>
  )
}

