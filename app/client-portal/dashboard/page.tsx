'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  AlertCircle, 
  Mail, 
  Phone,
  ArrowRight,
  Upload
} from 'lucide-react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Document } from '@/lib/types/document'
import { Message } from '@/lib/types/message'
import { getDocumentStatusColor, getDocumentTypeDisplayName } from '@/lib/types/document'
import { formatMessageTime } from '@/lib/types/message'

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  
  // Mock client data
  const clientId = 'client-001'
  const clientName = 'Acme Corporation'
  const onboardingStage = 'kyc_review'
  const assignedOfficer = {
    name: 'Emily Rodriguez',
    title: 'Compliance Officer',
    email: 'emily.rodriguez@stamped.com',
    phone: '+1 (555) 123-4567',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, messages] = await Promise.all([
          mockDataService.getDocumentsByClientId(clientId),
          mockDataService.getMessagesByConversationId('conv-001')
        ])
        
        setDocuments(docs)
        setRecentMessages(messages.slice(-3).reverse())
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const requiredDocTypes = [
    'passport',
    'business_license',
    'kyc_form',
    'proof_of_address',
    'financial_statement',
    'incorporation_certificate',
  ]

  const uploadedDocs = documents.filter(d => 
    d.status === 'approved' || d.status === 'under_review' || d.status === 'uploaded'
  )
  
  const completionPercentage = Math.round((uploadedDocs.length / requiredDocTypes.length) * 100)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-sans font-bold text-neutral-900">
          Welcome back
        </h1>
        <p className="text-neutral-600">
          Track your onboarding progress and manage your documents
        </p>
      </div>

      {/* Onboarding Progress */}
      <Card className="border-primary-200 bg-gradient-to-br from-primary-50/50 to-white">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-sans font-semibold text-neutral-900">
                  Onboarding Progress
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  {uploadedDocs.length} of {requiredDocTypes.length} required documents submitted
                </p>
              </div>
              <Badge variant="default" className="bg-primary-600">
                {completionPercentage}% Complete
              </Badge>
            </div>
            
            <Progress value={completionPercentage} className="h-3" />

            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="h-4 w-4" />
              <span>Current Stage: <span className="font-medium text-neutral-900">KYC Review</span></span>
            </div>

            {completionPercentage < 100 && (
              <Link href="/client-portal/documents">
                <Button size="sm" className="w-full sm:w-auto">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Missing Documents
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requiredDocTypes.slice(0, 5).map((docType) => {
                const doc = documents.find(d => d.type === docType)
                const status = doc?.status || 'pending_upload'
                const statusColor = doc ? getDocumentStatusColor(status) : 'default'

                return (
                  <div
                    key={docType}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-3">
                      {doc && doc.status === 'approved' ? (
                        <CheckCircle className="h-5 w-5 text-success-600" />
                      ) : doc && doc.status === 'under_review' ? (
                        <Clock className="h-5 w-5 text-warning-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-neutral-400" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          {getDocumentTypeDisplayName(docType as any)}
                        </p>
                        {doc && (
                          <p className="text-xs text-neutral-600">
                            {doc.fileName}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={statusColor}>
                      {status === 'pending_upload' ? 'Required' : 
                       status === 'approved' ? 'Approved' :
                       status === 'under_review' ? 'Reviewing' :
                       status === 'uploaded' ? 'Uploaded' :
                       'Pending'}
                    </Badge>
                  </div>
                )
              })}

              <Link href="/client-portal/documents">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Documents
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Officer */}
        <Card>
          <CardHeader>
            <CardTitle>Your Compliance Officer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold">
                  {assignedOfficer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{assignedOfficer.name}</p>
                  <p className="text-sm text-neutral-600">{assignedOfficer.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`mailto:${assignedOfficer.email}`}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-sm transition-colors hover:bg-neutral-50"
                >
                  <Mail className="h-4 w-4 text-neutral-600" />
                  <span className="text-neutral-700">{assignedOfficer.email}</span>
                </a>

                <a
                  href={`tel:${assignedOfficer.phone}`}
                  className="flex items-center gap-3 rounded-lg border border-neutral-200 p-3 text-sm transition-colors hover:bg-neutral-50"
                >
                  <Phone className="h-4 w-4 text-neutral-600" />
                  <span className="text-neutral-700">{assignedOfficer.phone}</span>
                </a>
              </div>

              <Link href="/client-portal/messages">
                <Button variant="outline" size="sm" className="w-full">
                  Send Message
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4 transition-colors hover:bg-neutral-50"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    {message.senderType === 'client' ? (
                      <span className="text-xs font-semibold text-neutral-700">You</span>
                    ) : (
                      <span className="text-xs font-semibold text-primary-700">
                        {message.senderName.split(' ').map(n => n[0]).join('')}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-neutral-900">
                        {message.senderName}
                      </p>
                      <span className="text-xs text-neutral-500 whitespace-nowrap">
                        {formatMessageTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              <Link href="/client-portal/messages">
                <Button variant="outline" size="sm" className="w-full">
                  View All Messages
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-600">
              <p>No recent activity</p>
              <Link href="/client-portal/messages">
                <Button variant="outline" size="sm" className="mt-4">
                  Start a Conversation
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

