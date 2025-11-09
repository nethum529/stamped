'use client'

import React, { useState } from 'react'
import { Document, DocumentStatus } from '@/lib/types/document'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Download, CheckCircle, XCircle, Eye, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface DocumentReviewCardProps {
  document: Document
  onApprove: (documentId: string, notes?: string) => Promise<void>
  onReject: (documentId: string, reason: string) => Promise<void>
  onView: (document: Document) => void
}

export default function DocumentReviewCard({
  document,
  onApprove,
  onReject,
  onView,
}: DocumentReviewCardProps) {
  const [isReviewing, setIsReviewing] = useState(false)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'UPLOADED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MISSING':
        return 'bg-gray-100 text-gray-800 border-gray-300'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-300'
    }
  }

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      case 'REVIEWING':
        return <Eye className="h-4 w-4" />
      case 'UPLOADED':
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'MISSING':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleStartReview = (action: 'approve' | 'reject') => {
    setReviewAction(action)
    setIsReviewing(true)
    setReviewNotes('')
    setError(null)
  }

  const handleCancelReview = () => {
    setIsReviewing(false)
    setReviewAction(null)
    setReviewNotes('')
    setError(null)
  }

  const handleSubmitReview = async () => {
    if (reviewAction === 'reject' && !reviewNotes.trim()) {
      setError('Please provide a reason for rejection')
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (reviewAction === 'approve') {
        await onApprove(document.id, reviewNotes || undefined)
      } else if (reviewAction === 'reject') {
        await onReject(document.id, reviewNotes)
      }
      
      // Reset state after successful review
      setIsReviewing(false)
      setReviewAction(null)
      setReviewNotes('')
    } catch (err) {
      setError('Failed to submit review. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const canReview = document.status === 'UPLOADED' || document.status === 'REVIEWING' || document.status === 'PENDING'
  const isReviewed = document.status === 'APPROVED' || document.status === 'REJECTED'

  return (
    <Card className={cn(
      'transition-all duration-300 hover:shadow-lg',
      isReviewed && 'opacity-75'
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary-100 p-2">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <CardTitle className="text-base font-sans">{document.fileName}</CardTitle>
                <p className="text-xs text-neutral-600 mt-1">
                  {document.documentType.replace(/_/g, ' ')} • {formatFileSize(document.fileSize)}
                </p>
              </div>
            </div>
          </div>
          <Badge variant="outline" className={cn('text-xs font-medium border', getStatusColor(document.status))}>
            <span className="mr-1">{getStatusIcon(document.status)}</span>
            {document.status.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Document Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-neutral-500">Uploaded By</p>
            <p className="font-medium text-neutral-900">
              {document.uploadedBy === 'client' ? 'Client' : 'Employee'}
            </p>
          </div>
          <div>
            <p className="text-neutral-500">Upload Date</p>
            <p className="font-medium text-neutral-900">
              {new Date(document.uploadDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Review Notes (if already reviewed) */}
        {isReviewed && document.reviewNotes && (
          <Alert variant={document.status === 'APPROVED' ? 'success' : 'error'}>
            <AlertDescription className="text-sm">
              <span className="font-semibold">Review Notes: </span>
              {document.reviewNotes}
            </AlertDescription>
          </Alert>
        )}

        {/* Review Form */}
        <AnimatePresence>
          {isReviewing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                <label className="text-sm font-medium text-neutral-900 mb-2 block">
                  {reviewAction === 'approve' ? 'Notes (Optional)' : 'Reason for Rejection *'}
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Add any notes about this document...'
                      : 'Explain why this document is being rejected...'
                  }
                  rows={3}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {error && (
                  <p className="text-xs text-red-600 mt-2">{error}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSubmitReview}
                  disabled={loading}
                  variant={reviewAction === 'approve' ? 'default' : 'destructive'}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="mr-2"
                      >
                        <Clock className="h-4 w-4" />
                      </motion.div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      {reviewAction === 'approve' ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve Document
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject Document
                        </>
                      )}
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelReview}
                  disabled={loading}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        {!isReviewing && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onView(document)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <a
              href={document.downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        )}

        {canReview && !isReviewing && (
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-200">
            <Button
              onClick={() => handleStartReview('approve')}
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button
              onClick={() => handleStartReview('reject')}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

