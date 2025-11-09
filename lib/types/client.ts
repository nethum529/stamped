import { Document } from './document'

export type LifecycleStage =
  | 'lead' // Initial prospecting
  | 'contacted' // First contact made
  | 'onboarding' // In onboarding process
  | 'kyc_review' // KYC documents under review
  | 'compliance_review' // Compliance check in progress
  | 'approved' // Approved and active
  | 'active' // Fully onboarded and active
  | 'suspended' // Temporarily suspended
  | 'inactive' // No longer active

export type ClientStatus = 'active' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface RiskAssessment {
  overall: RiskLevel
  sanctionsRisk: number // 0-100
  adverseMediaRisk: number // 0-100
  financialRisk: number // 0-100
  reputationalRisk: number // 0-100
  geographicRisk: number // 0-100
  lastAssessedAt: string
  lastAssessedBy: string
}

export interface LifecycleHistory {
  id: string
  stage: LifecycleStage
  timestamp: string
  changedBy: string
  changedByName: string
  notes?: string
}

export interface Client {
  id: string
  companyName: string
  industry: string
  country: string
  city?: string
  address?: string
  phone?: string
  email: string
  website?: string
  
  // Lifecycle
  lifecycleStage: LifecycleStage
  status: ClientStatus
  lifecycleHistory: LifecycleHistory[]
  
  // Assignments
  assignedRM: string // Relationship Manager ID
  assignedRMName: string
  assignedOfficer: string // Compliance Officer ID
  assignedOfficerName: string
  
  // Risk
  riskLevel: RiskLevel
  riskAssessment: RiskAssessment
  
  // Documents
  documents: Document[]
  requiredDocuments: string[] // Document types that are required
  
  // Dates
  createdAt: string
  updatedAt: string
  lastContactDate: string
  onboardingStartDate?: string
  onboardingCompletedDate?: string
  approvalDate?: string
  
  // Additional Info
  annualRevenue?: number
  numberOfEmployees?: number
  primaryContact?: {
    name: string
    title: string
    email: string
    phone: string
  }
  notes?: string
}

// Helper functions
export function getLifecycleStageDisplayName(stage: LifecycleStage): string {
  const displayNames: Record<LifecycleStage, string> = {
    lead: 'Lead',
    contacted: 'Contacted',
    onboarding: 'Onboarding',
    kyc_review: 'KYC Review',
    compliance_review: 'Compliance Review',
    approved: 'Approved',
    active: 'Active',
    suspended: 'Suspended',
    inactive: 'Inactive',
  }
  return displayNames[stage]
}

export function getLifecycleProgress(stage: LifecycleStage): number {
  const progress: Record<LifecycleStage, number> = {
    lead: 10,
    contacted: 20,
    onboarding: 40,
    kyc_review: 60,
    compliance_review: 80,
    approved: 90,
    active: 100,
    suspended: 0,
    inactive: 0,
  }
  return progress[stage]
}

export function getRiskLevelColor(level: RiskLevel): 'success' | 'warning' | 'error' {
  const colors: Record<RiskLevel, 'success' | 'warning' | 'error'> = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error',
  }
  return colors[level]
}

export function getStatusColor(status: ClientStatus): 'default' | 'warning' | 'success' | 'error' {
  const colors: Record<ClientStatus, 'default' | 'warning' | 'success' | 'error'> = {
    active: 'success',
    pending: 'warning',
    under_review: 'warning',
    approved: 'success',
    rejected: 'error',
    suspended: 'error',
  }
  return colors[status]
}

export function calculateOnboardingDuration(client: Client): number | null {
  if (!client.onboardingStartDate || !client.onboardingCompletedDate) {
    return null
  }
  
  const start = new Date(client.onboardingStartDate)
  const end = new Date(client.onboardingCompletedDate)
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  
  return days
}

export function getDocumentCompletionRate(client: Client): number {
  if (client.requiredDocuments.length === 0) return 100
  
  const uploadedDocs = client.documents.filter(d => 
    d.status === 'approved' || d.status === 'under_review'
  )
  
  return Math.round((uploadedDocs.length / client.requiredDocuments.length) * 100)
}

