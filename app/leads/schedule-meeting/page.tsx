'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Lead, MeetingType } from '@/lib/types/lead'
import { Client } from '@/lib/types/client'
import { Vendor } from '@/lib/types/vendor'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, Calendar as CalendarIcon, Loader2, CheckCircle, AlertCircle, Clock, Video, Phone, Users } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

type EntityType = 'lead' | 'client' | 'vendor'

export default function ScheduleMeetingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    entityType: 'lead' as EntityType,
    entityId: '',
    meetingType: 'video' as MeetingType,
    meetingDate: '',
    meetingTime: '',
    duration: '30',
    title: '',
    notes: '',
    attendees: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const [fetchedLeads, fetchedClients, fetchedVendors] = await Promise.all([
          mockDataService.getLeads(),
          mockDataService.getClients(),
          mockDataService.getVendors ? mockDataService.getVendors() : Promise.resolve([]),
        ])
        // Only show active leads
        setLeads(fetchedLeads.filter(lead => lead.status === 'active'))
        // Show active clients
        setClients(fetchedClients.filter(client => client.status === 'active'))
        // Show active vendors
        setVendors(fetchedVendors.filter(vendor => vendor.status === 'active' || vendor.status === 'approved'))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.entityId) {
      newErrors.entityId = `Please select a ${formData.entityType}`
    }
    if (!formData.meetingDate) {
      newErrors.meetingDate = 'Meeting date is required'
    }
    if (!formData.meetingTime) {
      newErrors.meetingTime = 'Meeting time is required'
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Meeting title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  // Reset entityId when entityType changes
  const handleEntityTypeChange = (entityType: EntityType) => {
    setFormData(prev => ({ ...prev, entityType, entityId: '' }))
    // Clear entityId error when type changes
    if (errors.entityId) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.entityId
        return newErrors
      })
    }
  }
  
  // Get entity name for display
  const getEntityName = (): string => {
    if (!formData.entityId) return ''
    
    switch (formData.entityType) {
      case 'lead':
        const lead = leads.find(l => l.id === formData.entityId)
        return lead ? `${lead.companyName} - ${lead.contactName}` : ''
      case 'client':
        const client = clients.find(c => c.id === formData.entityId)
        return client ? client.companyName : ''
      case 'vendor':
        const vendor = vendors.find(v => v.id === formData.entityId)
        return vendor ? vendor.companyName : ''
      default:
        return ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.')
      return
    }

    setSubmitting(true)

    try {
      const entityName = getEntityName()
      if (!entityName) {
        throw new Error(`${formData.entityType} not found`)
      }

      // Parse attendees email addresses
      const attendees = formData.attendees
        ? formData.attendees.split(',').map(email => email.trim()).filter(Boolean)
        : []

      // Create the meeting based on entity type
      const meetingData: {
        entityType: 'lead' | 'client' | 'vendor'
        entityName: string
        leadId?: string
        clientId?: string
        vendorId?: string
        title: string
        type: MeetingType
        date: string
        time: string
        duration: number
        attendees: string[]
        notes: string
        createdBy: string
        createdByName: string
      } = {
        entityType: formData.entityType,
        entityName,
        title: formData.title,
        type: formData.meetingType,
        date: formData.meetingDate,
        time: formData.meetingTime,
        duration: parseInt(formData.duration),
        attendees,
        notes: formData.notes,
        createdBy: user?.id || 'unknown',
        createdByName: user?.name || 'User',
      }

      // Set the appropriate ID based on entity type
      if (formData.entityType === 'lead') {
        meetingData.leadId = formData.entityId
        // Update lead to add activity and move to meeting_scheduled stage if not already there
        const selectedLead = leads.find(l => l.id === formData.entityId)
        if (selectedLead) {
          if (selectedLead.pipelineStage !== 'meeting_scheduled') {
            await mockDataService.updateLead(formData.entityId, {
              pipelineStage: 'meeting_scheduled',
              activities: [
                ...selectedLead.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'meeting',
                  description: `Meeting scheduled: ${formData.title} on ${formData.meetingDate} at ${formData.meetingTime}`,
                  timestamp: new Date().toISOString(),
                  performedBy: user?.name || 'User',
                },
              ],
            })
          } else {
            // Just add activity if already in meeting_scheduled stage
            await mockDataService.updateLead(formData.entityId, {
              activities: [
                ...selectedLead.activities,
                {
                  id: `activity-${Date.now()}`,
                  type: 'meeting',
                  description: `Meeting scheduled: ${formData.title} on ${formData.meetingDate} at ${formData.meetingTime}`,
                  timestamp: new Date().toISOString(),
                  performedBy: user?.name || 'User',
                },
              ],
            })
          }
        }
      } else if (formData.entityType === 'client') {
        meetingData.clientId = formData.entityId
      } else if (formData.entityType === 'vendor') {
        meetingData.vendorId = formData.entityId
      }

      // Create the meeting
      const newMeeting = await mockDataService.createMeeting(meetingData)

      console.log('Meeting scheduled successfully:', newMeeting)
      setSuccess(true)

      // Wait a moment to show success message, then navigate based on entity type
      setTimeout(() => {
        if (formData.entityType === 'lead') {
          router.push('/leads')
        } else if (formData.entityType === 'client') {
          router.push('/clients')
        } else {
          router.push('/vendors')
        }
      }, 1500)
    } catch (err) {
      console.error('Failed to schedule meeting:', err)
      setError('Failed to schedule meeting. Please try again.')
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const getMeetingTypeIcon = (type: MeetingType) => {
    switch (type) {
      case 'call':
        return <Phone className="h-5 w-5" />
      case 'video':
        return <Video className="h-5 w-5" />
      case 'in_person':
        return <Users className="h-5 w-5" />
    }
  }

  if (loading) {
    return (
      <DashboardShell title="Schedule Meeting" userRole="relationship_manager" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Schedule Meeting" userRole="relationship_manager" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/leads"
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Leads</span>
        </Link>
      </div>

      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Schedule Meeting</h1>
        <p className="mt-2 text-neutral-600">Schedule a meeting with a lead, client, or vendor</p>
      </div>

      {error && (
        <Alert variant="error">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="success">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>Meeting scheduled successfully. Redirecting...</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Entity Type Selection */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">
                Meeting With <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.entityType}
                onValueChange={(value) => handleEntityTypeChange(value as EntityType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entity Selection */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">
                Select {formData.entityType.charAt(0).toUpperCase() + formData.entityType.slice(1)} <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.entityId}
                onValueChange={(value) => handleInputChange('entityId', value)}
              >
                <SelectTrigger className={errors.entityId ? 'border-red-500' : ''}>
                  <SelectValue placeholder={`Choose a ${formData.entityType}...`} />
                </SelectTrigger>
                <SelectContent>
                  {formData.entityType === 'lead' && leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.companyName} - {lead.contactName}
                    </SelectItem>
                  ))}
                  {formData.entityType === 'client' && clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                  {formData.entityType === 'vendor' && vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.entityId && (
                <p className="text-xs text-red-500 mt-1">{errors.entityId}</p>
              )}
            </div>

            {/* Meeting Type */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">
                Meeting Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('meetingType', 'call')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    formData.meetingType === 'call'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Phone className="h-6 w-6" />
                  <span className="text-sm font-medium">Phone Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('meetingType', 'video')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    formData.meetingType === 'video'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Video className="h-6 w-6" />
                  <span className="text-sm font-medium">Video Call</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('meetingType', 'in_person')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                    formData.meetingType === 'in_person'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-medium">In Person</span>
                </button>
              </div>
            </div>

            {/* Meeting Title */}
            <Input
              label="Meeting Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={errors.title}
              required
              placeholder="e.g. Product Demo, Initial Discovery Call"
            />

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <Input
                  label="Meeting Date"
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => handleInputChange('meetingDate', e.target.value)}
                  error={errors.meetingDate}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="md:col-span-1">
                <Input
                  label="Meeting Time"
                  type="time"
                  value={formData.meetingTime}
                  onChange={(e) => handleInputChange('meetingTime', e.target.value)}
                  error={errors.meetingTime}
                  required
                />
              </div>
              <div className="md:col-span-1">
                <label className="text-sm font-medium text-neutral-900 block mb-1">
                  Duration
                </label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => handleInputChange('duration', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Attendees */}
            <Input
              label="Additional Attendees (Optional)"
              value={formData.attendees}
              onChange={(e) => handleInputChange('attendees', e.target.value)}
              placeholder="Enter email addresses separated by commas"
            />

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">Meeting Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add agenda items, discussion topics, or other notes..."
                rows={4}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/leads')}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Schedule Meeting
              </>
            )}
          </Button>
        </div>
      </form>
      </div>
    </DashboardShell>
  )
}

