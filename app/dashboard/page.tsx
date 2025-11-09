'use client'

import { useState, useEffect } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Timeline } from '@/components/ui/timeline'
import { mockLeads } from '@/lib/mock-data/leads'
import { Lead, getStageDisplayName } from '@/lib/types/lead'
import AIScoreBadge from '@/components/leads/ai-score-badge'
import {
  Users,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  Target,
  DollarSign,
  Calendar,
  TrendingDown,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  // Simulate role detection - in real app, get from auth context
  const userRole = 'relationship_manager' // Mock for now

  // Calculate lead metrics
  const activeLeads = mockLeads.filter((lead) => lead.status === 'active')
  const totalPipelineValue = activeLeads.reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0)
  const avgDealSize = activeLeads.length > 0 ? totalPipelineValue / activeLeads.length : 0
  
  // Conversion rate
  const totalLeads = mockLeads.length
  const convertedLeads = mockLeads.filter((lead) => lead.status === 'converted' || lead.pipelineStage === 'onboarding').length
  const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

  // Top prospects (leads with high AI score in active stages)
  const topProspects = activeLeads
    .filter((lead) => lead.aiScore >= 75)
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 5)

  // Recent leads (last 5 updated)
  const recentLeads = [...activeLeads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  // Upcoming meetings (mock - leads in meeting_scheduled stage)
  const upcomingMeetings = activeLeads
    .filter((lead) => lead.pipelineStage === 'meeting_scheduled')
    .slice(0, 4)

  // Pipeline overview by stage
  const pipelineByStage = activeLeads.reduce((acc, lead) => {
    const stage = lead.pipelineStage
    if (!acc[stage]) {
      acc[stage] = { count: 0, value: 0 }
    }
    acc[stage].count++
    acc[stage].value += lead.estimatedRevenue || 0
    return acc
  }, {} as Record<string, { count: number; value: number }>)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const stats = [
    {
      title: 'Total Pipeline Value',
      value: formatCurrency(totalPipelineValue),
      change: '+15% from last month',
      icon: DollarSign,
      variant: 'success' as const,
      trend: 'up',
    },
    {
      title: 'Active Leads',
      value: activeLeads.length.toString(),
      change: `${upcomingMeetings.length} meetings scheduled`,
      icon: Target,
      variant: 'default' as const,
      trend: 'up',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      change: conversionRate > 20 ? '+2.3% vs avg' : '-1.2% vs avg',
      icon: TrendingUp,
      variant: conversionRate > 20 ? 'success' as const : 'warning' as const,
      trend: conversionRate > 20 ? 'up' : 'down',
    },
    {
      title: 'Avg Deal Size',
      value: formatCurrency(avgDealSize),
      change: '+8% from last quarter',
      icon: TrendingUp,
      variant: 'default' as const,
      trend: 'up',
    },
  ]

  const recentActivity = recentLeads.map((lead) => ({
    id: lead.id,
    title: `${lead.companyName} - ${getStageDisplayName(lead.pipelineStage)}`,
    description: `${lead.contactName} • ${lead.industry}`,
    timestamp: new Date(lead.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    variant: 'default' as const,
  }))

  return (
    <DashboardShell
      title="Dashboard"
      notificationCount={upcomingMeetings.length}
      userRole="relationship_manager"
      userName="Sarah Chen"
    >
      <div className="space-y-8 md:space-y-10">
        {/* welcome message */}
        <div className="animate-fade-in-up">
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-neutral-900">
            Welcome back, Sarah
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Here's your pipeline overview and upcoming activities.
          </p>
        </div>

        {/* stats cards at top */}
        <div className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="transition-all duration-300 hover:shadow-2xl border-neutral-200/50 bg-white/90">
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
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Top Prospects */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-sans text-2xl">Top Prospects</CardTitle>
                <CardDescription>
                  High-value leads with strong conversion potential
                </CardDescription>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProspects.map((lead) => (
                  <Link key={lead.id} href={`/leads/${lead.id}`}>
                    <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:border-primary-300 hover:shadow-md">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {lead.companyName}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-neutral-600">
                            <span>{lead.industry}</span>
                            <span>•</span>
                            <span>{formatCurrency(lead.estimatedRevenue || 0)}</span>
                          </div>
                        </div>
                      </div>
                      <AIScoreBadge score={lead.aiScore} breakdown={lead.aiScoreBreakdown} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-2xl">Upcoming Meetings</CardTitle>
              <CardDescription>{upcomingMeetings.length} scheduled this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingMeetings.length > 0 ? (
                  upcomingMeetings.map((lead) => (
                    <Link key={lead.id} href={`/leads/${lead.id}`}>
                      <div className="rounded-lg border border-neutral-200 p-3 transition-all hover:border-primary-300 hover:shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
                          <Calendar className="h-4 w-4 text-primary-600" />
                          {lead.companyName}
                        </div>
                        <p className="mt-1 text-xs text-neutral-600">
                          {lead.contactName}
                        </p>
                        {lead.expectedCloseDate && (
                          <p className="mt-1 text-xs text-neutral-500">
                            {new Date(lead.expectedCloseDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-neutral-500">No meetings scheduled</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Overview & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pipeline Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-sans text-2xl">Pipeline Overview</CardTitle>
                <CardDescription>Leads by stage</CardDescription>
              </div>
              <Link href="/leads/pipeline">
                <Button variant="ghost" size="sm">
                  View Pipeline
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(pipelineByStage).map(([stage, data]) => (
                  <div key={stage} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
                    <div>
                      <p className="font-medium text-neutral-900">{getStageDisplayName(stage as any)}</p>
                      <p className="text-xs text-neutral-600">{data.count} lead{data.count !== 1 ? 's' : ''}</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">{formatCurrency(data.value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-2xl">Recent Activity</CardTitle>
              <CardDescription>Latest lead updates</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline items={recentActivity} />
            </CardContent>
          </Card>
        </div>

        {/* quick action buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-2xl">Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for relationship managers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/leads/new" className="block">
                <Button variant="outline" className="w-full h-auto flex-col py-6">
                  <Target className="mb-2 h-8 w-8" />
                  <span>Add New Lead</span>
                </Button>
              </Link>
              <Link href="/leads/pipeline" className="block">
                <Button variant="outline" className="w-full h-auto flex-col py-6">
                  <TrendingUp className="mb-2 h-8 w-8" />
                  <span>View Pipeline</span>
                </Button>
              </Link>
              <Link href="/leads" className="block">
                <Button variant="outline" className="w-full h-auto flex-col py-6">
                  <Calendar className="mb-2 h-8 w-8" />
                  <span>Schedule Meeting</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-auto flex-col py-6">
                <CheckCircle className="mb-2 h-8 w-8" />
                <span>Export Report</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

