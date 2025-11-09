'use client'

import React, { useState } from 'react'
import { Document } from '@/lib/types/document'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ZoomIn,
  ZoomOut,
  Download,
  X,
  Highlighter,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Annotation {
  id: string
  type: 'highlight' | 'comment'
  x: number
  y: number
  width?: number
  height?: number
  text?: string
  color: string
  author: string
  timestamp: string
}

interface DocumentAnnotatorProps {
  document: Document
  onClose: () => void
}

export default function DocumentAnnotator({ document, onClose }: DocumentAnnotatorProps) {
  const [zoom, setZoom] = useState(100)
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: 'anno-1',
      type: 'highlight',
      x: 20,
      y: 30,
      width: 40,
      height: 5,
      color: 'rgba(251, 191, 36, 0.4)',
      author: 'You',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'anno-2',
      type: 'comment',
      x: 65,
      y: 50,
      text: 'Please verify this information',
      color: 'rgb(239, 68, 68)',
      author: 'You',
      timestamp: new Date().toISOString(),
    },
  ])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages] = useState(3) // Mock total pages
  const [activeTool, setActiveTool] = useState<'highlight' | 'comment' | null>(null)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleAddAnnotation = (type: 'highlight' | 'comment') => {
    setActiveTool(type)
    // In real app, enable drawing/clicking mode
    alert(
      `${type === 'highlight' ? 'Highlight' : 'Comment'} mode activated. In production, you would click/drag on the document to add annotations.`
    )
  }

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((anno) => anno.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <div className="flex-1">
            <h3 className="font-sans text-lg font-semibold text-neutral-900">{document.fileName}</h3>
            <p className="text-sm text-neutral-600">
              {document.documentType.replace(/_/g, ' ')} • {formatFileSize(document.fileSize)}
            </p>
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-2">
            {/* Page Navigation */}
            <div className="flex items-center gap-2 border-r border-neutral-200 pr-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-neutral-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 border-r border-neutral-200 pr-4">
              <Button onClick={handleZoomOut} disabled={zoom === 50} variant="outline" size="sm">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-neutral-700 min-w-[60px] text-center">
                {zoom}%
              </span>
              <Button onClick={handleZoomIn} disabled={zoom === 200} variant="outline" size="sm">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Annotation Tools */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleAddAnnotation('highlight')}
                variant={activeTool === 'highlight' ? 'default' : 'outline'}
                size="sm"
              >
                <Highlighter className="mr-2 h-4 w-4" />
                Highlight
              </Button>
              <Button
                onClick={() => handleAddAnnotation('comment')}
                variant={activeTool === 'comment' ? 'default' : 'outline'}
                size="sm"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
          </div>

          <a href={document.downloadUrl} download target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 overflow-auto bg-neutral-100 p-8">
            <div
              className="mx-auto bg-white shadow-xl"
              style={{
                width: `${zoom}%`,
                minHeight: '1056px', // A4 height
                position: 'relative',
              }}
            >
              {/* Mock Document Content */}
              <div className="p-12 text-neutral-800">
                <h1 className="text-2xl font-bold mb-4">
                  {document.documentType.replace(/_/g, ' ')}
                </h1>
                <p className="mb-4">
                  This is a mock document viewer. In production, this would display the actual PDF or
                  image content using a library like PDF.js or react-pdf.
                </p>
                <p className="mb-4">
                  <strong>Document ID:</strong> {document.id}
                </p>
                <p className="mb-4">
                  <strong>Client ID:</strong> {document.clientId}
                </p>
                <p className="mb-4">
                  <strong>Upload Date:</strong>{' '}
                  {new Date(document.uploadDate).toLocaleDateString()}
                </p>
                <div className="mt-8 border-t border-neutral-300 pt-4">
                  <p className="text-sm text-neutral-600">
                    Additional document content would appear here. Users can highlight text and add
                    comments by clicking the toolbar buttons above.
                  </p>
                </div>

                {/* Render Annotations */}
                {annotations.map((anno) => (
                  <div
                    key={anno.id}
                    style={{
                      position: 'absolute',
                      left: `${anno.x}%`,
                      top: `${anno.y}%`,
                      width: anno.width ? `${anno.width}%` : 'auto',
                      height: anno.height ? `${anno.height}%` : 'auto',
                      backgroundColor: anno.type === 'highlight' ? anno.color : 'transparent',
                      zIndex: 10,
                    }}
                    className={cn(
                      'cursor-pointer transition-opacity hover:opacity-80',
                      anno.type === 'comment' && 'w-6 h-6'
                    )}
                  >
                    {anno.type === 'comment' && (
                      <div className="relative">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: anno.color }}
                        >
                          <MessageSquare className="h-3 w-3 text-white" />
                        </div>
                        {/* Comment Tooltip */}
                        <div className="absolute left-8 top-0 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 text-xs hidden group-hover:block">
                          <p className="font-semibold text-neutral-900">{anno.author}</p>
                          <p className="text-neutral-700 mt-1">{anno.text}</p>
                          <p className="text-neutral-500 text-xs mt-1">
                            {new Date(anno.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Annotations Sidebar */}
          <div className="w-80 border-l border-neutral-200 bg-white overflow-auto">
            <div className="p-4">
              <h4 className="font-sans text-sm font-semibold text-neutral-900 mb-3">
                Annotations ({annotations.length})
              </h4>
              <div className="space-y-3">
                {annotations.length > 0 ? (
                  annotations.map((anno) => (
                    <Card key={anno.id} className="shadow-sm">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {anno.type}
                              </Badge>
                              <span className="text-xs text-neutral-600">{anno.author}</span>
                            </div>
                            {anno.text && (
                              <p className="text-sm text-neutral-800 mt-1">{anno.text}</p>
                            )}
                            <p className="text-xs text-neutral-500 mt-1">
                              {new Date(anno.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Button
                            onClick={() => handleDeleteAnnotation(anno.id)}
                            variant="ghost"
                            size="sm"
                            className="ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500 text-center py-8">
                    No annotations yet. Use the tools above to add highlights or comments.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

