'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Lead } from '@/lib/types/lead'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import AIScoreBadge from '@/components/leads/ai-score-badge'
import { ArrowLeft, Mail, Phone, Globe, Linkedin, Building2, MapPin, DollarSign, Calendar, Edit, Trash2, CheckCircle, Loader2, Send } from 'lucide-react'
import Link from 'next/link'
import { getStageDisplayName } from '@/lib/types/lead'
import { aiLeadScoringService } from '@/lib/services/ai-lead-scoring'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LeadDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [converting, setConverting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    async function fetchLead() {
      try {
        setLoading(true)
        setError(null)
        const leadId = params.id as string
        if (!leadId) {
          setError('Lead ID is required')
          return
        }
        const foundLead = await mockDataService.getLeadById(leadId)
        setLead(foundLead)
      } catch (err) {
        console.error('Failed to fetch lead:', err)
        setError('Failed to load lead details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchLead()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleConvertToClient = async () => {
    if (!lead) return

    setConverting(true)
    try {
      const newClient = await mockDataService.convertLeadToClient(lead.id)
      if (newClient) {
        showSuccess(`Lead converted to client successfully! Client ID: ${newClient.id}`)
        // Navigate to the new client page
        setTimeout(() => {
          router.push(`/clients/${newClient.id}`)
        }, 1500)
      } else {
        throw new Error('Failed to convert lead to client')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setConverting(false)
    }
  }

  const handleDeleteLead = async () => {
    if (!lead) return
    if (deleteConfirm !== lead.companyName) {
      showError(`Please type "${lead.companyName}" to confirm deletion`)
      return
    }

    setDeleting(true)
    try {
      const success = await mockDataService.deleteLead(lead.id)
      if (success) {
        showSuccess('Lead deleted successfully')
        setShowDeleteModal(false)
        setDeleteConfirm('')
        // Navigate back to leads page
        setTimeout(() => {
          router.push('/leads')
        }, 1000)
      } else {
        throw new Error('Failed to delete lead')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const handleSendEmail = () => {
    if (!lead) return
    // Open email client with pre-filled email
    const subject = encodeURIComponent(`Regarding ${lead.companyName}`)
    const body = encodeURIComponent(`Hello ${lead.contactName},\n\n`)
    window.location.href = `mailto:${lead.contactEmail}?subject=${subject}&body=${body}`
    showSuccess('Opening email client...')
  }

  const handleScheduleCall = () => {
    if (!lead) return
    // Navigate to schedule meeting page with pre-filled lead
    router.push(`/leads/schedule-meeting?leadId=${lead.id}`)
  }

  const handleBookMeeting = () => {
    handleScheduleCall() // Same as schedule call
  }

  if (loading) {
    return (
      <DashboardShell title="Loading..." userRole="relationship_manager" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  if (error || !lead) {
    return (
      <DashboardShell title="Lead Not Found" userRole="relationship_manager" userName={user?.name || undefined}>
        <div className="space-y-6">
          <Link href="/leads" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Leads</span>
          </Link>
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-neutral-500">{error || 'Lead not found'}</p>
              {error && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    )
  }

  // At this point, lead is guaranteed to be non-null due to early return above
  const currentLead = lead
  const recommendation = aiLeadScoringService.getScoreRecommendation(currentLead.aiScore)
  const insights = aiLeadScoringService.getScoreInsights(currentLead.aiScoreBreakdown)

  return (
    <DashboardShell title={currentLead.companyName} userRole="relationship_manager" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link href="/leads" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Leads</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => router.push(`/leads/${currentLead.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Lead
            </Button>
            {currentLead.status === 'active' && currentLead.pipelineStage === 'onboarding' && (
              <Button onClick={handleConvertToClient} disabled={converting}>
                {converting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Convert to Client
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      {/* Lead Overview */}
      <Card className="border-l-4 border-l-primary-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary-600" />
                <h1 className="font-sans text-3xl font-bold text-neutral-900">{currentLead.companyName}</h1>
              </div>
              <div className="flex items-center gap-4 text-neutral-600">
                <span className="flex items-center gap-1">
                  {currentLead.industry}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {currentLead.country}
                </span>
                {currentLead.companySize && (
                  <>
                    <span>•</span>
                    <span>{currentLead.companySize}</span>
                  </>
                )}
              </div>
            </div>
            <AIScoreBadge score={currentLead.aiScore} breakdown={currentLead.aiScoreBreakdown} size="lg" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-neutral-700">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium">{currentLead.contactEmail}</p>
                </div>
              </div>
              {currentLead.contactPhone && (
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Phone</p>
                    <p className="font-medium">{currentLead.contactPhone}</p>
                  </div>
                </div>
              )}
              {currentLead.website && (
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Website</p>
                    <a href={currentLead.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary-600">
                      {currentLead.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
              {currentLead.linkedin && (
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Linkedin className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">LinkedIn</p>
                    <a href={currentLead.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary-600">
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={cn(
                "p-4 rounded-lg border-l-4",
                recommendation.priority === 'high' && "bg-green-50 border-green-500",
                recommendation.priority === 'medium' && "bg-primary-50 border-primary-500",
                recommendation.priority === 'low' && "bg-yellow-50 border-yellow-500"
              )}>
                <h4 className="font-sans font-semibold text-neutral-900 mb-1">Recommendation</h4>
                <p className="text-sm font-medium mb-1">{recommendation.action}</p>
                <p className="text-sm text-neutral-600">{recommendation.rationale}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-sans font-semibold text-neutral-900">Key Insights</h4>
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-neutral-700">
                    <span className="mt-0.5">•</span>
                    <span>{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentLead.activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        activity.type === 'email' && "bg-blue-500",
                        activity.type === 'call' && "bg-green-500",
                        activity.type === 'meeting' && "bg-purple-500",
                        activity.type === 'note' && "bg-yellow-500",
                        activity.type === 'status_change' && "bg-primary-500"
                      )}></div>
                      <div className="w-0.5 h-full bg-neutral-200 min-h-[40px]"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-neutral-900">{activity.description}</p>
                      <p className="text-sm text-neutral-500">
                        {new Date(activity.timestamp).toLocaleString()} • {activity.performedBy}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {currentLead.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 whitespace-pre-wrap">{currentLead.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Stats & Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Pipeline Stage</p>
                <Badge className="text-sm">{getStageDisplayName(currentLead.pipelineStage)}</Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Lead Status</p>
                <Badge variant="outline" className="text-sm">
                  {currentLead.status.charAt(0).toUpperCase() + currentLead.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Assigned To</p>
                <p className="font-medium text-neutral-900">{currentLead.assignedToName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          {(currentLead.estimatedRevenue || currentLead.expectedCloseDate) && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentLead.estimatedRevenue && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Estimated Revenue</p>
                      <p className="font-semibold text-lg text-neutral-900">
                        ${currentLead.estimatedRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {currentLead.expectedCloseDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Expected Close Date</p>
                      <p className="font-medium text-neutral-900">
                        {new Date(currentLead.expectedCloseDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleSendEmail}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleScheduleCall}
              >
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleBookMeeting}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Book Meeting
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Lead
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeleteConfirm('')
        }}
        title="Delete Lead"
        description="This action cannot be undone. This will permanently delete the lead and all associated data."
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-900">
              <strong>Warning:</strong> Deleting this lead will remove all associated data including activities, notes, and meetings.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-2 block">
              Type <strong>{currentLead.companyName}</strong> to confirm deletion
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={currentLead.companyName}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteModal(false)
                setDeleteConfirm('')
              }}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteLead}
              disabled={deleting || deleteConfirm !== currentLead.companyName}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Lead
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

