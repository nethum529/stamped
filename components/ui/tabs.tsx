'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  defaultValue?: string
  value?: string
  children: React.ReactNode
  className?: string
  onValueChange?: (value: string) => void
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
}>({
  value: '',
  onValueChange: () => {},
})

export function Tabs({ defaultValue, value: valueProp, children, className, onValueChange }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '')
  
  // Use controlled value if provided, otherwise use internal state
  const value = valueProp !== undefined ? valueProp : internalValue

  const handleValueChange = (newValue: string) => {
    if (valueProp === undefined) {
      setInternalValue(newValue)
    }
    onValueChange?.(newValue)
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-12 items-center justify-center rounded-xl bg-neutral-100 p-1',
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = React.useContext(TabsContext)
  const isSelected = selectedValue === value

  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2 text-sm font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        isSelected
          ? 'bg-white text-neutral-900 shadow-sm'
          : 'text-neutral-600 hover:text-neutral-900',
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: selectedValue } = React.useContext(TabsContext)

  if (selectedValue !== value) return null

  return (
    <div className={cn('mt-6 animate-fade-in', className)}>
      {children}
    </div>
  )
}

