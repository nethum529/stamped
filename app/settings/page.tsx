'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { User, Bell, Shield, Upload, X, Camera } from 'lucide-react'
import { authService } from '@/lib/auth/service'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
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
  const [notifications, setNotifications] = useState({
    highRiskAlerts: true,
    documentUploads: true,
    approvalRequests: true,
    weeklyReports: false,
  })

  useEffect(() => {
    loadUserData()
  }, [])

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
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      // Create a unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
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
      setSuccess('Profile picture updated!')
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
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
      setSuccess('Profile picture removed')
    } catch (err: any) {
      setError(err.message || 'Failed to remove image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const result = await authService.updatePassword(passwordData.newPassword)
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update password')
      }

      setSuccess('Password updated successfully!')
      setPasswordData({ newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await authService.signOut()
    router.push('/login')
  }

  return (
    <DashboardShell title="Settings" userRole="compliance" userName={profileData.name || 'User'}>
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
                    setNotifications({
                      ...notifications,
                      [item.key]: e.target.checked,
                    })
                  }
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
            <form onSubmit={handlePasswordChange} className="space-y-4">
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
                Change Password
              </Button>
            </form>

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
