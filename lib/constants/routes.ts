// Public routes (no authentication required)
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/client-login',
  '/employee-login',
  '/signup',
  '/auth/callback',
  '/auth/reset-password',
]

// Client portal routes
export const CLIENT_ROUTES = [
  '/client-portal/dashboard',
  '/client-portal/documents',
  '/client-portal/messages',
  '/client-portal/profile',
]

// Employee routes
export const EMPLOYEE_ROUTES = [
  '/dashboard',
  '/clients',
  '/clients/new',
  '/clients/[id]',
  '/vendors',
  '/compliance',
  '/compliance/documents',
  '/compliance/risk-assessment',
  '/adverse-media',
  '/settings',
]

// Relationship Manager specific routes
export const RELATIONSHIP_MANAGER_ROUTES = [
  '/leads',
  '/leads/new',
  '/leads/pipeline',
  '/leads/[id]',
]

// Risk Analyst specific routes
export const RISK_ANALYST_ROUTES = [
  '/risk-analyst/dashboard',
  '/risk-analyst/analysis',
  '/risk-analyst/analysis/[id]',
  '/risk-analyst/reports',
]

// Executive specific routes
export const EXECUTIVE_ROUTES = [
  '/executive/dashboard',
  '/executive/insights',
]

// Helper function to check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith('/auth/')
  )
}

// Helper function to check if a route is for clients
export function isClientRoute(pathname: string): boolean {
  return pathname.startsWith('/client-portal')
}

// Helper function to check if a route is for employees
export function isEmployeeRoute(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isClientRoute(pathname)
}

