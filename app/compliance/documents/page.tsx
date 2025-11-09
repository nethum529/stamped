'use client'

import React, { useState, useEffect } from 'react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Document, DocumentStatus } from '@/lib/types/document'
import DocumentReviewCard from '@/components/compliance/document-review-card'
import DocumentAnnotator from '@/components/compliance/document-annotator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, FileText, CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { BackButton } from '@/components/layout/back-button'
import { useToast } from '@/components/ui/toast'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'

type DocumentFilterStatus = DocumentStatus | 'ALL'

export default function ComplianceDocumentsPage() {
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<DocumentFilterStatus>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null)

  // Fetch all documents (in real app, filter by pending/reviewing)
  useEffect(() => {
    async function fetchDocuments() {
      try {
        setLoading(true)
        // In real app, we'd fetch documents that need review
        // For now, get all documents from all clients
        const allClients = await mockDataService.getClients()
        const allDocs: Document[] = []
        
        for (const client of allClients) {
          const clientDocs = await mockDataService.getDocumentsByClientId(client.id)
          allDocs.push(...clientDocs)
        }
        
        setDocuments(allDocs)
        setFilteredDocuments(allDocs)
      } catch (err) {
        setError('Failed to load documents')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  // Filter documents
  useEffect(() => {
    let filtered = documents

    // Filter by status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter((doc) => doc.status === filterStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.fileName.toLowerCase().includes(query) ||
          doc.type.toLowerCase().includes(query) ||
          doc.clientId.toLowerCase().includes(query)
      )
    }

    setFilteredDocuments(filtered)
  }, [documents, filterStatus, searchQuery])

  const handleApprove = async (documentId: string, notes?: string) => {
    try {
      const doc = documents.find(d => d.id === documentId)
      const updatedDoc = await mockDataService.updateDocumentStatus(
        documentId, 
        'approved', 
        user?.id,
        user?.name,
        notes ? [notes] : undefined
      )
      
      if (updatedDoc) {
        // Update local state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? updatedDoc : doc
          )
        )
        showSuccess(`Document "${doc?.fileName || documentId}" approved successfully`)
      } else {
        throw new Error('Failed to update document status')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
      throw err // Re-throw to let the card handle it
    }
  }

  const handleReject = async (documentId: string, reason: string) => {
    try {
      const doc = documents.find(d => d.id === documentId)
      const updatedDoc = await mockDataService.updateDocumentStatus(
        documentId, 
        'rejected', 
        user?.id,
        user?.name,
        [reason]
      )
      
      if (updatedDoc) {
        // Update local state
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentId ? updatedDoc : doc
          )
        )
        showSuccess(`Document "${doc?.fileName || documentId}" rejected`)
      } else {
        throw new Error('Failed to update document status')
      }
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
      throw err // Re-throw to let the card handle it
    }
  }

  const handleView = (document: Document) => {
    setViewingDocument(document)
  }

  // Calculate stats
  const stats = {
    pending: documents.filter((doc) => doc.status === 'uploaded' || doc.status === 'pending_upload' || doc.status === 'under_review').length,
    approved: documents.filter((doc) => doc.status === 'approved').length,
    rejected: documents.filter((doc) => doc.status === 'rejected').length,
    total: documents.length,
  }

  if (loading) {
    return (
      <DashboardShell title="Document Reviews" userRole="compliance_officer" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Document Reviews" userRole="compliance_officer" userName={user?.name || undefined}>
      {/* Document Annotator Modal */}
      {viewingDocument && (
        <DocumentAnnotator
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}

      <div className="space-y-6 max-w-7xl mx-auto">
        <BackButton href="/compliance" label="Back to Compliance" />
        
        {/* Header */}
      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Document Review</h1>
        <p className="mt-2 text-neutral-600">Review and approve client-submitted documents</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Pending Review</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.pending}</p>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Approved</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.approved}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Rejected</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.rejected}</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-l-4 border-l-primary-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Documents</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.total}</p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-neutral-600" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Search by filename, type, or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DocumentFilterStatus)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'pending_upload', label: 'Pending Upload' },
                { value: 'uploaded', label: 'Uploaded' },
                { value: 'under_review', label: 'Under Review' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              label="Status"
            />
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="error">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Documents Grid */}
      <div className="space-y-2">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold">{filteredDocuments.length}</span> document
          {filteredDocuments.length !== 1 ? 's' : ''}
        </p>

        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <DocumentReviewCard
                  document={document}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onView={handleView}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent>
              <div className="text-center text-neutral-500">
                <FileText className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                <p className="text-lg font-medium">No documents found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </DashboardShell>
  )
}

