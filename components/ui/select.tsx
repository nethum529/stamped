'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

// Context for compound Select usage
interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerId: string
}

const SelectContext = React.createContext<SelectContextType | null>(null)

// Simple Select Props (backward compatible)
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'onValueChange'> {
  label?: string
  error?: string
  helperText?: string
  options?: { value: string; label: string }[]
  // Compound component props
  value?: string
  onValueChange?: (value: string) => void
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children?: React.ReactNode
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, value, onValueChange, children, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || '')
    const [open, setOpen] = React.useState(false)
    const triggerId = React.useId()
    
    // Determine if using compound pattern (has children) or simple pattern (has options)
    const isCompound = children !== undefined
    
    // Use controlled value if provided, otherwise use internal state
    const currentValue = value !== undefined ? value : internalValue
    
    const handleValueChange = React.useCallback((newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      setOpen(false)
    }, [value, onValueChange])
    
    // Compound component pattern
    if (isCompound) {
      const contextValue: SelectContextType = {
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        triggerId,
      }
      
      return (
        <SelectContext.Provider value={contextValue}>
          <div className={cn('w-full', className)}>
            {label && (
              <label
                htmlFor={triggerId}
                className="mb-1.5 block text-sm font-medium text-neutral-700"
              >
                {label}
                {props.required && <span className="ml-1 text-error-500">*</span>}
              </label>
            )}
            <div className="relative">
              {children}
            </div>
            {error && (
              <p className="mt-1.5 text-sm text-error-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
            )}
          </div>
        </SelectContext.Provider>
      )
    }
    
    // Simple pattern (backward compatible)
    const id = props.id || props.name
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value
      if (value === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
      onChange?.(e)
    }
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-neutral-700"
          >
            {label}
            {props.required && <span className="ml-1 text-error-500">*</span>}
          </label>
        )}
        <select
          className={cn(
            'flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
            className
          )}
          ref={ref}
          id={id}
          value={currentValue}
          onChange={handleChange}
          {...props}
        >
          <option value="">Select...</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-error-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

// SelectTrigger component
export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) {
      throw new Error('SelectTrigger must be used within a Select component')
    }
    
    const { open, setOpen, triggerId } = context
    
    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm transition-colors',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'border-primary-500 ring-2 ring-primary-500',
          className
        )}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        {...props}
      >
        {children}
        <ChevronDown className={cn('h-4 w-4 text-neutral-500 transition-transform', open && 'rotate-180')} />
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

// SelectValue component
export interface SelectValueProps {
  placeholder?: string
  children?: React.ReactNode
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, children }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) {
      throw new Error('SelectValue must be used within a Select component')
    }
    
    const { value } = context
    const itemsContext = React.useContext(SelectItemsContext)
    
    // Find the label for the current value
    const selectedItem = itemsContext?.items.find((item: { value: string; label: string }) => item.value === value)
    const displayValue = selectedItem?.label || children || placeholder || 'Select...'
    
    return (
      <span ref={ref} className="truncate">
        {displayValue}
      </span>
    )
  }
)
SelectValue.displayName = 'SelectValue'

// Context for SelectItems
interface SelectItemsContextType {
  items: Array<{ value: string; label: string }>
  registerItem: (value: string, label: string) => void
}

const SelectItemsContext = React.createContext<SelectItemsContextType | null>(null)

// SelectContent component
export interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className }, ref) => {
    const context = React.useContext(SelectContext)
    if (!context) {
      throw new Error('SelectContent must be used within a Select component')
    }
    
    const { open, setOpen, triggerId } = context
    const [items, setItems] = React.useState<Array<{ value: string; label: string }>>([])
    const contentRef = React.useRef<HTMLDivElement>(null)
    const combinedRef = (ref || contentRef) as React.RefObject<HTMLDivElement>
    
    const registerItem = React.useCallback((value: string, label: string) => {
      setItems(prev => {
        const existing = prev.find(item => item.value === value)
        if (existing) return prev
        return [...prev, { value, label }]
      })
    }, [])
    
    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        const trigger = document.getElementById(triggerId)
        const content = combinedRef.current
        
        if (trigger && trigger.contains(target)) return
        if (content && content.contains(target)) return
        
        setOpen(false)
      }
      
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open, setOpen, triggerId, combinedRef])
    
    if (!open) return null
    
    return (
      <SelectItemsContext.Provider value={{ items, registerItem }}>
        <div
          ref={combinedRef}
          className={cn(
            'absolute z-50 mt-1 w-full rounded-lg border border-neutral-200 bg-white shadow-lg',
            'max-h-60 overflow-auto',
            className
          )}
          role="listbox"
        >
          {children}
        </div>
      </SelectItemsContext.Provider>
    )
  }
)
SelectContent.displayName = 'SelectContent'

// SelectItem component
export interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, children, className, disabled, ...props }, ref) => {
    const selectContext = React.useContext(SelectContext)
    const itemsContext = React.useContext(SelectItemsContext)
    
    if (!selectContext || !itemsContext) {
      throw new Error('SelectItem must be used within a SelectContent component')
    }
    
    const { value: selectedValue, onValueChange } = selectContext
    const { registerItem } = itemsContext
    
    // Register this item
    React.useEffect(() => {
      const label = typeof children === 'string' ? children : String(children)
      registerItem(value, label)
    }, [value, children, registerItem])
    
    const isSelected = selectedValue === value
    
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        className={cn(
          'cursor-pointer px-3 py-2 text-sm transition-colors',
          'hover:bg-neutral-100 focus:bg-neutral-100 focus:outline-none',
          isSelected && 'bg-primary-50 text-primary-900',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        onClick={() => !disabled && onValueChange(value)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
SelectItem.displayName = 'SelectItem'

export { Select }
