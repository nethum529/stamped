export type DocumentType =
  | 'passport'
  | 'business_license'
  | 'kyc_form'
  | 'proof_of_address'
  | 'financial_statement'
  | 'tax_return'
  | 'incorporation_certificate'
  | 'shareholder_agreement'
  | 'compliance_certificate'
  | 'other'

export type DocumentStatus =
  | 'pending_upload'
  | 'uploaded'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'expired'

export interface DocumentAnnotation {
  id: string
  documentId: string
  userId: string
  userName: string
  userType: 'client' | 'employee'
  type: 'highlight' | 'comment' | 'redaction'
  content: string
  x: number
  y: number
  width: number
  height: number
  page: number
  color: string
  createdAt: string
}

export interface Document {
  id: string
  clientId: string
  vendorId?: string
  type: DocumentType
  name: string
  fileName: string
  fileSize: number
  mimeType: string
  status: DocumentStatus
  uploadedBy: string
  uploadedByName: string
  uploadedAt: string
  reviewedBy?: string
  reviewedByName?: string
  reviewedAt?: string
  url: string
  thumbnailUrl?: string
  annotations: DocumentAnnotation[]
  comments: string[]
  expiryDate?: string
  isRequired: boolean
  version: number
  previousVersions?: string[] // Document IDs
}

// Helper functions
export function getDocumentTypeDisplayName(type: DocumentType): string {
  const displayNames: Record<DocumentType, string> = {
    passport: 'Passport',
    business_license: 'Business License',
    kyc_form: 'KYC Form',
    proof_of_address: 'Proof of Address',
    financial_statement: 'Financial Statement',
    tax_return: 'Tax Return',
    incorporation_certificate: 'Incorporation Certificate',
    shareholder_agreement: 'Shareholder Agreement',
    compliance_certificate: 'Compliance Certificate',
    other: 'Other',
  }
  return displayNames[type]
}

export function getDocumentStatusColor(status: DocumentStatus): 'default' | 'warning' | 'success' | 'error' {
  const colors: Record<DocumentStatus, 'default' | 'warning' | 'success' | 'error'> = {
    pending_upload: 'default',
    uploaded: 'warning',
    under_review: 'warning',
    approved: 'success',
    rejected: 'error',
    expired: 'error',
  }
  return colors[status]
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export function isDocumentExpiringSoon(expiryDate?: string): boolean {
  if (!expiryDate) return false
  const today = new Date()
  const expiry = new Date(expiryDate)
  const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0
}

export function isDocumentExpired(expiryDate?: string): boolean {
  if (!expiryDate) return false
  const today = new Date()
  const expiry = new Date(expiryDate)
  return expiry < today
}

