'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  FileText,
  MessageSquare,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  TrendingUp,
  FileCheck,
  BarChart3,
  Lightbulb,
  Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { NotificationCenter } from '@/components/notifications/notification-center'
import { useAuth } from '@/lib/hooks/useAuth'

export type UserType = 'client' | 'vendor' | 'employee'
export type EmployeeRole = 'relationship_manager' | 'compliance_officer' | 'risk_analyst' | 'executive'

interface UnifiedNavProps {
  userType: UserType
  userRole?: EmployeeRole
  userName?: string
}

// Navigation item type
type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  comingSoon?: boolean
}

// Navigation items for different user types
const clientNavItems: NavItem[] = [
  { href: '/client-portal/dashboard', label: 'Dashboard', icon: Home },
  { href: '/client-portal/documents', label: 'Documents', icon: FileText },
  { href: '/client-portal/messages', label: 'Messages', icon: MessageSquare },
  { href: '/client-portal/profile', label: 'Profile', icon: User },
]

const vendorNavItems: NavItem[] = [
  { href: '/vendor-portal/dashboard', label: 'Dashboard', icon: Home },
  { href: '/vendor-portal/documents', label: 'Documents', icon: FileText },
  { href: '/vendor-portal/messages', label: 'Messages', icon: MessageSquare },
  { href: '/vendor-portal/profile', label: 'Profile', icon: User },
]

const employeeNavItemsByRole: Record<string, NavItem[]> = {
  relationship_manager: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/leads', label: 'Leads', icon: Users },
    { href: '/leads/pipeline', label: 'Pipeline', icon: TrendingUp },
    { href: '/clients', label: 'Clients', icon: Building2 },
  ],
  compliance_officer: [
    { href: '/compliance', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/compliance/documents', label: 'Documents', icon: FileCheck },
    { href: '/compliance/risk-assessment', label: 'Risk Assessment', icon: BarChart3 },
    { href: '/clients', label: 'Clients', icon: Users },
  ],
  risk_analyst: [
    { href: '/risk-analyst/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/risk-analyst/analysis', label: 'Risk Analysis', icon: BarChart3 },
    { href: '/risk-analyst/reports', label: 'Reports', icon: FileText, comingSoon: true },
  ],
  executive: [
    { href: '/executive/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/executive/insights', label: 'Insights', icon: Lightbulb },
  ],
}

