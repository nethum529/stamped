'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Building2,
  FileCheck,
  AlertCircle,
  Settings,
  LogOut,
} from 'lucide-react'

interface NavigationProps {
  userRole?: 'compliance' | 'relationship' | 'procurement'
  userName?: string
}

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['compliance', 'relationship', 'procurement'],
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
    roles: ['compliance', 'relationship'],
  },
  {
    label: 'Vendors',
    href: '/vendors',
    icon: Building2,
    roles: ['compliance', 'procurement'],
  },
  {
    label: 'Compliance',
    href: '/compliance',
    icon: FileCheck,
    roles: ['compliance'],
  },
  {
    label: 'Adverse Media',
    href: '/adverse-media',
    icon: AlertCircle,
    roles: ['compliance', 'relationship', 'procurement'],
  },
]

export function Navigation({ userRole = 'compliance', userName = 'User' }: NavigationProps) {
  const pathname = usePathname()

  const visibleItems = navigationItems.filter(item =>
    item.roles.includes(userRole)
  )

  return (
    <nav className="flex h-screen w-64 flex-col border-r border-neutral-200/50 bg-white/80 backdrop-blur-xl">
        {/* logo at top */}
        <div className="flex h-16 items-center border-b border-neutral-200/50 px-6">
          <Link href="/dashboard" className="relative h-12 w-auto">
            <Image
              src="/logo.png"
              alt="Stamped"
              width={216}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
        </div>

      {/* nav menu items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm'
                    : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 hover:translate-x-1'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* user info at bottom */}
      <div className="border-t border-neutral-200/50 p-4">
        <div className="mb-3 rounded-lg bg-gradient-to-br from-neutral-50 to-neutral-100/50 p-3 shadow-sm">
          <p className="text-sm font-medium text-neutral-900">{userName}</p>
          <p className="text-xs text-neutral-600 capitalize">{userRole} Officer</p>
        </div>
        
        <div className="space-y-1">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:translate-x-1"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={async () => {
              const { authService } = await import('@/lib/auth/service')
              await authService.signOut()
              window.location.href = '/login'
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 hover:translate-x-1"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

