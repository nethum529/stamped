'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function VendorDocumentsPage() {
  const documents = [
    {
      id: '1',
      name: 'Business License',
      type: 'PDF',
      size: '2.4 MB',
      uploadedAt: '2024-01-15',
      status: 'approved',
    },
    {
      id: '2',
      name: 'Tax Certificate',
      type: 'PDF',
      size: '1.8 MB',
      uploadedAt: '2024-01-18',
      status: 'pending_review',
    },
    {
      id: '3',
      name: 'W-9 Form',
      type: 'PDF',
      size: '856 KB',
      uploadedAt: '2024-01-16',
      status: 'approved',
    },
    {
      id: '4',
      name: 'Bank Account Details',
      type: 'PDF',
      size: '1.2 MB',
      uploadedAt: '2024-01-19',
      status: 'pending_review',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />
      case 'pending_review':
        return <Clock className="h-4 w-4" />
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Documents
        </h1>
        <p className="text-lg text-neutral-600">
          Upload and manage your vendor documentation
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Documents</CardTitle>
            <CardDescription>
              {documents.length} documents uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white/50 p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-turquoise-100 text-primary-600 transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 truncate">{doc.name}</p>
                      <p className="text-sm text-neutral-600">
                        {doc.type} • {doc.size} • Uploaded {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(doc.status)}`}>
                      {getStatusIcon(doc.status)}
                      {doc.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

