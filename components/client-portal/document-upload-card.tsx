'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { DocumentType, getDocumentTypeDisplayName } from '@/lib/types/document'

interface DocumentUploadCardProps {
  documentType: DocumentType
  onUpload: (file: File) => Promise<void>
  isRequired?: boolean
}

export function DocumentUploadCard({ 
  documentType, 
  onUpload,
  isRequired = false 
}: DocumentUploadCardProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null)
    setUploadComplete(false)
    
    if (acceptedFiles.length === 0) {
      setError('Please select a valid file')
      return
    }

    const file = acceptedFiles[0]
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setError('Only PDF, JPEG, and PNG files are allowed')
      return
    }

    setSelectedFile(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    disabled: uploading || uploadComplete,
  })

  const handleUpload = async () => {
    if (!selectedFile) return
    
    if (!onUpload || typeof onUpload !== 'function') {
      setError('Upload handler is not available. Please try again.')
      return
    }

    setUploading(true)
    setError(null)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onUpload(selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploadProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    setError(null)
    setUploadProgress(0)
    setUploadComplete(false)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-sans font-semibold text-neutral-900">
                {getDocumentTypeDisplayName(documentType)}
              </h3>
              {isRequired && (
                <p className="mt-1 text-sm text-neutral-600">Required document</p>
              )}
            </div>
            {uploadComplete && (
              <CheckCircle className="h-6 w-6 text-success-600" />
            )}
          </div>

          {/* Dropzone */}
          {!selectedFile && !uploadComplete && (
            <div
              {...getRootProps()}
              className={`
                cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors
                ${isDragActive 
                  ? 'border-primary-600 bg-primary-50' 
                  : 'border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50'
                }
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-neutral-400" />
              <p className="mt-3 text-sm font-medium text-neutral-900">
                {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                or click to browse
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                PDF, JPEG, or PNG • Max 10MB
              </p>
            </div>
          )}

          {/* Selected File */}
          {selectedFile && !uploadComplete && (
            <div className="rounded-lg border border-neutral-200 p-4">
              <div className="flex items-start gap-3">
                <File className="h-10 w-10 flex-shrink-0 text-primary-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {uploading && (
                    <div className="mt-3 space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-xs text-neutral-600">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                </div>
                {!uploading && (
                  <button
                    onClick={handleRemove}
                    className="flex-shrink-0 rounded-lg p-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upload Complete */}
          {uploadComplete && (
            <div className="rounded-lg border border-success-200 bg-success-50 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-success-600" />
                <div>
                  <p className="text-sm font-medium text-success-900">
                    Upload successful!
                  </p>
                  <p className="text-xs text-success-700">
                    Your document has been submitted for review
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-error-200 bg-error-50 p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-error-600" />
                <p className="text-sm text-error-900">{error}</p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {selectedFile && !uploading && !uploadComplete && (
            <Button 
              onClick={handleUpload} 
              className="w-full"
              size="lg"
            >
              Upload Document
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

