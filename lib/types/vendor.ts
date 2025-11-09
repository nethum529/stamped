import { Document } from './document'
import { LifecycleStage, RiskLevel, RiskAssessment, LifecycleHistory } from './client'

export type VendorStatus = 'active' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended'

export type VendorCategory = 
  | 'IT Services'
  | 'Consulting'
  | 'Supplier'
  | 'Contractor'
  | 'Professional Services'
  | 'Other'

export interface Vendor {
  id: string
  companyName: string
  category: VendorCategory
  industry: string
  country: string
  city?: string
  address?: string
  phone?: string
  email: string
  website?: string
  
  // Lifecycle
  lifecycleStage: LifecycleStage
  status: VendorStatus
  lifecycleHistory: LifecycleHistory[]
  
  // Assignments
  assignedProcurementOfficer: string
  assignedProcurementOfficerName: string
  assignedComplianceOfficer: string
  assignedComplianceOfficerName: string
  
  // Risk
  riskLevel: RiskLevel
  riskAssessment: RiskAssessment
  
  // Documents
  documents: Document[]
  requiredDocuments: string[]
  
  // Dates
  createdAt: string
  updatedAt: string
  lastContactDate: string
  onboardingStartDate?: string
  onboardingCompletedDate?: string
  approvalDate?: string
  contractStartDate?: string
  contractEndDate?: string
  
  // Additional Info
  annualSpend?: number
  numberOfEmployees?: number
  primaryContact?: {
    name: string
    title: string
    email: string
    phone: string
  }
  services?: string[]
  notes?: string
}

// Helper functions
export function getVendorStatusColor(status: VendorStatus): 'default' | 'warning' | 'success' | 'error' {
  const colors: Record<VendorStatus, 'default' | 'warning' | 'success' | 'error'> = {
    active: 'success',
    pending: 'warning',
    under_review: 'warning',
    approved: 'success',
    rejected: 'error',
    suspended: 'error',
  }
  return colors[status]
}

export function isContractExpiringSoon(vendor: Vendor): boolean {
  if (!vendor.contractEndDate) return false
  
  const today = new Date()
  const endDate = new Date(vendor.contractEndDate)
  const daysUntilExpiry = Math.floor((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  return daysUntilExpiry <= 90 && daysUntilExpiry > 0
}

export function isContractExpired(vendor: Vendor): boolean {
  if (!vendor.contractEndDate) return false
  
  const today = new Date()
  const endDate = new Date(vendor.contractEndDate)
  
  return endDate < today
}

