'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Industry, PipelineStage } from '@/lib/types/lead'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, Save, X, AlertCircle, CheckCircle } from 'lucide-react'
import { aiLeadScoringService } from '@/lib/services/ai-lead-scoring'
import { mockDataService } from '@/lib/services/mock-data-service'

interface LeadFormData {
  companyName: string
  industry: Industry | ''
  country: string
  contactEmail: string
  contactPhone: string
  contactName: string
  pipelineStage: PipelineStage | ''
  estimatedRevenue: string
  expectedCloseDate: string
  companySize: string
  website: string
  linkedin: string
  notes: string
}

const industries: Industry[] = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Energy',
  'Real Estate',
  'Telecommunications',
  'Consulting',
  'Other',
]

const stages: PipelineStage[] = [
  'prospecting',
  'contact_made',
  'meeting_scheduled',
  'proposal_sent',
  'negotiating',
  'onboarding',
]

const companySizes = [
  '1-50',
  '50-100',
  '100-250',
  '250-500',
  '500-1000',
  '1000+',
]

interface LeadFormProps {
  onCancel: () => void
}

export default function LeadForm({ onCancel }: LeadFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState<LeadFormData>({
    companyName: '',
    industry: '',
    country: '',
    contactEmail: '',
    contactPhone: '',
    contactName: '',
    pipelineStage: 'prospecting',
    estimatedRevenue: '',
    expectedCloseDate: '',
    companySize: '',
    website: '',
    linkedin: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required'
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required'
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required'
    }
    if (!formData.pipelineStage) {
      newErrors.pipelineStage = 'Pipeline stage is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.')
      return
    }

    setLoading(true)

    try {
      // Calculate AI score (use sync version for new leads without ID)
      const aiScoreBreakdown = aiLeadScoringService.calculateLeadScoreSync({
        companyName: formData.companyName,
        industry: formData.industry as Industry,
        country: formData.country,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactName: formData.contactName,
        companySize: formData.companySize || undefined,
        website: formData.website || undefined,
        linkedin: formData.linkedin || undefined,
      })

      // Create the lead using the mock data service
      const newLead = await mockDataService.createLead({
        companyName: formData.companyName,
        industry: formData.industry as Industry,
        country: formData.country,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactName: formData.contactName,
        pipelineStage: formData.pipelineStage as PipelineStage,
        estimatedRevenue: formData.estimatedRevenue ? parseFloat(formData.estimatedRevenue) : undefined,
        expectedCloseDate: formData.expectedCloseDate || undefined,
        companySize: formData.companySize || undefined,
        website: formData.website || undefined,
        linkedin: formData.linkedin || undefined,
        notes: formData.notes || undefined,
        aiScore: aiScoreBreakdown.overall,
        aiScoreBreakdown: aiScoreBreakdown,
      })

      console.log('Lead created successfully:', newLead)
      setSuccess(true)

      // Wait a moment to show success message, then navigate
      setTimeout(() => {
        router.push('/leads')
      }, 1000)
    } catch (err) {
      console.error('Failed to create lead:', err)
      setError('Failed to create lead. Please try again.')
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          <AlertDescription>Lead created successfully. Redirecting...</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            error={errors.companyName}
            required
            placeholder="e.g. Acme Corporation"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">
                Industry <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.industry}
                onValueChange={(value) => handleInputChange('industry', value as Industry)}
              >
                <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-xs text-red-500 mt-1">{errors.industry}</p>
              )}
            </div>

            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              error={errors.country}
              required
              placeholder="e.g. United States"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-900">Company Size</label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => handleInputChange('companySize', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} employees
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="e.g. https://acmecorp.com"
            />
          </div>

          <Input
            label="LinkedIn Profile"
            value={formData.linkedin}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
            placeholder="e.g. https://linkedin.com/company/acme"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Contact Name"
            value={formData.contactName}
            onChange={(e) => handleInputChange('contactName', e.target.value)}
            error={errors.contactName}
            required
            placeholder="e.g. John Smith"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              error={errors.contactEmail}
              required
              placeholder="e.g. john.smith@acmecorp.com"
            />

            <Input
              label="Contact Phone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
              placeholder="e.g. +1-555-123-4567"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-900">
              Pipeline Stage <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.pipelineStage}
              onValueChange={(value) => handleInputChange('pipelineStage', value as PipelineStage)}
            >
              <SelectTrigger className={errors.pipelineStage ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select pipeline stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pipelineStage && (
              <p className="text-xs text-red-500 mt-1">{errors.pipelineStage}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Estimated Revenue (USD)"
              type="number"
              value={formData.estimatedRevenue}
              onChange={(e) => handleInputChange('estimatedRevenue', e.target.value)}
              placeholder="e.g. 150000"
            />

            <Input
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => handleInputChange('expectedCloseDate', e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-neutral-900">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any additional notes about this lead..."
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
          onClick={onCancel}
          disabled={loading}
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Lead...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Lead
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

