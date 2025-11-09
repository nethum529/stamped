'use client'

import React, { useState, useEffect } from 'react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Document, DocumentStatus } from '@/lib/types/document'
import DocumentReviewCard from '@/components/compliance/document-review-card'
import DocumentAnnotator from '@/components/compliance/document-annotator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, FileText, CheckCircle, XCircle, Clock, AlertTriangle, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'

type DocumentFilterStatus = DocumentStatus | 'ALL'

export default function ComplianceDocumentsPage() {
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
          doc.documentType.toLowerCase().includes(query) ||
          doc.clientId.toLowerCase().includes(query)
      )
    }

    setFilteredDocuments(filtered)
  }, [documents, filterStatus, searchQuery])

  const handleApprove = async (documentId: string, notes?: string) => {
    await mockDataService.updateDocumentStatus(documentId, 'APPROVED', notes)
    
    // Update local state
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, status: 'APPROVED', reviewNotes: notes, reviewDate: new Date().toISOString() }
          : doc
      )
    )
  }

  const handleReject = async (documentId: string, reason: string) => {
    await mockDataService.updateDocumentStatus(documentId, 'REJECTED', reason)
    
    // Update local state
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, status: 'REJECTED', reviewNotes: reason, reviewDate: new Date().toISOString() }
          : doc
      )
    )
  }

  const handleView = (document: Document) => {
    setViewingDocument(document)
  }

  // Calculate stats
  const stats = {
    pending: documents.filter((doc) => doc.status === 'UPLOADED' || doc.status === 'PENDING' || doc.status === 'REVIEWING').length,
    approved: documents.filter((doc) => doc.status === 'APPROVED').length,
    rejected: documents.filter((doc) => doc.status === 'REJECTED').length,
    total: documents.length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <>
      {/* Document Annotator Modal */}
      {viewingDocument && (
        <DocumentAnnotator
          document={viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}

      <div className="space-y-6">
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
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as DocumentFilterStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="UPLOADED">Uploaded</SelectItem>
                <SelectItem value="REVIEWING">Reviewing</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="MISSING">Missing</SelectItem>
              </SelectContent>
            </Select>
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
    </>
  )
}

