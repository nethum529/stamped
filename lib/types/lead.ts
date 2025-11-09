export type PipelineStage = 
  | 'prospecting'
  | 'contact_made'
  | 'meeting_scheduled'
  | 'proposal_sent'
  | 'negotiating'
  | 'onboarding'
  | 'converted'
  | 'lost'

export type LeadStatus = 'active' | 'inactive' | 'converted' | 'lost'

export type Industry =
  | 'Technology'
  | 'Financial Services'
  | 'Healthcare'
  | 'Manufacturing'
  | 'Retail'
  | 'Energy'
  | 'Real Estate'
  | 'Telecommunications'
  | 'Consulting'
  | 'Other'

export interface AIScoreBreakdown {
  companySize: number // 0-100
  industry: number // 0-100
  geography: number // 0-100
  contactQuality: number // 0-100
  overall: number // 0-100
}

export interface LeadActivity {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note' | 'status_change'
  description: string
  timestamp: string
  performedBy: string
}

export type MeetingType = 'call' | 'video' | 'in_person'

export interface Meeting {
  id: string
  leadId?: string // Optional: meeting can be with a lead, client, or vendor
  clientId?: string
  vendorId?: string
  entityType: 'lead' | 'client' | 'vendor' // Type of entity the meeting is with
  entityName?: string // Name of the entity (for display purposes)
  title: string
  type: MeetingType
  date: string
  time: string
  duration: number // in minutes
  attendees: string[] // email addresses
  notes: string
  createdBy: string
  createdByName: string
  createdAt: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface Lead {
  id: string
  companyName: string
  industry: Industry
  country: string
  contactEmail: string
  contactPhone: string
  contactName: string
  status: LeadStatus
  pipelineStage: PipelineStage
  aiScore: number // 0-100
  aiScoreBreakdown: AIScoreBreakdown
  createdAt: string
  updatedAt: string
  assignedTo: string // Employee ID
  assignedToName: string // Employee name
  notes: string
  activities: LeadActivity[]
  estimatedRevenue?: number
  expectedCloseDate?: string
  companySize?: string
  website?: string
  linkedin?: string
}

// Helper functions
export function getStageDisplayName(stage: PipelineStage): string {
  const displayNames: Record<PipelineStage, string> = {
    prospecting: 'Prospecting',
    contact_made: 'Contact Made',
    meeting_scheduled: 'Meeting Scheduled',
    proposal_sent: 'Proposal Sent',
    negotiating: 'Negotiating',
    onboarding: 'Onboarding',
    converted: 'Converted',
    lost: 'Lost',
  }
  return displayNames[stage]
}

export function getStageProgress(stage: PipelineStage): number {
  const progress: Record<PipelineStage, number> = {
    prospecting: 10,
    contact_made: 25,
    meeting_scheduled: 40,
    proposal_sent: 55,
    negotiating: 70,
    onboarding: 85,
    converted: 100,
    lost: 0,
  }
  return progress[stage]
}

export function getScoreColor(score: number): string {
  if (score >= 75) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

