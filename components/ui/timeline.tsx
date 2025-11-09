import * as React from 'react'
import { cn } from '@/lib/utils'

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string | Date
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
}

interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

const variantClasses = {
  default: 'bg-primary-600',
  success: 'bg-success-600',
  warning: 'bg-warning-600',
  error: 'bg-error-600',
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        const variant = item.variant || 'default'

        return (
          <div key={item.id} className="relative flex gap-4">
            {/* vertical line between items */}
            {!isLast && (
              <div className="absolute left-4 top-10 h-full w-0.5 bg-neutral-200" />
            )}

            {/* icon circle */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  variantClasses[variant]
                )}
              >
                {item.icon || (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </div>

            {/* timeline content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-sans font-medium text-neutral-900">{item.title}</h4>
                  {item.description && (
                    <p className="mt-1 text-sm text-neutral-600">
                      {item.description}
                    </p>
                  )}
                </div>
                <time className="flex-shrink-0 text-sm text-neutral-500">
                  {typeof item.timestamp === 'string'
                    ? item.timestamp
                    : item.timestamp.toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

