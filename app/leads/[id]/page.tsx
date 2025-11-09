'use client'

import React, { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockLeads } from '@/lib/mock-data/leads'
import { Lead } from '@/lib/types/lead'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AIScoreBadge from '@/components/leads/ai-score-badge'
import { ArrowLeft, Mail, Phone, Globe, Linkedin, Building2, MapPin, DollarSign, Calendar, Edit, Trash2, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { getStageDisplayName } from '@/lib/types/lead'
import { aiLeadScoringService } from '@/lib/services/ai-lead-scoring'
import { cn } from '@/lib/utils'

interface LeadDetailsPageProps {
  params: Promise<{ id: string }>
}

export default function LeadDetailsPage({ params }: LeadDetailsPageProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundLead = mockLeads.find((l) => l.id === resolvedParams.id)
      setLead(foundLead || null)
      setLoading(false)
    }, 500)
  }, [resolvedParams.id])

  const handleConvertToClient = async () => {
    if (!lead) return
    // Simulate conversion
    alert('Converting lead to client... (This is a mock action)')
    // In a real app, you'd call an API to convert the lead
    // router.push(`/clients/${newClientId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="space-y-6">
        <Link href="/leads" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Leads</span>
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-neutral-500">Lead not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const recommendation = aiLeadScoringService.getScoreRecommendation(lead.aiScore)
  const insights = aiLeadScoringService.getScoreInsights(lead.aiScoreBreakdown)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/leads" className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Leads</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push(`/leads/${lead.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Lead
          </Button>
          {lead.status === 'active' && lead.pipelineStage === 'onboarding' && (
            <Button onClick={handleConvertToClient}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Convert to Client
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
                <h1 className="font-sans text-3xl font-bold text-neutral-900">{lead.companyName}</h1>
              </div>
              <div className="flex items-center gap-4 text-neutral-600">
                <span className="flex items-center gap-1">
                  {lead.industry}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {lead.country}
                </span>
                {lead.companySize && (
                  <>
                    <span>•</span>
                    <span>{lead.companySize}</span>
                  </>
                )}
              </div>
            </div>
            <AIScoreBadge score={lead.aiScore} breakdown={lead.aiScoreBreakdown} size="lg" />
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
                  <p className="font-medium">{lead.contactEmail}</p>
                </div>
              </div>
              {lead.contactPhone && (
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Phone</p>
                    <p className="font-medium">{lead.contactPhone}</p>
                  </div>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Globe className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Website</p>
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary-600">
                      {lead.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
              )}
              {lead.linkedin && (
                <div className="flex items-center gap-3 text-neutral-700">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Linkedin className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">LinkedIn</p>
                    <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium hover:text-primary-600">
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
                {lead.activities.map((activity) => (
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
          {lead.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-700 whitespace-pre-wrap">{lead.notes}</p>
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
                <Badge className="text-sm">{getStageDisplayName(lead.pipelineStage)}</Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Lead Status</p>
                <Badge variant="outline" className="text-sm">
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-neutral-500 mb-1">Assigned To</p>
                <p className="font-medium text-neutral-900">{lead.assignedToName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          {(lead.estimatedRevenue || lead.expectedCloseDate) && (
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lead.estimatedRevenue && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Estimated Revenue</p>
                      <p className="font-semibold text-lg text-neutral-900">
                        ${lead.estimatedRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                {lead.expectedCloseDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Expected Close Date</p>
                      <p className="font-medium text-neutral-900">
                        {new Date(lead.expectedCloseDate).toLocaleDateString('en-US', {
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
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Book Meeting
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Lead
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

