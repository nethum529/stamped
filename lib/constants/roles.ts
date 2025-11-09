import { EmployeeRole, UserType } from '@/lib/auth/types'

// User Types
export const USER_TYPES = {
  CLIENT: 'client' as UserType,
  EMPLOYEE: 'employee' as UserType,
}

// Employee Roles
export const EMPLOYEE_ROLES = {
  RELATIONSHIP_MANAGER: 'relationship_manager' as EmployeeRole,
  COMPLIANCE_OFFICER: 'compliance_officer' as EmployeeRole,
  RISK_ANALYST: 'risk_analyst' as EmployeeRole,
  EXECUTIVE: 'executive' as EmployeeRole,
}

// Role Display Names
export const ROLE_DISPLAY_NAMES: Record<EmployeeRole, string> = {
  relationship_manager: 'Relationship Manager',
  compliance_officer: 'Compliance Officer',
  risk_analyst: 'Risk Analyst',
  executive: 'Executive',
}

// Role Descriptions
export const ROLE_DESCRIPTIONS: Record<EmployeeRole, string> = {
  relationship_manager: 'Manages client relationships and lead prospecting',
  compliance_officer: 'Reviews documents and ensures regulatory compliance',
  risk_analyst: 'Analyzes risk and generates compliance reports',
  executive: 'Views high-level KPIs and strategic insights',
}

// Default routes for each role
export const ROLE_DEFAULT_ROUTES: Record<EmployeeRole, string> = {
  relationship_manager: '/dashboard',
  compliance_officer: '/dashboard',
  risk_analyst: '/risk-analyst/dashboard',
  executive: '/executive/dashboard',
}

// Role permissions (which features each role can access)
export const ROLE_PERMISSIONS = {
  relationship_manager: {
    leads: true,
    pipeline: true,
    clients: true,
    messages: true,
    vendors: false,
    compliance: false,
    riskAnalysis: false,
    executive: false,
  },
  compliance_officer: {
    leads: false,
    pipeline: false,
    clients: true,
    messages: true,
    vendors: true,
    compliance: true,
    riskAnalysis: false,
    executive: false,
  },
  risk_analyst: {
    leads: false,
    pipeline: false,
    clients: true,
    messages: false,
    vendors: true,
    compliance: true,
    riskAnalysis: true,
    executive: false,
  },
  executive: {
    leads: false,
    pipeline: false,
    clients: true,
    messages: false,
    vendors: true,
    compliance: false,
    riskAnalysis: false,
    executive: true,
  },
}

// Helper functions
export function getRoleDisplayName(role: EmployeeRole): string {
  return ROLE_DISPLAY_NAMES[role]
}

export function getRoleDescription(role: EmployeeRole): string {
  return ROLE_DESCRIPTIONS[role]
}

export function getDefaultRouteForRole(role: EmployeeRole): string {
  return ROLE_DEFAULT_ROUTES[role]
}

export function hasPermission(role: EmployeeRole, permission: keyof typeof ROLE_PERMISSIONS.compliance_officer): boolean {
  return ROLE_PERMISSIONS[role][permission] || false
}

