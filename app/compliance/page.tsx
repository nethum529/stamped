'use client'

import React, { useState, useEffect } from 'react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Document, DocumentStatus } from '@/lib/types/document'
import { RiskScoreData } from '@/components/compliance/risk-score-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Timeline } from '@/components/ui/timeline'
import Link from 'next/link'
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  TrendingUp,
  ArrowRight,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'

export default function ComplianceDashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(false)
        // Fetch all documents for review
        const allClients = await mockDataService.getClients()
        const allDocs: Document[] = []
        
        for (const client of allClients) {
          const clientDocs = await mockDataService.getDocumentsByClientId(client.id)
          allDocs.push(...clientDocs)
        }
        
        setDocuments(allDocs)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate document stats
  const docStats = {
    pending: documents.filter((doc) => doc.status === 'UPLOADED' || doc.status === 'PENDING' || doc.status === 'REVIEWING').length,
    approved: documents.filter((doc) => doc.status === 'APPROVED').length,
    rejected: documents.filter((doc) => doc.status === 'REJECTED').length,
    total: documents.length,
  }

  // Calculate risk stats
  const riskStats = {
    critical: mockRiskScores.filter((s) => s.riskLevel === 'Critical').length,
    high: mockRiskScores.filter((s) => s.riskLevel === 'High').length,
    medium: mockRiskScores.filter((s) => s.riskLevel === 'Medium').length,
    low: mockRiskScores.filter((s) => s.riskLevel === 'Low').length,
  }

  // Get high-risk entities
  const highRiskEntities = mockRiskScores
    .filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Critical')
    .slice(0, 5)

  // Get pending documents
  const pendingDocs = documents
    .filter((doc) => doc.status === 'UPLOADED' || doc.status === 'PENDING' || doc.status === 'REVIEWING')
    .slice(0, 5)

  // Recent activity (recent document reviews)
  const recentActivity = documents
    .filter((doc) => doc.status === 'APPROVED' || doc.status === 'REJECTED')
    .filter((doc) => doc.reviewDate)
    .sort((a, b) => new Date(b.reviewDate!).getTime() - new Date(a.reviewDate!).getTime())
    .slice(0, 5)
    .map((doc) => ({
      id: doc.id,
      title: `${doc.fileName} - ${doc.status}`,
      description: `${doc.documentType.replace(/_/g, ' ')} • Client: ${doc.clientId}`,
      timestamp: new Date(doc.reviewDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      variant: doc.status === 'APPROVED' ? ('success' as const) : ('error' as const),
    }))

  const stats = [
    {
      title: 'Pending Reviews',
      value: docStats.pending.toString(),
      change: 'Requires immediate action',
      icon: Clock,
      variant: 'warning' as const,
      trend: 'neutral',
    },
    {
      title: 'High-Risk Entities',
      value: (riskStats.critical + riskStats.high).toString(),
      change: `${riskStats.critical} critical`,
      icon: AlertTriangle,
      variant: 'error' as const,
      trend: 'down',
    },
    {
      title: 'Approved This Month',
      value: docStats.approved.toString(),
      change: '+12% from last month',
      icon: CheckCircle,
      variant: 'success' as const,
      trend: 'up',
    },
    {
      title: 'Compliance Score',
      value: '94%',
      change: '+3% vs target',
      icon: Shield,
      variant: 'success' as const,
      trend: 'up',
    },
  ]

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Welcome Message */}
      <div className="animate-fade-in-up">
        <h1 className="font-sans text-4xl md:text-5xl font-bold text-neutral-900">
          Compliance Dashboard
        </h1>
        <p className="mt-2 text-lg text-neutral-600">
          Monitor document reviews, risk assessments, and compliance metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="transition-all duration-300 hover:shadow-2xl border-neutral-200/50 bg-white/90">
                <CardContent className="p-6 md:p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">
                        {stat.title}
                      </p>
                      <p className="mt-2 text-3xl font-bold text-neutral-900">
                        {stat.value}
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-3',
                        stat.variant === 'error' && 'bg-red-100 text-red-600',
                        stat.variant === 'warning' && 'bg-yellow-100 text-yellow-600',
                        stat.variant === 'success' && 'bg-green-100 text-green-600',
                        stat.variant === 'default' && 'bg-primary-100 text-primary-600'
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pending Document Reviews */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-sans text-2xl">Pending Document Reviews</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">
                Documents awaiting review
              </p>
            </div>
            <Link href="/compliance/documents">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingDocs.length > 0 ? (
              <div className="space-y-3">
                {pendingDocs.map((doc) => (
                  <Link key={doc.id} href="/compliance/documents">
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary-300 hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {doc.fileName}
                          </p>
                          <p className="text-xs text-neutral-600 mt-1">
                            {doc.documentType.replace(/_/g, ' ')} • Client: {doc.clientId}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                        <Clock className="mr-1 h-3 w-3" />
                        {doc.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 text-center py-8">
                No pending documents
              </p>
            )}
          </CardContent>
        </Card>

        {/* High-Risk Entities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-sans text-2xl">High-Risk Entities</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">
                Requires attention
              </p>
            </div>
            <Link href="/compliance/risk-assessment">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {highRiskEntities.length > 0 ? (
              <div className="space-y-3">
                {highRiskEntities.map((entity) => (
                  <Link key={entity.entityId} href="/compliance/risk-assessment">
                    <div className="rounded-lg border border-neutral-200 p-3 transition-all hover:border-red-300 hover:shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className={cn(
                                'h-4 w-4',
                                entity.riskLevel === 'Critical' && 'text-red-600',
                                entity.riskLevel === 'High' && 'text-orange-600'
                              )}
                            />
                            <p className="text-sm font-medium text-neutral-900">
                              {entity.entityName}
                            </p>
                          </div>
                          <p className="text-xs text-neutral-600 mt-1">
                            {entity.entityType === 'client' ? 'Client' : 'Vendor'} • Score: {entity.overallScore}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs',
                            entity.riskLevel === 'Critical' && 'bg-red-100 text-red-800 border-red-300',
                            entity.riskLevel === 'High' && 'bg-orange-100 text-orange-800 border-orange-300'
                          )}
                        >
                          {entity.riskLevel}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 text-center py-8">
                No high-risk entities
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Recent Activity</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">
            Latest document reviews and approvals
          </p>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <Timeline items={recentActivity} />
          ) : (
            <p className="text-sm text-neutral-500 text-center py-8">
              No recent activity
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Quick Actions</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">
            Common tasks for compliance officers
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/compliance/documents" className="block">
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <FileText className="mb-2 h-8 w-8" />
                <span>Review Documents</span>
              </Button>
            </Link>
            <Link href="/compliance/risk-assessment" className="block">
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <Shield className="mb-2 h-8 w-8" />
                <span>Risk Assessment</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-auto flex-col py-6">
              <TrendingUp className="mb-2 h-8 w-8" />
              <span>Compliance Report</span>
            </Button>
            <Button variant="outline" className="w-full h-auto flex-col py-6">
              <CheckCircle className="mb-2 h-8 w-8" />
              <span>Audit Log</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
