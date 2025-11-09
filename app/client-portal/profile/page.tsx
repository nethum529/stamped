'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building, Mail, Phone, Globe, MapPin, Lock, CheckCircle } from 'lucide-react'

export default function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  // Mock client data
  const [clientData, setClientData] = useState({
    companyName: 'Acme Corporation',
    industry: 'Financial Services',
    country: 'United States',
    city: 'New York',
    address: '123 Wall Street',
    website: 'https://acme-corp.com',
    registrationNumber: 'US-12345678',
  })

  const [contactData, setContactData] = useState({
    name: 'John Doe',
    title: 'Chief Compliance Officer',
    email: 'john.doe@acme-corp.com',
    phone: '+1 (555) 123-4567',
  })

  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const handleSaveContact = () => {
    // In real app, would call API
    setSaved(true)
    setIsEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleChangePassword = () => {
    // In real app, would call API and validate
    setPasswordChanged(true)
    setChangingPassword(false)
    setPasswordData({ current: '', new: '', confirm: '' })
    setTimeout(() => setPasswordChanged(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-sans font-bold text-neutral-900">
          Profile
        </h1>
        <p className="text-neutral-600">
          Manage your company and contact information
        </p>
      </div>

      {saved && (
        <div className="rounded-lg border border-success-200 bg-success-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <p className="text-sm font-medium text-success-900">
              Contact information updated successfully
            </p>
          </div>
        </div>
      )}

      {passwordChanged && (
        <div className="rounded-lg border border-success-200 bg-success-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <p className="text-sm font-medium text-success-900">
              Password changed successfully
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary-600" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs text-neutral-600">Company Name</Label>
              <p className="text-sm font-medium text-neutral-900 mt-1">
                {clientData.companyName}
              </p>
            </div>

            <div>
              <Label className="text-xs text-neutral-600">Industry</Label>
              <p className="text-sm font-medium text-neutral-900 mt-1">
                {clientData.industry}
              </p>
            </div>

            <div>
              <Label className="text-xs text-neutral-600">Registration Number</Label>
              <p className="text-sm font-medium text-neutral-900 mt-1">
                {clientData.registrationNumber}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-neutral-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  {clientData.address}
                </p>
                <p className="text-sm text-neutral-600">
                  {clientData.city}, {clientData.country}
                </p>
              </div>
            </div>

            {clientData.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-neutral-600" />
                <a
                  href={clientData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  {clientData.website}
                </a>
              </div>
            )}

            <div className="pt-2">
              <p className="text-xs text-neutral-500">
                Company information is read-only. Contact your compliance officer to request changes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Contact Information</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveContact}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Title</Label>
                  <Input
                    value={contactData.title}
                    onChange={(e) => setContactData({ ...contactData, title: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-xs text-neutral-600">Full Name</Label>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {contactData.name}
                  </p>
                </div>

                <div>
                  <Label className="text-xs text-neutral-600">Title</Label>
                  <p className="text-sm font-medium text-neutral-900 mt-1">
                    {contactData.title}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neutral-600" />
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {contactData.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-neutral-600" />
                  <a
                    href={`tel:${contactData.phone}`}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    {contactData.phone}
                  </a>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary-600" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!changingPassword ? (
            <div>
              <p className="text-sm text-neutral-600 mb-4">
                Keep your account secure by using a strong password
              </p>
              <Button
                variant="outline"
                onClick={() => setChangingPassword(true)}
              >
                Change Password
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-md">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setChangingPassword(false)
                    setPasswordData({ current: '', new: '', confirm: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleChangePassword}
                  disabled={!passwordData.current || !passwordData.new || passwordData.new !== passwordData.confirm}
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