export function UnifiedNav({ userType, userRole: userRoleProp, userName }: UnifiedNavProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Determine the effective role: prefer prop, fallback to user's role from auth
  // This ensures the navigation always reflects the user's actual role
  const userRole = userRoleProp || (user?.role as EmployeeRole | undefined)

  // Helper function to get initials safely - handles all edge cases
  const getInitials = (name: string | null | undefined): string => {
    // Handle null, undefined, or non-string values
    if (!name || typeof name !== 'string') return 'U'
    
    // Trim and ensure it's not empty
    const trimmed = name.trim()
    if (!trimmed || trimmed.length === 0) return 'U'
    
    // Handle special cases like 'null' or 'undefined' strings
    if (trimmed === 'null' || trimmed === 'undefined') return 'U'
    
    // Split by spaces and filter out empty parts
    const parts = trimmed.split(' ').filter(p => p && p.length > 0)
    if (parts.length === 0) return 'U'
    
    // Get first character of first word
    const firstChar = parts[0][0]?.toUpperCase() || 'U'
    
    // If only one word, return first char
    if (parts.length === 1) return firstChar
    
    // If multiple words, return first char of first and last word
    const lastChar = parts[parts.length - 1][0]?.toUpperCase() || ''
    return (firstChar + lastChar).slice(0, 2)
  }

  // Safely get display name - always returns a string, never undefined
  const getDisplayName = (): string => {
    // Try userName prop first
    if (userName && typeof userName === 'string' && userName.trim().length > 0) {
      return userName.trim()
    }
    
    // Try user.name from auth
    if (user?.name && typeof user.name === 'string' && user.name.trim().length > 0) {
      return user.name.trim()
    }
    
    // Fallback to 'User'
    return 'User'
  }

  // Always get a valid display name
  const displayName = getDisplayName()

  // Determine navigation items based on user type
  const getNavItems = () => {
    if (userType === 'client') return clientNavItems
    if (userType === 'vendor') return vendorNavItems
    if (userType === 'employee') {
      // Use the effective role determined above
      // Debug logging (can be removed in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('[UnifiedNav] Role detection:', {
          userRoleProp,
          userRoleFromAuth: user?.role,
          effectiveRole: userRole,
          availableRoles: Object.keys(employeeNavItemsByRole),
        })
      }
      
      if (userRole && userRole in employeeNavItemsByRole) {
        return employeeNavItemsByRole[userRole]
      }
      // Default fallback
      return employeeNavItemsByRole.relationship_manager
    }
    return []
  }

  const navItems = getNavItems()

  const handleSignOut = async () => {
    const { authService } = await import('@/lib/auth/service')
    await authService.signOut()
    window.location.href = '/login'
  }

  // Determine home route based on effective role
  const getHomeRoute = () => {
    if (userType === 'client') return '/client-portal/dashboard'
    if (userType === 'vendor') return '/vendor-portal/dashboard'
    if (userType === 'employee' && userRole) {
      if (userRole === 'compliance_officer') return '/compliance'
      if (userRole === 'risk_analyst') return '/risk-analyst/dashboard'
      if (userRole === 'executive') return '/executive/dashboard'
      return '/dashboard'
    }
    return '/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-200/50 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href={getHomeRoute()} 
            className="relative h-10 w-32 transition-transform duration-200 hover:scale-105"
          >
            <Image
              src="/logo.png"
              alt="Stamped"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <div key={item.href} className="relative group/item">
                  <Link
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-turquoise-50/50 text-primary-700 shadow-sm'
                        : 'text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100/50 hover:text-neutral-900',
                      item.comingSoon && 'opacity-60 cursor-not-allowed'
                    )}
                    onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isActive ? "text-primary-600" : "text-neutral-500 group-hover:text-primary-600 group-hover:scale-110"
                    )} />
                    {item.label}
                    {item.comingSoon && (
                      <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">
                        Soon
                      </span>
                    )}
                  </Link>
                  {item.comingSoon && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      Coming Soon
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Right side - Notifications & User Menu */}
          <div className="flex items-center gap-3">
            {/* Notification Center for employees */}
            {userType === 'employee' && <NotificationCenter />}

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-2 rounded-xl bg-white/80 backdrop-blur-sm border border-neutral-200/50 transition-all duration-300 hover:shadow-md">
              <button
                onClick={() => router.push('/settings')}
                className="flex items-center gap-2 rounded-lg hover:bg-white/50 transition-colors px-3 py-2 cursor-pointer flex-1"
                title="View Profile & Settings"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-100 to-turquoise-100 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-semibold text-primary-700">
                    {getInitials(displayName)}
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate max-w-[120px]">{displayName}</p>
                  <p className="text-[10px] text-neutral-600 capitalize">
                    {userType === 'employee' && userRole ? userRole.replace('_', ' ') : userType}
                  </p>
                </div>
              </button>
              <button
                onClick={handleSignOut}
                className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-neutral-200/50 py-4 md:hidden">
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <div key={item.href} className="relative group/item">
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.comingSoon) {
                          e.preventDefault()
                        } else {
                          setMobileMenuOpen(false)
                        }
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300',
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-turquoise-50/50 text-primary-700 shadow-sm'
                          : 'text-neutral-700 hover:bg-gradient-to-r hover:from-neutral-50 hover:to-neutral-100/50 hover:text-neutral-900',
                        item.comingSoon && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary-600" : "text-neutral-500"
                      )} />
                      {item.label}
                      {item.comingSoon && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 font-medium">
                          Soon
                        </span>
                      )}
                    </Link>
                    {item.comingSoon && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                        Coming Soon
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Mobile User Info & Sign Out */}
              <div className="mt-4 pt-4 border-t border-neutral-200/50">
                <button
                  onClick={() => {
                    router.push('/settings')
                    setMobileMenuOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2 mb-2 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-turquoise-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">
                      {getInitials(displayName)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{displayName}</p>
                    <p className="text-xs text-neutral-600 capitalize">
                      {userType === 'employee' && userRole ? userRole.replace('_', ' ') : userType}
                    </p>
                  </div>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

