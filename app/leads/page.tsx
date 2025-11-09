'use client'

import React, { useState, useMemo } from 'react'
import { mockLeads } from '@/lib/mock-data/leads'
import { Lead, Industry, PipelineStage } from '@/lib/types/lead'
import LeadCard from '@/components/leads/lead-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Plus, Filter, TrendingUp, Users, DollarSign, Target } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const industries: (Industry | 'All')[] = [
  'All',
  'Technology',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Energy',
  'Real Estate',
  'Telecommunications',
  'Consulting',
  'Other',
]

const stages: (PipelineStage | 'All')[] = [
  'All',
  'prospecting',
  'contact_made',
  'meeting_scheduled',
  'proposal_sent',
  'negotiating',
  'onboarding',
  'converted',
  'lost',
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | 'All'>('All')
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'All'>('All')
  const [minAIScore, setMinAIScore] = useState<number>(0)
  const [sortBy, setSortBy] = useState<'score' | 'revenue' | 'date'>('score')

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let leads = [...mockLeads]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      leads = leads.filter(
        (lead) =>
          lead.companyName.toLowerCase().includes(query) ||
          lead.contactName.toLowerCase().includes(query) ||
          lead.contactEmail.toLowerCase().includes(query) ||
          lead.country.toLowerCase().includes(query)
      )
    }

    // Industry filter
    if (selectedIndustry !== 'All') {
      leads = leads.filter((lead) => lead.industry === selectedIndustry)
    }

    // Stage filter
    if (selectedStage !== 'All') {
      leads = leads.filter((lead) => lead.pipelineStage === selectedStage)
    }

    // AI Score filter
    if (minAIScore > 0) {
      leads = leads.filter((lead) => lead.aiScore >= minAIScore)
    }

    // Sort
    leads.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.aiScore - a.aiScore
        case 'revenue':
          return (b.estimatedRevenue || 0) - (a.estimatedRevenue || 0)
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default:
          return 0
      }
    })

    return leads
  }, [searchQuery, selectedIndustry, selectedStage, minAIScore, sortBy])

  // Calculate stats
  const stats = useMemo(() => {
    const totalLeads = filteredLeads.length
    const totalRevenue = filteredLeads.reduce((sum, lead) => sum + (lead.estimatedRevenue || 0), 0)
    const avgAIScore = totalLeads > 0 
      ? Math.round(filteredLeads.reduce((sum, lead) => sum + lead.aiScore, 0) / totalLeads)
      : 0
    const activeLeads = filteredLeads.filter((lead) => lead.status === 'active').length

    return {
      totalLeads,
      totalRevenue,
      avgAIScore,
      activeLeads,
    }
  }, [filteredLeads])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-sans text-4xl font-bold text-neutral-900">Lead Management</h1>
          <p className="mt-2 text-neutral-600">Track and manage your sales pipeline</p>
        </div>
        <Link href="/leads/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add New Lead
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-l-4 border-l-primary-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Leads</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.totalLeads}</p>
                </div>
                <div className="rounded-full bg-primary-100 p-3">
                  <Users className="h-6 w-6 text-primary-600" />
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
                  <p className="text-sm text-neutral-600">Pipeline Value</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
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
          <Card className="border-l-4 border-l-turquoise-500">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Avg AI Score</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.avgAIScore}</p>
                </div>
                <div className="rounded-full bg-turquoise-100 p-3">
                  <TrendingUp className="h-6 w-6 text-turquoise-600" />
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
                  <p className="text-sm text-neutral-600">Active Leads</p>
                  <p className="mt-1 text-3xl font-bold text-neutral-900">{stats.activeLeads}</p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Target className="h-6 w-6 text-orange-600" />
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
            <CardTitle>Filters & Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  placeholder="Search by company, contact, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <Select value={selectedIndustry} onValueChange={(value) => setSelectedIndustry(value as Industry | 'All')}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Stage Filter */}
            <Select value={selectedStage} onValueChange={(value) => setSelectedStage(value as PipelineStage | 'All')}>
              <SelectTrigger>
                <SelectValue placeholder="Pipeline Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage === 'All' ? 'All Stages' : stage.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'score' | 'revenue' | 'date')}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">AI Score (High to Low)</SelectItem>
                <SelectItem value="revenue">Revenue (High to Low)</SelectItem>
                <SelectItem value="date">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Score Slider */}
          <div className="mt-4">
            <label className="text-sm font-medium text-neutral-700">
              Minimum AI Score: <span className="text-primary-600">{minAIScore}</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minAIScore}
              onChange={(e) => setMinAIScore(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedIndustry !== 'All' || selectedStage !== 'All' || minAIScore > 0) && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-neutral-600">Active filters:</span>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-xs"
                >
                  Search: "{searchQuery}" ✕
                </Button>
              )}
              {selectedIndustry !== 'All' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedIndustry('All')}
                  className="text-xs"
                >
                  Industry: {selectedIndustry} ✕
                </Button>
              )}
              {selectedStage !== 'All' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedStage('All')}
                  className="text-xs"
                >
                  Stage: {selectedStage.replace(/_/g, ' ')} ✕
                </Button>
              )}
              {minAIScore > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMinAIScore(0)}
                  className="text-xs"
                >
                  AI Score ≥ {minAIScore} ✕
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedIndustry('All')
                  setSelectedStage('All')
                  setMinAIScore(0)
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            Showing <span className="font-semibold">{filteredLeads.length}</span> lead{filteredLeads.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredLeads.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredLeads.map((lead, index) => (
              <LeadCard key={lead.id} lead={lead} index={index} />
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent>
              <div className="text-center text-neutral-500">
                <Search className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                <p className="text-lg font-medium">No leads found</p>
                <p className="text-sm mt-1">Try adjusting your filters or add a new lead</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

