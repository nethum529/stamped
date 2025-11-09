'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { NotificationCenter } from '@/components/notifications/notification-center'

interface HeaderProps {
  title?: string
  notificationCount?: number
}

export function Header({ title, notificationCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-8">
      <div>
        {title && (
          <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* search button */}
        <button className="flex h-10 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm text-neutral-500 transition-colors hover:border-neutral-400">
          <Search className="h-4 w-4" />
          <span>Search...</span>
          <kbd className="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>

        {/* notifications */}
        <NotificationCenter />
      </div>
    </header>
  )
}

