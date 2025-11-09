'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RiskScoreCard, { RiskScoreData, RiskLevel } from '@/components/compliance/risk-score-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Shield, AlertTriangle, CheckCircle, AlertCircle, Search, Filter, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/components/ui/toast'

type EntityTypeFilter = 'all' | 'client' | 'vendor'
type RiskLevelFilter = 'all' | RiskLevel

export default function RiskAnalysisPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { showError } = useToast()
  const [riskScores, setRiskScores] = useState<RiskScoreData[]>([])
  const [filteredScores, setFilteredScores] = useState<RiskScoreData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityTypeFilter>('all')
  const [riskLevelFilter, setRiskLevelFilter] = useState<RiskLevelFilter>('all')

  // Fetch risk scores (mock)
  useEffect(() => {
    async function fetchRiskScores() {
      try {
        setLoading(true)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))
        setRiskScores(mockRiskScores)
        setFilteredScores(mockRiskScores)
      } catch (error) {
        console.error('Failed to fetch risk scores:', error)
        showError('Failed to load risk analyses. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    // Only fetch if auth is not loading
    if (!authLoading) {
      fetchRiskScores()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]) // Wait for auth to finish loading before fetching data

  // Filter risk scores
  useEffect(() => {
    let filtered = riskScores

    // Filter by entity type
    if (entityTypeFilter !== 'all') {
      filtered = filtered.filter((score) => score.entityType === entityTypeFilter)
    }

    // Filter by risk level
    if (riskLevelFilter !== 'all') {
      filtered = filtered.filter((score) => score.riskLevel === riskLevelFilter)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (score) =>
          score.entityName.toLowerCase().includes(query) ||
          score.entityId.toLowerCase().includes(query)
      )
    }

    setFilteredScores(filtered)
  }, [riskScores, entityTypeFilter, riskLevelFilter, searchQuery])

  // Calculate statistics
  const stats = {
    total: riskScores.length,
    low: riskScores.filter((s) => s.riskLevel === 'Low').length,
    medium: riskScores.filter((s) => s.riskLevel === 'Medium').length,
    high: riskScores.filter((s) => s.riskLevel === 'High').length,
    critical: riskScores.filter((s) => s.riskLevel === 'Critical').length,
    avgScore: riskScores.length > 0
      ? Math.round(riskScores.reduce((sum, s) => sum + s.overallScore, 0) / riskScores.length)
      : 0,
  }

  const handleViewDetails = (score: RiskScoreData) => {
    // Navigate to detailed risk analysis page
    router.push(`/risk-analyst/analysis/${score.entityId}`)
  }

  if (loading || authLoading) {
    return (
      <DashboardShell title="Risk Analysis" userRole="risk_analyst" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Risk Analysis" userRole="risk_analyst" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="font-sans text-4xl font-bold text-neutral-900">Risk Analysis</h1>
          <p className="mt-2 text-lg text-neutral-600">
            Comprehensive risk assessment and analysis for clients and vendors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-l-4 border-l-primary-500">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Total Entities</p>
                    <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.total}</p>
                  </div>
                  <div className="rounded-full bg-primary-100 p-3">
                    <Shield className="h-6 w-6 text-primary-600" />
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
                    <p className="text-sm text-neutral-600">Low Risk</p>
                    <p className="mt-1 text-3xl font-bold text-green-600">{stats.low}</p>
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
            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Medium Risk</p>
                    <p className="mt-1 text-3xl font-bold text-yellow-600">{stats.medium}</p>
                  </div>
                  <div className="rounded-full bg-yellow-100 p-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
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
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">High Risk</p>
                    <p className="mt-1 text-3xl font-bold text-orange-600">{stats.high}</p>
                  </div>
                  <div className="rounded-full bg-orange-100 p-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600">Critical Risk</p>
                    <p className="mt-1 text-3xl font-bold text-red-600">{stats.critical}</p>
                  </div>
                  <div className="rounded-full bg-red-100 p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Average Score Card */}
        <Card className="bg-gradient-to-r from-primary-50 to-turquoise-50 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600">Average Risk Score</p>
                <p className="mt-2 text-4xl font-bold text-neutral-900">{stats.avgScore}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {stats.avgScore <= 25 && 'Excellent - Low overall risk'}
                  {stats.avgScore > 25 && stats.avgScore <= 50 && 'Good - Moderate risk levels'}
                  {stats.avgScore > 50 && stats.avgScore <= 75 && 'Warning - Elevated risk'}
                  {stats.avgScore > 75 && 'Critical - High risk requiring attention'}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 p-4">
                <BarChart3 className="h-12 w-12 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Risk Assessments</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">
              View and manage risk assessments for all entities
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input
                    placeholder="Search by entity name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={entityTypeFilter} onValueChange={(value) => setEntityTypeFilter(value as EntityTypeFilter)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="client">Clients</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                </SelectContent>
              </Select>
              <Select value={riskLevelFilter} onValueChange={(value) => setRiskLevelFilter(value as RiskLevelFilter)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Risk Score Cards Grid */}
            {filteredScores.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredScores.map((score, index) => (
                  <motion.div
                    key={score.entityId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <RiskScoreCard
                      data={score}
                      onViewDetails={() => handleViewDetails(score)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="py-12">
                <CardContent>
                  <div className="text-center text-neutral-500">
                    <Shield className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                    <p className="text-lg font-medium">No risk assessments found</p>
                    <p className="text-sm mt-1">
                      {searchQuery || entityTypeFilter !== 'all' || riskLevelFilter !== 'all'
                        ? 'Try adjusting your filters'
                        : 'Risk assessments will appear here'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

