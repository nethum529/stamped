'use client'

import * as React from 'react'
import { UnifiedNav } from './unified-nav'
import type { EmployeeRole } from './unified-nav'
import { cn } from '@/lib/utils'
import { AtmosphericBackground } from '@/components/landing/atmospheric-background'
import { useAuth } from '@/lib/hooks/useAuth'
import { ToastProvider } from '@/components/ui/toast'

interface DashboardShellProps {
  children: React.ReactNode
  title?: string
  notificationCount?: number
  userRole?: 'compliance' | 'relationship' | 'procurement' | 'compliance_officer' | 'relationship_manager' | 'risk_analyst' | 'executive'
  userName?: string
  className?: string
}

export function DashboardShell({
  children,
  title,
  notificationCount,
  userRole,
  userName,
  className,
}: DashboardShellProps) {
  const { user } = useAuth()
  
  // Map old role format to new format
  const mapRole = (role?: string): EmployeeRole => {
    if (role === 'compliance' || role === 'compliance_officer') return 'compliance_officer'
    if (role === 'relationship' || role === 'relationship_manager') return 'relationship_manager'
    if (role === 'risk_analyst') return 'risk_analyst'
    if (role === 'executive') return 'executive'
    return 'relationship_manager' // default
  }

  // Determine the role to use: prefer prop, fallback to user's role from auth
  // If neither is available, use a safe default to prevent rendering issues
  const effectiveRole = userRole || user?.role || 'relationship_manager'
  const mappedRole = mapRole(effectiveRole)

  // Use provided userName, or get from auth, ensuring it's always a valid string
  // UnifiedNav will handle fallback to 'User' if needed, but we ensure we pass a string or undefined
  const displayUserName = userName || (user?.name && typeof user.name === 'string' && user.name.trim().length > 0 ? user.name.trim() : undefined)

  return (
    <ToastProvider>
      <AtmosphericBackground variant="light">
        <div className="flex min-h-screen flex-col">
          <UnifiedNav 
            userType="employee" 
            userRole={mappedRole} 
            userName={displayUserName}
          />
          
          <main className={cn('flex-1 p-8 md:p-10 lg:p-12', className)}>
            {children}
          </main>
        </div>
      </AtmosphericBackground>
    </ToastProvider>
  )
}

