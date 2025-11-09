import { AuthError } from './types'

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateEmail(email: string): string | null {
  if (!email || email.trim() === '') {
    return 'Email is required'
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address'
  }

  // Additional checks for common typos
  const domain = email.split('@')[1]
  if (domain) {
    // Check for spaces
    if (domain.includes(' ')) {
      return 'Email cannot contain spaces'
    }
    
    // Check for valid TLD (at least 2 characters)
    const tld = domain.split('.').pop()
    if (!tld || tld.length < 2) {
      return 'Please enter a valid email domain'
    }
  }

  // Check for maximum length (RFC 5321)
  if (email.length > 254) {
    return 'Email address is too long'
  }

  return null
}

export function validatePassword(password: string): string | null {
  if (!password || password.trim() === '') {
    return 'Password is required'
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters'
  }

  if (password.length > 128) {
    return 'Password is too long (maximum 128 characters)'
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter'
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter'
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number'
  }

  // Check for common weak passwords
  const weakPasswords = [
    'password',
    '12345678',
    'password123',
    'qwerty123',
    'abc123456',
  ]
  if (weakPasswords.some(weak => password.toLowerCase().includes(weak))) {
    return 'This password is too common. Please choose a stronger password'
  }

  return null
}

export function validateName(name: string): string | null {
  if (!name || name.trim() === '') {
    return 'Name is required'
  }

  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters'
  }

  if (name.length > 100) {
    return 'Name is too long (maximum 100 characters)'
  }

  // Check for invalid characters (only letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes'
  }

  return null
}

export function validatePasswordMatch(password: string, confirmPassword: string): string | null {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return 'Please confirm your password'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }

  return null
}

export function validateSignUpForm(
  email: string,
  password: string,
  confirmPassword: string,
  name: string
): ValidationResult {
  const errors: Record<string, string> = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError

  const confirmPasswordError = validatePasswordMatch(password, confirmPassword)
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

  const nameError = validateName(name)
  if (nameError) errors.name = nameError

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateSignInForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  // For sign in, just check if password exists (don't validate complexity)
  if (!password || password.trim() === '') {
    errors.password = 'Password is required'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

