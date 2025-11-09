import { useToast } from '@/components/ui/toast'

/**
 * Wrapper for async operations with error handling
 * Catches errors and displays them to the user via toast notifications
 */
export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'An error occurred. Please try again.'
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    console.error('Async operation error:', error)
    
    // Extract error message
    const message = error instanceof Error ? error.message : errorMessage
    
    // Show error toast (will be handled by component using useToast)
    // Note: This function doesn't have access to toast context directly
    // Components should use useToast hook and handle errors themselves
    throw new Error(message)
  }
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    )
  }
  return false
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.'
  }
  
  const message = formatErrorMessage(error)
  
  // Map common error messages to user-friendly versions
  const errorMap: Record<string, string> = {
    'Failed to fetch': 'Unable to connect to the server. Please try again.',
    'Network request failed': 'Network error. Please check your connection.',
    'Unauthorized': 'You are not authorized to perform this action.',
    'Forbidden': 'You do not have permission to perform this action.',
    'Not found': 'The requested resource was not found.',
    'Internal server error': 'Server error. Please try again later.',
  }
  
  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  
  return message
}
