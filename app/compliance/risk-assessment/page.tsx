'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RiskScoreCard, { RiskScoreData, RiskLevel } from '@/components/compliance/risk-score-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Shield, AlertTriangle, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import { BackButton } from '@/components/layout/back-button'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { useAuth } from '@/lib/hooks/useAuth'

type EntityTypeFilter = 'all' | 'client' | 'vendor'
type RiskLevelFilter = 'all' | RiskLevel

export default function RiskAssessmentPage() {
  const router = useRouter()
  const { user } = useAuth()
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
      } finally {
        setLoading(false)
      }
    }

    fetchRiskScores()
  }, [])

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

  if (loading) {
    return (
      <DashboardShell title="Risk Assessment" userRole="compliance_officer" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Risk Assessment" userRole="compliance_officer" userName={user?.name || undefined}>
      <div className="space-y-6 max-w-7xl mx-auto">
        <BackButton href="/compliance" label="Back to Compliance" />
      
      {/* Header */}
      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Risk Assessment</h1>
        <p className="mt-2 text-neutral-600">Monitor and evaluate client & vendor risk profiles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Critical</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.critical}</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
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
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">High</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.high}</p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Medium</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.medium}</p>
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
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Low</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.low}</p>
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
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card className="border-l-4 border-l-neutral-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Avg Score</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.avgScore}</p>
                </div>
                <div className="rounded-full bg-neutral-100 p-3">
                  <Shield className="h-6 w-6 text-neutral-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Entity Type Filter */}
            <Select value={entityTypeFilter} onValueChange={(value) => setEntityTypeFilter(value as EntityTypeFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                <SelectItem value="client">Clients Only</SelectItem>
                <SelectItem value="vendor">Vendors Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Risk Level Filter */}
            <Select value={riskLevelFilter} onValueChange={(value) => setRiskLevelFilter(value as RiskLevelFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Low">Low Risk</SelectItem>
                <SelectItem value="Medium">Medium Risk</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
                <SelectItem value="Critical">Critical Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Risk Scores Grid */}
      <div className="space-y-2">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold">{filteredScores.length}</span> entit
          {filteredScores.length !== 1 ? 'ies' : 'y'}
        </p>

        {filteredScores.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredScores.map((score, index) => (
              <motion.div
                key={score.entityId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <RiskScoreCard data={score} onViewDetails={() => handleViewDetails(score)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent>
              <div className="text-center text-neutral-500">
                <Shield className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                <p className="text-lg font-medium">No entities found</p>
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

