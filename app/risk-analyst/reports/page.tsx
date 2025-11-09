'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

type ReportType = 'risk_summary' | 'compliance' | 'adverse_media' | 'sanctions' | 'geographic' | 'custom'
type ReportStatus = 'completed' | 'pending' | 'scheduled'

interface Report {
  id: string
  name: string
  type: ReportType
  status: ReportStatus
  createdDate: string
  scheduledDate?: string
  format: 'PDF' | 'Excel' | 'CSV'
  size: string
}

export default function RiskReportsPage() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Mock reports data
  const reports: Report[] = [
    {
      id: 'rep-001',
      name: 'Q4 2025 Risk Summary Report',
      type: 'risk_summary',
      status: 'completed',
      createdDate: '2025-11-01',
      format: 'PDF',
      size: '2.4 MB',
    },
    {
      id: 'rep-002',
      name: 'Monthly Compliance Review - November',
      type: 'compliance',
      status: 'completed',
      createdDate: '2025-11-05',
      format: 'PDF',
      size: '1.8 MB',
    },
    {
      id: 'rep-003',
      name: 'Adverse Media Monitoring Report',
      type: 'adverse_media',
      status: 'pending',
      createdDate: '2025-11-08',
      format: 'PDF',
      size: 'N/A',
    },
    {
      id: 'rep-004',
      name: 'Sanctions Screening Summary',
      type: 'sanctions',
      status: 'completed',
      createdDate: '2025-10-28',
      format: 'Excel',
      size: '856 KB',
    },
    {
      id: 'rep-005',
      name: 'Geographic Risk Distribution',
      type: 'geographic',
      status: 'completed',
      createdDate: '2025-10-15',
      format: 'PDF',
      size: '3.1 MB',
    },
    {
      id: 'rep-006',
      name: 'Weekly Risk Assessment - Nov 15',
      type: 'risk_summary',
      status: 'scheduled',
      createdDate: '2025-11-08',
      scheduledDate: '2025-11-15',
      format: 'PDF',
      size: 'N/A',
    },
  ]

  const reportTypes = [
    { value: 'risk_summary', label: 'Risk Summary' },
    { value: 'compliance', label: 'Compliance Review' },
    { value: 'adverse_media', label: 'Adverse Media' },
    { value: 'sanctions', label: 'Sanctions Screening' },
    { value: 'geographic', label: 'Geographic Analysis' },
    { value: 'custom', label: 'Custom Report' },
  ]

  const filteredReports = reports.filter((report) => {
    const typeMatch = selectedType === 'all' || report.type === selectedType
    const statusMatch = selectedStatus === 'all' || report.status === selectedStatus
    return typeMatch && statusMatch
  })

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="mr-1 h-3 w-3" />
          Completed
        </Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
          <Calendar className="mr-1 h-3 w-3" />
          Scheduled
        </Badge>
    }
  }

  const handleGenerateReport = (type: ReportType) => {
    alert(`Generating ${type} report...\n\nIn production, this would trigger report generation with customizable parameters.`)
  }

  const handleDownloadReport = (report: Report) => {
    alert(`Downloading ${report.name} (${report.format})\n\nIn production, this would download the report file.`)
  }

  const stats = [
    {
      label: 'Total Reports',
      value: reports.length.toString(),
      icon: FileText,
      color: 'bg-primary-100 text-primary-600',
    },
    {
      label: 'Completed',
      value: reports.filter((r) => r.status === 'completed').length.toString(),
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending',
      value: reports.filter((r) => r.status === 'pending').length.toString(),
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Scheduled',
      value: reports.filter((r) => r.status === 'scheduled').length.toString(),
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-sans text-4xl font-bold text-neutral-900">Risk Reports</h1>
        <p className="mt-2 text-neutral-600">Generate, schedule, and download risk analysis reports</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-neutral-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={cn('rounded-lg p-3', stat.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Generate New Report</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Create custom risk analysis reports</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {reportTypes.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                className="h-auto flex-col py-6"
                onClick={() => handleGenerateReport(type.value as ReportType)}
              >
                <BarChart3 className="mb-2 h-8 w-8" />
                <span>{type.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-neutral-600" />
            <CardTitle>Filter Reports</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Available Reports</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">
            Showing {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100">
                    <FileText className="h-6 w-6 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-neutral-900">{report.name}</h4>
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-600">
                      <span>Format: {report.format}</span>
                      <span>•</span>
                      <span>Size: {report.size}</span>
                      <span>•</span>
                      <span>
                        {report.status === 'scheduled' && report.scheduledDate
                          ? `Scheduled: ${new Date(report.scheduledDate).toLocaleDateString()}`
                          : `Created: ${new Date(report.createdDate).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                </div>
                {report.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadReport(report)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
                {report.status === 'scheduled' && (
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Reschedule
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="font-sans text-2xl">Automated Report Schedule</CardTitle>
          <p className="text-sm text-neutral-600 mt-1">Configure recurring report generation</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Weekly Risk Summary</p>
                <p className="text-sm text-neutral-600">Every Monday at 9:00 AM</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Disable</Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200">
              <div>
                <p className="font-medium text-neutral-900">Monthly Compliance Review</p>
                <p className="text-sm text-neutral-600">1st of each month at 8:00 AM</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Disable</Button>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Add New Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

