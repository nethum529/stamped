'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import { RiskScoreData } from '@/components/compliance/risk-score-card'
import Link from 'next/link'
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Globe,
  Building2,
  ArrowRight,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function RiskAnalystDashboardPage() {
  // Calculate risk statistics
  const stats = {
    total: mockRiskScores.length,
    critical: mockRiskScores.filter((s) => s.riskLevel === 'Critical').length,
    high: mockRiskScores.filter((s) => s.riskLevel === 'High').length,
    medium: mockRiskScores.filter((s) => s.riskLevel === 'Medium').length,
    low: mockRiskScores.filter((s) => s.riskLevel === 'Low').length,
    avgScore: Math.round(mockRiskScores.reduce((sum, s) => sum + s.overallScore, 0) / mockRiskScores.length),
    clients: mockRiskScores.filter((s) => s.entityType === 'client').length,
    vendors: mockRiskScores.filter((s) => s.entityType === 'vendor').length,
  }

  // High-risk entities
  const highRiskEntities = mockRiskScores
    .filter((s) => s.riskLevel === 'Critical' || s.riskLevel === 'High')
    .sort((a, b) => b.overallScore - a.overallScore)
    .slice(0, 6)

  // Risk distribution by category
  const riskDistribution = [
    { label: 'Critical', value: stats.critical, color: 'bg-red-500', percentage: (stats.critical / stats.total) * 100 },
    { label: 'High', value: stats.high, color: 'bg-orange-500', percentage: (stats.high / stats.total) * 100 },
    { label: 'Medium', value: stats.medium, color: 'bg-yellow-500', percentage: (stats.medium / stats.total) * 100 },
    { label: 'Low', value: stats.low, color: 'bg-green-500', percentage: (stats.low / stats.total) * 100 },
  ]

  // Geographic risk distribution (mock data)
  const geographicRisk = [
    { region: 'North America', riskScore: 25, entities: 4, trend: 'down' },
    { region: 'Europe', riskScore: 38, entities: 3, trend: 'up' },
    { region: 'Asia Pacific', riskScore: 52, entities: 2, trend: 'up' },
    { region: 'Middle East', riskScore: 68, entities: 1, trend: 'neutral' },
  ]

  // Risk trend data (mock)
  const trendData = [
    { month: 'Jun', score: 42 },
    { month: 'Jul', score: 38 },
    { month: 'Aug', score: 45 },
    { month: 'Sep', score: 41 },
    { month: 'Oct', score: 39 },
    { month: 'Nov', score: stats.avgScore },
  ]

  const statCards = [
    {
      title: 'Total Entities',
      value: stats.total.toString(),
      change: `${stats.clients} clients, ${stats.vendors} vendors`,
      icon: Building2,
      variant: 'default' as const,
    },
    {
      title: 'Critical Risk',
      value: stats.critical.toString(),
      change: 'Requires immediate action',
      icon: AlertTriangle,
      variant: 'error' as const,
    },
    {
      title: 'High Risk',
      value: stats.high.toString(),
      change: 'Enhanced monitoring',
      icon: Shield,
      variant: 'warning' as const,
    },
    {
      title: 'Average Risk Score',
      value: stats.avgScore.toString(),
      change: trendData[4].score < stats.avgScore ? '+2 vs last month' : '-3 vs last month',
      icon: trendData[4].score < stats.avgScore ? TrendingUp : TrendingDown,
      variant: trendData[4].score < stats.avgScore ? ('warning' as const) : ('success' as const),
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Risk Analysis Dashboard</h1>
        <p className="mt-2 text-neutral-600">Monitor risk metrics, trends, and geographic distribution</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-600">{stat.title}</p>
                      <p className="mt-2 text-3xl font-bold text-neutral-900">{stat.value}</p>
                      <p className="mt-1 text-xs text-neutral-500">{stat.change}</p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg p-3',
                        stat.variant === 'error' && 'bg-red-100 text-red-600',
                        stat.variant === 'warning' && 'bg-orange-100 text-orange-600',
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

      {/* Risk Distribution & Trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Risk Distribution</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Breakdown by risk level</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskDistribution.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-neutral-900">{item.label}</span>
                    <span className="text-neutral-600">
                      {item.value} ({item.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full', item.color)}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Trend Chart (Mock) */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Risk Trend</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Average risk score over time</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {trendData.map((data, index) => (
                <motion.div
                  key={data.month}
                  className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-1 flex flex-col justify-end w-full">
                    <motion.div
                      className={cn(
                        'w-full rounded-t-lg',
                        data.score >= 60 ? 'bg-red-500' :
                        data.score >= 40 ? 'bg-orange-500' :
                        data.score >= 30 ? 'bg-yellow-500' :
                        'bg-green-500'
                      )}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.score / 100) * 200}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">{data.month}</p>
                  <p className="text-xs font-semibold text-neutral-900">{data.score}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Risk Entities & Geographic Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* High-Risk Entities */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-sans text-2xl">High-Risk Entities</CardTitle>
              <p className="text-sm text-neutral-600 mt-1">Critical and high risk requiring attention</p>
            </div>
            <Link href="/compliance/risk-assessment">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskEntities.map((entity) => (
                <div
                  key={entity.entityId}
                  className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:border-red-300 hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        entity.riskLevel === 'Critical' && 'bg-red-100 text-red-600',
                        entity.riskLevel === 'High' && 'bg-orange-100 text-orange-600'
                      )}
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">{entity.entityName}</p>
                      <div className="flex items-center gap-2 text-xs text-neutral-600 mt-1">
                        <span>{entity.entityType === 'client' ? 'Client' : 'Vendor'}</span>
                        <span>•</span>
                        <span>Score: {entity.overallScore}</span>
                        <span>•</span>
                        <span>{entity.flags.length} flag{entity.flags.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs font-medium',
                      entity.riskLevel === 'Critical' && 'bg-red-100 text-red-800 border-red-300',
                      entity.riskLevel === 'High' && 'bg-orange-100 text-orange-800 border-orange-300'
                    )}
                  >
                    {entity.riskLevel}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Geographic Risk</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Risk by region</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicRisk.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-lg border border-neutral-200 p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-neutral-600" />
                      <span className="text-sm font-medium text-neutral-900">{region.region}</span>
                    </div>
                    {region.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                    {region.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-600 mb-2">
                    <span>{region.entities} entities</span>
                    <span className={cn(
                      'font-semibold',
                      region.riskScore >= 60 && 'text-red-600',
                      region.riskScore >= 40 && region.riskScore < 60 && 'text-orange-600',
                      region.riskScore < 40 && 'text-green-600'
                    )}>
                      Risk: {region.riskScore}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      className={cn(
                        'h-full',
                        region.riskScore >= 60 ? 'bg-red-500' :
                        region.riskScore >= 40 ? 'bg-orange-500' :
                        'bg-green-500'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${region.riskScore}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Quick Actions</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Common risk analyst tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/compliance/risk-assessment" className="block">
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <Shield className="mb-2 h-8 w-8" />
                <span>View All Entities</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-auto flex-col py-6">
              <AlertTriangle className="mb-2 h-8 w-8" />
              <span>Critical Alerts</span>
            </Button>
            <Button variant="outline" className="w-full h-auto flex-col py-6">
              <BarChart3 className="mb-2 h-8 w-8" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="w-full h-auto flex-col py-6">
              <TrendingUp className="mb-2 h-8 w-8" />
              <span>Risk Trends</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

