'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockLeads } from '@/lib/mock-data/leads'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Shield,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ExecutiveDashboardPage() {
  // Calculate high-level KPIs
  const totalClients = 10 // Mock
  const totalVendors = 5 // Mock
  const activeLeads = mockLeads.filter((l) => l.status === 'active').length
  const totalPipelineValue = mockLeads
    .filter((l) => l.status === 'active')
    .reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0)
  
  const avgOnboardingTime = 14 // days (mock)
  const conversionRate = ((mockLeads.filter((l) => l.status === 'converted').length / mockLeads.length) * 100).toFixed(1)
  
  // Risk distribution
  const criticalRisk = mockRiskScores.filter((s) => s.riskLevel === 'Critical').length
  const highRisk = mockRiskScores.filter((s) => s.riskLevel === 'High').length
  const avgRiskScore = Math.round(mockRiskScores.reduce((sum, s) => sum + s.overallScore, 0) / mockRiskScores.length)

  // Top performers (mock)
  const topPerformers = [
    { name: 'Sarah Chen', role: 'Relationship Manager', deals: 8, value: 1200000 },
    { name: 'Michael Torres', role: 'Relationship Manager', deals: 6, value: 950000 },
    { name: 'Lisa Wang', role: 'Relationship Manager', deals: 7, value: 1100000 },
  ]

  // Revenue trend (mock)
  const revenueTrend = [
    { month: 'Jun', value: 850000 },
    { month: 'Jul', value: 920000 },
    { month: 'Aug', value: 1100000 },
    { month: 'Sep', value: 1050000 },
    { month: 'Oct', value: 1250000 },
    { month: 'Nov', value: totalPipelineValue },
  ]

  const maxRevenue = Math.max(...revenueTrend.map((r) => r.value))

  const kpiCards = [
    {
      title: 'Total Clients',
      value: totalClients.toString(),
      change: '+12% vs last quarter',
      trend: 'up',
      icon: Users,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      title: 'Total Vendors',
      value: totalVendors.toString(),
      change: '+8% vs last quarter',
      trend: 'up',
      icon: Building2,
      color: 'bg-turquoise-100 text-turquoise-600',
    },
    {
      title: 'Active Pipeline',
      value: activeLeads.toString(),
      change: `$${(totalPipelineValue / 1000000).toFixed(1)}M value`,
      trend: 'up',
      icon: Target,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+2.3% vs last month',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Avg Onboarding Time',
      value: `${avgOnboardingTime}d`,
      change: '-3 days vs last month',
      trend: 'down',
      icon: Clock,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Critical Risk Entities',
      value: criticalRisk.toString(),
      change: `${highRisk} high risk`,
      trend: criticalRisk > 0 ? 'up' : 'neutral',
      icon: AlertTriangle,
      color: criticalRisk > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600',
    },
    {
      title: 'Average Risk Score',
      value: avgRiskScore.toString(),
      change: avgRiskScore < 50 ? 'Within acceptable range' : 'Above threshold',
      trend: avgRiskScore < 50 ? 'down' : 'up',
      icon: Shield,
      color: avgRiskScore < 50 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Pipeline Value',
      value: `$${(totalPipelineValue / 1000000).toFixed(1)}M`,
      change: '+15% vs last month',
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Executive Overview</h1>
        <p className="mt-2 text-neutral-600">High-level business metrics and strategic insights</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : null
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={cn('rounded-lg p-3', kpi.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {TrendIcon && (
                      <TrendIcon
                        className={cn(
                          'h-5 w-5',
                          kpi.trend === 'up' && 'text-green-600',
                          kpi.trend === 'down' && 'text-red-600'
                        )}
                      />
                    )}
                  </div>
                  <p className="text-sm font-medium text-neutral-600">{kpi.title}</p>
                  <p className="mt-2 text-3xl font-bold text-neutral-900">{kpi.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{kpi.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Revenue Trend & Risk Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Pipeline Revenue Trend</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">6-month pipeline value trajectory</p>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-3">
              {revenueTrend.map((data, index) => (
                <motion.div
                  key={data.month}
                  className="flex-1 flex flex-col items-center"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex-1 flex flex-col justify-end w-full">
                    <motion.div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-primary-400"
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value / maxRevenue) * 200}px` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-neutral-600 mt-2">{data.month}</p>
                  <p className="text-xs font-semibold text-neutral-900">
                    ${(data.value / 1000000).toFixed(1)}M
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Risk Distribution</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Current risk landscape</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">Critical Risk</span>
                <span className="text-2xl font-bold text-red-600">{criticalRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">High Risk</span>
                <span className="text-2xl font-bold text-orange-600">{highRisk}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">Medium Risk</span>
                <span className="text-2xl font-bold text-yellow-600">
                  {mockRiskScores.filter((s) => s.riskLevel === 'Medium').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">Low Risk</span>
                <span className="text-2xl font-bold text-green-600">
                  {mockRiskScores.filter((s) => s.riskLevel === 'Low').length}
                </span>
              </div>
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-900">Average Risk Score</span>
                  <span
                    className={cn(
                      'text-2xl font-bold',
                      avgRiskScore < 40 ? 'text-green-600' : avgRiskScore < 60 ? 'text-yellow-600' : 'text-red-600'
                    )}
                  >
                    {avgRiskScore}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-sans text-2xl">Top Performers</CardTitle>
            <p className="text-sm text-neutral-600 mt-1">Leading team members this quarter</p>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Q4 2025
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <motion.div
                key={performer.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{performer.name}</p>
                    <p className="text-sm text-neutral-600">{performer.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-neutral-900">
                    ${(performer.value / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-neutral-600">{performer.deals} deals closed</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Strategic Actions</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Key reports and insights</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/executive/insights" className="block">
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <TrendingUp className="mb-2 h-8 w-8" />
                <span>View Insights</span>
              </Button>
            </Link>
            <Link href="/leads/pipeline" className="block">
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <Target className="mb-2 h-8 w-8" />
                <span>Pipeline View</span>
              </Button>
            </Link>
            <Link href="/compliance/risk-assessment" className="block">
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <Shield className="mb-2 h-8 w-8" />
                <span>Risk Overview</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-auto flex-col py-6">
              <BarChart3 className="mb-2 h-8 w-8" />
              <span>Export Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

