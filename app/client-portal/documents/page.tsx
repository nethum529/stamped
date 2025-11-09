'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DocumentUploadCard } from '@/components/client-portal/document-upload-card'
import { FileText, Download, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Document, DocumentType, getDocumentTypeDisplayName, getDocumentStatusColor, formatFileSize } from '@/lib/types/document'

export default function ClientDocumentsPage() {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<Document[]>([])
  const [showUploadFor, setShowUploadFor] = useState<DocumentType | null>(null)

  const clientId = 'client-001'

  const requiredDocTypes: DocumentType[] = [
    'passport',
    'business_license',
    'kyc_form',
    'proof_of_address',
    'financial_statement',
    'incorporation_certificate',
  ]

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const docs = await mockDataService.getDocumentsByClientId(clientId)
        setDocuments(docs)
      } catch (error) {
        console.error('Failed to fetch documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [])

  const handleUpload = async (file: File, docType: DocumentType) => {
    try {
      const newDoc = await mockDataService.uploadDocument({
        clientId,
        type: docType,
        name: file.name,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: 'client-001-user',
        uploadedByName: 'John Doe',
        url: URL.createObjectURL(file),
        isRequired: true,
      })

      setDocuments(prev => [...prev, newDoc])
      setShowUploadFor(null)
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-success-600" />
      case 'under_review':
      case 'uploaded':
        return <Clock className="h-5 w-5 text-warning-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-error-600" />
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-error-600" />
      default:
        return <FileText className="h-5 w-5 text-neutral-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-sans font-bold text-neutral-900">
          Documents
        </h1>
        <p className="text-neutral-600">
          Upload and manage your compliance documents
        </p>
      </div>

      {/* Upload Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-sans font-semibold text-neutral-900">
          Required Documents
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {requiredDocTypes.map((docType) => {
            const existingDoc = documents.find(d => d.type === docType && d.status !== 'rejected')
            const isUploading = showUploadFor === docType

            if (isUploading) {
              return (
                <DocumentUploadCard
                  key={docType}
                  documentType={docType}
                  onUpload={(file) => handleUpload(file, docType)}
                  isRequired={true}
                />
              )
            }

            if (existingDoc) {
              return (
                <Card key={docType}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-sans font-semibold text-neutral-900">
                            {getDocumentTypeDisplayName(docType)}
                          </h3>
                          <p className="mt-1 text-sm text-neutral-600">
                            {existingDoc.fileName}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {formatFileSize(existingDoc.fileSize)} • Uploaded {new Date(existingDoc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {getStatusIcon(existingDoc.status)}
                      </div>

                      <Badge variant={getDocumentStatusColor(existingDoc.status)}>
                        {existingDoc.status === 'approved' && 'Approved'}
                        {existingDoc.status === 'under_review' && 'Under Review'}
                        {existingDoc.status === 'uploaded' && 'Uploaded'}
                        {existingDoc.status === 'rejected' && 'Rejected'}
                        {existingDoc.status === 'expired' && 'Expired'}
                      </Badge>

                      {existingDoc.status === 'rejected' && existingDoc.comments && existingDoc.comments.length > 0 && (
                        <div className="rounded-lg border border-error-200 bg-error-50 p-3">
                          <p className="text-sm text-error-900 font-medium">Rejection Reason:</p>
                          <p className="text-sm text-error-700 mt-1">{existingDoc.comments[0]}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(existingDoc.url, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const a = document.createElement('a')
                            a.href = existingDoc.url
                            a.download = existingDoc.fileName
                            a.click()
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      {existingDoc.status === 'rejected' && (
                        <Button 
                          size="sm"
                          className="w-full"
                          onClick={() => setShowUploadFor(docType)}
                        >
                          Upload New Version
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            }

            // Not uploaded yet
            return (
              <Card key={docType} className="border-dashed border-2">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-sans font-semibold text-neutral-900">
                        {getDocumentTypeDisplayName(docType)}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-600">
                        Required document
                      </p>
                    </div>

                    <Badge variant="default">Not Uploaded</Badge>

                    <Button 
                      size="sm"
                      className="w-full"
                      onClick={() => setShowUploadFor(docType)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* All Documents List */}
      {documents.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-sans font-semibold text-neutral-900">
            All Uploaded Documents
          </h2>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-200">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(doc.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {getDocumentTypeDisplayName(doc.type)}
                          </p>
                          <p className="text-xs text-neutral-600 truncate">
                            {doc.fileName} • {formatFileSize(doc.fileSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getDocumentStatusColor(doc.status)} className="whitespace-nowrap">
                          {doc.status === 'approved' && 'Approved'}
                          {doc.status === 'under_review' && 'Reviewing'}
                          {doc.status === 'uploaded' && 'Uploaded'}
                          {doc.status === 'rejected' && 'Rejected'}
                          {doc.status === 'expired' && 'Expired'}
                        </Badge>

                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(doc.url, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const a = document.createElement('a')
                              a.href = doc.url
                              a.download = doc.fileName
                              a.click()
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

