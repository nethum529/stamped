'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { User, Bell, Shield, Upload, X, Camera, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth/service'
import { createClient } from '@/lib/supabase/client'
import { requestEmailVerification, verifyCode } from '@/lib/auth/verification'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/components/ui/toast'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'

const NOTIFICATION_PREFS_KEY = 'stamped_notification_preferences'

export default function SettingsPage() {
  const router = useRouter()
  const { user: authUser, loading: authLoading, refreshUser } = useAuth()
  const { showSuccess, showError } = useToast()
  
  // Initialize Supabase client (DashboardShell handles auth, so this should work)
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatarUrl: '',
  })
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  })
  const [verificationStep, setVerificationStep] = useState<'initial' | 'code' | 'success'>('initial')
  const [verificationCode, setVerificationCode] = useState('')
  
  const defaultNotifications = {
    highRiskAlerts: true,
    documentUploads: true,
    approvalRequests: true,
    weeklyReports: false,
  }

  // Load notification preferences from localStorage
  const loadNotificationPreferences = (): typeof defaultNotifications => {
    if (typeof window === 'undefined') {
      return defaultNotifications
    }
    
    try {
      const stored = localStorage.getItem(NOTIFICATION_PREFS_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (err) {
      console.error('Failed to load notification preferences:', err)
    }
    
    return defaultNotifications
  }
  
  const [notifications, setNotifications] = useState(() => loadNotificationPreferences())

  useEffect(() => {
    // Only load user data if authUser is not available
    // If authUser exists, we can use it directly
    if (!authUser && !authLoading) {
      loadUserData()
    } else if (authUser) {
      // If authUser exists, sync it to local user state
      setUser({
        id: authUser.id,
        email: authUser.email,
        user_metadata: {
          full_name: authUser.name,
          display_name: authUser.name,
          avatar_url: authUser.avatarUrl,
        },
      })
      setProfileData({
        name: authUser.name || '',
        email: authUser.email || '',
        avatarUrl: authUser.avatarUrl || '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, authLoading])

  // Save notification preferences to localStorage
  const saveNotificationPreferences = async (prefs: typeof defaultNotifications) => {
    setSavingNotifications(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs))
      }
      // Also save to user metadata if possible
      try {
        await supabase.auth.updateUser({
          data: {
            notification_preferences: prefs,
          },
        })
      } catch (err) {
        // If metadata update fails, that's ok - localStorage is the primary storage
        console.warn('Failed to save notification preferences to user metadata:', err)
      }
      showSuccess('Notification preferences saved')
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setSavingNotifications(false)
    }
  }

  const handleNotificationChange = (key: keyof typeof defaultNotifications, value: boolean) => {
    const updated = {
      ...notifications,
      [key]: value,
    }
    setNotifications(updated)
    // Auto-save when changed
    saveNotificationPreferences(updated)
  }

  const loadUserData = async () => {
    try {
      const currentUser = await authService.getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      setUser(currentUser)
      setProfileData({
        name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.display_name || '',
        email: currentUser.email || '',
        avatarUrl: currentUser.user_metadata?.avatar_url || '',
      })
    } catch (err) {
      console.error('Error loading user:', err)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.name,
          display_name: profileData.name,
        },
      })

      if (updateError) throw updateError

      setSuccess('Profile updated successfully!')
      loadUserData()
      refreshUser() // Refresh auth user to update name everywhere
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if user is loaded
    if (!user && !authUser) {
      const errorMsg = 'Please wait for user data to load'
      setError(errorMsg)
      showError(errorMsg)
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      // Get user ID from either user or authUser
      const userId = user?.id || authUser?.id
      if (!userId) {
        throw new Error('User ID not available')
      }

      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user metadata with avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: urlData.publicUrl,
        },
      })

      if (updateError) throw updateError

      setProfileData(prev => ({ ...prev, avatarUrl: urlData.publicUrl }))
      const successMsg = 'Profile picture updated!'
      setSuccess(successMsg)
      showSuccess(successMsg)
      refreshUser() // Refresh to show avatar everywhere
    } catch (err: any) {
      console.error('Upload error:', err)
      const errorMsg = getUserFriendlyErrorMessage(err)
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveAvatar = async () => {
    setUploadingImage(true)
    setError('')

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          avatar_url: null,
        },
      })

      if (updateError) throw updateError

      setProfileData(prev => ({ ...prev, avatarUrl: '' }))
      const successMsg = 'Profile picture removed'
      setSuccess(successMsg)
      showSuccess(successMsg)
      refreshUser() // Refresh to update everywhere
    } catch (err: any) {
      const errorMsg = getUserFriendlyErrorMessage(err)
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRequestPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      // Request email verification
      const result = await requestEmailVerification(profileData.email, 'password_change')
      
      if (!result.success) {
        setError(result.error || 'Failed to send verification code')
        return
      }

      setVerificationStep('code')
      setSuccess('Verification code sent to your email. Please check your inbox.')
    } catch (err: any) {
      setError(err.message || 'Failed to request verification')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndChangePassword = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Verify the code
      const verification = verifyCode(verificationCode, 'password_change')
      
      if (!verification.verified) {
        setError(verification.error || 'Invalid verification code')
        setLoading(false)
        return
      }

      // Change the password
      const result = await authService.updatePassword(passwordData.newPassword)
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update password')
      }

      setVerificationStep('success')
      const successMsg = 'Password updated successfully!'
      setSuccess(successMsg)
      showSuccess(successMsg)
      setPasswordData({ newPassword: '', confirmPassword: '' })
      setVerificationCode('')
      
      // Reset to initial step after 3 seconds
      setTimeout(() => {
        setVerificationStep('initial')
      }, 3000)
    } catch (err: any) {
      const errorMsg = getUserFriendlyErrorMessage(err)
      setError(errorMsg)
      showError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelPasswordChange = () => {
    setVerificationStep('initial')
    setVerificationCode('')
    setError('')
    setSuccess('')
  }

  const handleSignOut = async () => {
    await authService.signOut()
    router.push('/login')
  }

  // Determine user role for DashboardShell
  const getUserRole = (): 'compliance_officer' | 'relationship_manager' | 'risk_analyst' | 'executive' | undefined => {
    if (authUser?.role) {
      return authUser.role as 'compliance_officer' | 'relationship_manager' | 'risk_analyst' | 'executive'
    }
    // Default to compliance_officer if role is not available
    return 'compliance_officer'
  }

  // Show loading state while user data is being loaded
  if (authLoading || (!authUser && !user)) {
    return (
      <DashboardShell title="Settings" userRole={getUserRole()} userName={undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  // Redirect to login if no user is found after loading
  if (!authUser && !user) {
    router.push('/login')
    return null
  }

  return (
    <DashboardShell title="Settings" userRole={getUserRole()} userName={authUser?.name || profileData.name || undefined}>
      <div className="mx-auto max-w-4xl space-y-6">
        {success && (
          <Alert variant="success" className="mb-6">
            {success}
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2">
                <User className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <CardTitle className="font-sans">Profile</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {profileData.avatarUrl ? (
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-neutral-200">
                    <img
                      src={profileData.avatarUrl}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={handleRemoveAvatar}
                      disabled={uploadingImage}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center border-2 border-neutral-200">
                    <User className="h-12 w-12 text-primary-600" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-neutral-900 mb-2">Profile Picture</h3>
                <div className="flex gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
                      <Camera className="h-4 w-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                    </div>
                  </label>
                  {profileData.avatarUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveAvatar}
                      disabled={uploadingImage}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-xs text-neutral-500">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="John Smith"
              />
              <Input
                label="Email"
                type="email"
                value={profileData.email}
                disabled
                helperText="Contact support to change your email address"
              />
              <div className="flex justify-end">
                <Button type="submit" loading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning-100 p-2">
                <Bell className="h-5 w-5 text-warning-600" />
              </div>
              <div>
                <CardTitle className="font-sans">Notifications</CardTitle>
                <CardDescription>Configure your notification preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'highRiskAlerts', label: 'High risk alerts' },
              { key: 'documentUploads', label: 'Document uploads' },
              { key: 'approvalRequests', label: 'Approval requests' },
              { key: 'weeklyReports', label: 'Weekly reports' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-700">
                  {item.label}
                </span>
                <input
                  type="checkbox"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) =>
                    handleNotificationChange(item.key as keyof typeof defaultNotifications, e.target.checked)
                  }
                  disabled={savingNotifications}
                  className="h-5 w-5 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-error-100 p-2">
                <Shield className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <CardTitle className="font-sans">Security</CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationStep === 'initial' && (
              <form onSubmit={handleRequestPasswordChange} className="space-y-4">
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-4">
                  <div className="flex gap-3">
                    <Mail className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Email Verification Required</p>
                      <p className="text-sm text-blue-800 mt-1">
                        For security, we'll send a verification code to <strong>{profileData.email}</strong> before changing your password.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <Button type="submit" variant="outline" loading={loading}>
                  Request Verification Code
                </Button>
              </form>
            )}

            {verificationStep === 'code' && (
              <div className="space-y-4">
                <Alert variant="success">
                  We've sent a 6-digit verification code to <strong>{profileData.email}</strong>
                </Alert>
                
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Development Mode:</strong> Check your browser console for the verification code.
                    In production, this will be sent to your email.
                  </p>
                </div>

                <Input
                  label="Verification Code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleCancelPasswordChange}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerifyAndChangePassword}
                    loading={loading}
                    disabled={verificationCode.length !== 6}
                    className="flex-1"
                  >
                    Verify & Change Password
                  </Button>
                </div>
                
                <button
                  onClick={handleRequestPasswordChange}
                  disabled={loading}
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Resend verification code
                </button>
              </div>
            )}

            {verificationStep === 'success' && (
              <Alert variant="success">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Password changed successfully!</span>
                </div>
              </Alert>
            )}

            <div className="rounded-lg bg-neutral-50 p-4 border-t border-neutral-200 mt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-neutral-900">Sign Out</p>
                  <p className="mt-1 text-sm text-neutral-600">
                    Sign out of your account on this device
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
