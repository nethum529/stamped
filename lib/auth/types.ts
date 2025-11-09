export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
  field?: string
}

export interface AuthResponse {
  success: boolean
  error?: AuthError
  requiresVerification?: boolean
  user?: any
}

export type AuthErrorCode =
  | 'EMAIL_EXISTS'
  | 'INVALID_EMAIL'
  | 'WEAK_PASSWORD'
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_CONFIRMED'
  | 'TOO_MANY_REQUESTS'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'USER_DISABLED'
  | 'PASSWORD_MISMATCH'

// User Types & Roles
export type UserType = 'client' | 'employee'

export type EmployeeRole = 
  | 'relationship_manager' 
  | 'compliance_officer' 
  | 'risk_analyst' 
  | 'executive'

export interface UserMetadata {
  name: string
  userType: UserType
  role?: EmployeeRole // Only for employee users
  clientId?: string // For client users
  companyName?: string // For client users
}

export interface AuthUser {
  id: string
  email: string
  metadata: UserMetadata
}

