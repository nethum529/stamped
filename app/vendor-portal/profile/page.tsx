'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, User, Mail, Phone, MapPin, Globe, Save } from 'lucide-react'
import { motion } from 'framer-motion'

export default function VendorProfilePage() {
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    // Company Info (Read-only)
    companyName: 'Microsoft Corporation',
    businessRegistrationNumber: 'WA-600413640',
    taxId: '91-1144442',
    industry: 'Technology',
    yearEstablished: '1975',
    
    // Contact Info (Editable)
    contactName: 'Jennifer Martinez',
    email: 'jennifer.martinez@microsoft.com',
    phone: '+1-425-882-8123',
    address: 'One Microsoft Way',
    city: 'Redmond',
    state: 'WA',
    zipCode: '98052',
    country: 'United States',
    website: 'www.microsoft.com',
  })

  const handleSave = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    setEditing(false)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Company Profile
        </h1>
        <p className="text-lg text-neutral-600">
          Providing cloud infrastructure services to Goldman Sachs clients including OpenAI
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company Information (Read-only) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary-600" />
                <CardTitle className="text-2xl">Company Information</CardTitle>
              </div>
              <CardDescription>
                Company details (provided during registration)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-neutral-600 text-sm">Company Name</Label>
                <p className="mt-1 text-neutral-900 font-medium">{profileData.companyName}</p>
              </div>
              <div>
                <Label className="text-neutral-600 text-sm">Business Registration Number</Label>
                <p className="mt-1 text-neutral-900 font-medium">{profileData.businessRegistrationNumber}</p>
              </div>
              <div>
                <Label className="text-neutral-600 text-sm">Tax ID / EIN</Label>
                <p className="mt-1 text-neutral-900 font-medium">{profileData.taxId}</p>
              </div>
              <div>
                <Label className="text-neutral-600 text-sm">Industry</Label>
                <p className="mt-1 text-neutral-900 font-medium">{profileData.industry}</p>
              </div>
              <div>
                <Label className="text-neutral-600 text-sm">Year Established</Label>
                <p className="mt-1 text-neutral-900 font-medium">{profileData.yearEstablished}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Information (Editable) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary-600" />
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                </div>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    Edit
                  </Button>
                )}
              </div>
              <CardDescription>
                Primary contact details (editable)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactName">Contact Name</Label>
                <Input
                  id="contactName"
                  value={profileData.contactName}
                  onChange={(e) => setProfileData({ ...profileData, contactName: e.target.value })}
                  disabled={!editing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    disabled={!editing}
                    className="pl-10"
                  />
                </div>
              </div>

              {editing && (
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} disabled={loading} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <CardTitle className="text-2xl">Business Address</CardTitle>
              </div>
              <CardDescription>
                Primary business location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={profileData.state}
                    onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    value={profileData.zipCode}
                    onChange={(e) => setProfileData({ ...profileData, zipCode: e.target.value })}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                    disabled={!editing}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

