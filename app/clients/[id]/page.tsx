'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timeline } from '@/components/ui/timeline'
import { Modal } from '@/components/ui/modal'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Client } from '@/lib/types/client'
import { useToast } from '@/components/ui/toast'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'

export default function ClientDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [comment, setComment] = useState('')
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)
  const [viewingDocument, setViewingDocument] = useState<string | null>(null)
  const [downloadingDocument, setDownloadingDocument] = useState<string | null>(null)

  const fetchClient = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedClient = await mockDataService.getClientById(params.id as string)
      if (!fetchedClient) {
        setError('Client not found')
      } else {
        setClient(fetchedClient)
      }
    } catch (err) {
      console.error('Failed to fetch client:', err)
      setError('Failed to load client details. Please try again.')
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchClient()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleApprove = async () => {
    if (!client) return

    setApproving(true)
    try {
      const updatedClient = await mockDataService.updateClientStatus(client.id, 'approved', comment)
      if (updatedClient) {
        setClient(updatedClient)
        showSuccess('Client approved successfully')
        setShowApproveModal(false)
        setComment('')
        // Refresh the page data
        await fetchClient()
      } else {
        throw new Error('Failed to update client status')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    if (!client) return
    if (!comment.trim()) {
      showError('Please provide a reason for rejection')
      return
    }

    setRejecting(true)
    try {
      const updatedClient = await mockDataService.updateClientStatus(client.id, 'rejected', comment)
      if (updatedClient) {
        setClient(updatedClient)
        showSuccess('Client rejected successfully')
        setShowRejectModal(false)
        setComment('')
        // Refresh the page data
        await fetchClient()
      } else {
        throw new Error('Failed to update client status')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setRejecting(false)
    }
  }

  const handleViewDocument = (documentId: string) => {
    setViewingDocument(documentId)
    // In a real app, this would open a document viewer
    // For now, we'll open the document URL in a new window
    const doc = client?.documents?.find(d => d.id === documentId)
    if (doc?.url) {
      window.open(doc.url, '_blank')
      showSuccess('Opening document in new window')
    } else {
      showError('Document URL not available')
    }
    setTimeout(() => setViewingDocument(null), 1000)
  }

  const handleDownloadDocument = async (documentId: string) => {
    setDownloadingDocument(documentId)
    try {
      const doc = client?.documents?.find(d => d.id === documentId)
      if (!doc) {
        showError('Document not found')
        return
      }

      // In a real app, this would trigger a download from the server
      // For now, we'll simulate the download
      if (doc.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a')
        link.href = doc.url || '#'
        link.download = doc.fileName || doc.name || 'document.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        showSuccess(`Downloading ${doc.fileName || doc.name}...`)
      } else {
        showError('Document download URL not available')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setDownloadingDocument(null)
    }
  }

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'default'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'under_review':
      case 'pending':
        return 'warning'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const getLifecycleStageDisplay = (stage: string) => {
    return stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (loading) {
    return (
      <DashboardShell title="Loading..." userRole="compliance" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  if (error || !client) {
    return (
      <DashboardShell title="Client Not Found" userRole="compliance" userName={user?.name || undefined}>
        <div className="space-y-6">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Clients', href: '/clients' },
              { label: 'Not Found' },
            ]}
          />
          <Alert variant="error">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <p className="font-medium">{error || 'Client not found'}</p>
              <p className="text-sm mt-1">The client you're looking for doesn't exist or has been removed.</p>
            </div>
          </Alert>
          <Button onClick={() => window.location.href = '/clients'}>
            Back to Clients
          </Button>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title={client.companyName} userRole="compliance" userName={user?.name || undefined}>
      <div className="space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Clients', href: '/clients' },
            { label: client.companyName },
          ]}
        />

        {/* header with client info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Building2 className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {client.companyName}
                  </h1>
                  <p className="mt-1 text-sm text-neutral-600">
                    {client.industry} • {client.country}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Badge variant={getStatusBadgeVariant(client.status)}>
                      {getLifecycleStageDisplay(client.lifecycleStage)}
                    </Badge>
                    <Badge variant={getRiskBadgeVariant(client.riskLevel)}>
                      Risk: {client.riskLevel.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">{client.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(true)}
                  disabled={rejecting || approving || client.status === 'rejected'}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  onClick={() => setShowApproveModal(true)}
                  disabled={rejecting || approving || client.status === 'approved'}
                >
                  {approving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* show alert if high risk */}
        {(client.riskLevel === 'high' || client.riskLevel === 'critical') && (
          <Alert variant="warning" title="High Risk Alert">
            This client has been flagged as {client.riskLevel} risk. Please review carefully before proceeding.
          </Alert>
        )}

        {/* tabs for different sections */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Company Name</p>
                    <p className="mt-1 text-base text-neutral-900">{client.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Industry</p>
                    <p className="mt-1 text-base text-neutral-900">{client.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Country</p>
                    <p className="mt-1 text-base text-neutral-900">{client.country}</p>
                  </div>
                  {client.city && (
                    <div>
                      <p className="text-sm font-medium text-neutral-500">City</p>
                      <p className="mt-1 text-base text-neutral-900">{client.city}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    {client.annualRevenue && (
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Annual Revenue</p>
                        <p className="mt-1 text-base text-neutral-900">${client.annualRevenue.toLocaleString()}</p>
                      </div>
                    )}
                    {client.numberOfEmployees && (
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Employees</p>
                        <p className="mt-1 text-base text-neutral-900">{client.numberOfEmployees}</p>
                      </div>
                    )}
                  </div>
                  {client.website && (
                    <div>
                      <p className="text-sm font-medium text-neutral-500">Website</p>
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="mt-1 text-base text-primary-600 hover:underline">
                        {client.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {client.primaryContact && (
                    <div>
                      <p className="text-sm font-medium text-neutral-500">Primary Contact</p>
                      <p className="mt-1 text-base text-neutral-900">{client.primaryContact.name}</p>
                      {client.primaryContact.email && (
                        <div className="flex items-center gap-2 text-neutral-700 mt-2">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{client.primaryContact.email}</span>
                        </div>
                      )}
                      {client.primaryContact.phone && (
                        <div className="flex items-center gap-2 text-neutral-700 mt-2">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{client.primaryContact.phone}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {client.email && (
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-neutral-700">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-neutral-700">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div className="text-sm">
                        <p>{client.address}</p>
                        {client.city && <p>{client.city}, {client.country}</p>}
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-neutral-200">
                    <p className="text-sm font-medium text-neutral-500">Assigned Relationship Manager</p>
                    <p className="mt-1 text-base text-neutral-900">{client.assignedRMName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Assigned Compliance Officer</p>
                    <p className="mt-1 text-base text-neutral-900">{client.assignedOfficerName}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Uploaded Documents</CardTitle>
                <CardDescription>
                  All documents submitted for this client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.documents && client.documents.length > 0 ? (
                    client.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-10 w-10 text-primary-600" />
                          <div>
                            <p className="font-medium text-neutral-900">{doc.fileName}</p>
                            <p className="text-sm text-neutral-500">
                              {doc.type} • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                            <Badge variant={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'error' : 'warning'} className="mt-1">
                              {doc.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDocument(doc.id)}
                            disabled={viewingDocument === doc.id}
                          >
                            {viewingDocument === doc.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="mr-2 h-4 w-4" />
                            )}
                            View
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.id)}
                            disabled={downloadingDocument === doc.id}
                          >
                            {downloadingDocument === doc.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="mr-2 h-4 w-4" />
                            )}
                            Download
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500 text-center py-8">No documents uploaded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>
                    Last assessed: {new Date(client.riskAssessment.lastAssessedAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-500">Overall Risk</span>
                      <Badge variant={getRiskBadgeVariant(client.riskAssessment.overall)}>
                        {client.riskAssessment.overall.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-neutral-200">
                      <p className="text-sm font-medium text-neutral-500">Risk Scores (0-100)</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-700">Sanctions Risk</span>
                          <span className="text-sm font-medium">{client.riskAssessment.sanctionsRisk}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-700">Adverse Media Risk</span>
                          <span className="text-sm font-medium">{client.riskAssessment.adverseMediaRisk}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-700">Financial Risk</span>
                          <span className="text-sm font-medium">{client.riskAssessment.financialRisk}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-700">Reputational Risk</span>
                          <span className="text-sm font-medium">{client.riskAssessment.reputationalRisk}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-700">Geographic Risk</span>
                          <span className="text-sm font-medium">{client.riskAssessment.geographicRisk}/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-neutral-200">
                      <p className="text-sm text-neutral-500">Assessed by: {client.riskAssessment.lastAssessedBy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lifecycle Stage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-500">Current Stage</span>
                      <Badge>{getLifecycleStageDisplay(client.lifecycleStage)}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-neutral-500">Status</span>
                      <Badge variant={getStatusBadgeVariant(client.status)}>{client.status}</Badge>
                    </div>
                    {client.onboardingStartDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-500">Onboarding Started</span>
                        <span className="text-sm text-neutral-900">{new Date(client.onboardingStartDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {client.approvalDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-neutral-500">Approved On</span>
                        <span className="text-sm text-neutral-900">{new Date(client.approvalDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Lifecycle History</CardTitle>
                <CardDescription>
                  Complete history of all lifecycle stage changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {client.lifecycleHistory && client.lifecycleHistory.length > 0 ? (
                  <div className="space-y-4">
                    {client.lifecycleHistory.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-neutral-200 last:border-0">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary-500 mt-2"></div>
                          <div className="w-0.5 h-full bg-neutral-200 min-h-[40px]"></div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-neutral-900">
                            {getLifecycleStageDisplay(item.stage)}
                          </p>
                          <p className="text-sm text-neutral-600 mt-1">
                            Changed by {item.changedByName} • {new Date(item.timestamp).toLocaleString()}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-neutral-700 mt-2 bg-neutral-50 p-2 rounded">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-8">No history available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* approve modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Client"
        description="Are you sure you want to approve this client for onboarding?"
      >
        <div className="space-y-4">
          <Textarea
            label="Comment (Optional)"
            placeholder="Add any notes or comments..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowApproveModal(false)
                setComment('')
              }}
              disabled={approving}
            >
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={approving}>
              {approving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* reject modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Client"
        description="Please provide a reason for rejection"
      >
        <div className="space-y-4">
          <Textarea
            label="Reason for Rejection"
            placeholder="Explain why this client is being rejected..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowRejectModal(false)
                setComment('')
              }}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} disabled={rejecting}>
              {rejecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardShell>
  )
}

