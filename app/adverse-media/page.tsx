'use client'

import { useState } from 'react'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  AlertTriangle,
  ExternalLink,
  Calendar,
  TrendingUp,
  FileText,
  Download,
} from 'lucide-react'

export default function AdverseMediaPage() {
  const [entityName, setEntityName] = useState('')
  const [dateRange, setDateRange] = useState('30')
  const [loading, setLoading] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleSearch = () => {
    setLoading(true)
    setSearchPerformed(false)

    // simulate api call, replace with real news api integration
    setTimeout(() => {
      setLoading(false)
      setSearchPerformed(true)
      
      // mock results for demo, will use real api later
      if (entityName.toLowerCase().includes('acme')) {
        setResults([
          {
            id: '1',
            title: 'Acme Corp Faces Lawsuit Over Data Breach',
            source: 'TechNews Daily',
            date: '2024-01-10',
            url: 'https://example.com/news1',
            severity: 'high',
            summary: 'Company faces class action lawsuit following major data breach affecting 50,000 customers.',
            keywords: ['lawsuit', 'data breach', 'security'],
          },
          {
            id: '2',
            title: 'Acme Corporation Settles Regulatory Dispute',
            source: 'Financial Times',
            date: '2024-01-05',
            url: 'https://example.com/news2',
            severity: 'medium',
            summary: 'Settlement reached with regulatory authorities over compliance violations.',
            keywords: ['regulatory', 'settlement', 'compliance'],
          },
        ])
      } else {
        setResults([])
      }
    }, 2000)
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'outline'
      default:
        return 'default'
    }
  }

  const recentReports = [
    {
      id: '1',
      entityName: 'Acme Corporation',
      date: '2024-01-15',
      findings: 2,
      severity: 'high',
    },
    {
      id: '2',
      entityName: 'Global Solutions LLC',
      date: '2024-01-14',
      findings: 0,
      severity: 'low',
    },
    {
      id: '3',
      entityName: 'TechStart Inc',
      date: '2024-01-13',
      findings: 1,
      severity: 'medium',
    },
  ]

  return (
    <DashboardShell
      title="Adverse Media Monitoring"
      userRole="compliance"
      userName="John Smith"
    >
      <div className="space-y-6">
        {/* search form for adverse media */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Adverse Media Report</CardTitle>
            <CardDescription>
              Search for negative news and adverse media about clients and vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Input
                    label="Entity Name"
                    placeholder="Enter client or vendor name"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    required
                  />
                </div>
                <Select
                  label="Date Range"
                  options={[
                    { value: '7', label: 'Last 7 days' },
                    { value: '30', label: 'Last 30 days' },
                    { value: '90', label: 'Last 90 days' },
                    { value: '365', label: 'Last year' },
                    { value: 'all', label: 'All time' },
                  ]}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSearch}
                loading={loading}
                disabled={!entityName}
                size="lg"
                className="w-full md:w-auto"
              >
                <Search className="mr-2 h-5 w-5" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* show loading spinner */}
        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        )}

        {/* show results */}
        {!loading && searchPerformed && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Adverse Media Report</CardTitle>
                  <CardDescription>
                    Results for "{entityName}" in the last {dateRange} days
                  </CardDescription>
                </div>
                {results.length > 0 && (
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <EmptyState
                  icon={<FileText className="h-16 w-16" />}
                  title="No Adverse Media Found"
                  description={`No negative news or adverse media was found for "${entityName}" in the selected time period.`}
                />
              ) : (
                <div className="space-y-6">
                  {/* summary of findings */}
                  <Alert variant="warning" title="Findings Summary">
                    Found {results.length} adverse media item{results.length !== 1 ? 's' : ''} that
                    require review before proceeding with approval.
                  </Alert>

                  {/* list of results */}
                  <div className="space-y-4">
                    {results.map((result) => (
                      <div
                        key={result.id}
                        className="rounded-xl border-2 border-neutral-200 p-6 transition-all hover:border-neutral-300 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <AlertTriangle
                                  className={`h-5 w-5 ${
                                    result.severity === 'high'
                                      ? 'text-error-600'
                                      : result.severity === 'medium'
                                      ? 'text-warning-600'
                                      : 'text-neutral-600'
                                  }`}
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-neutral-900">
                                  {result.title}
                                </h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Badge variant={getSeverityBadgeVariant(result.severity)}>
                                    {result.severity.toUpperCase()} SEVERITY
                                  </Badge>
                                  {result.keywords.map((keyword: string) => (
                                    <Badge key={keyword} variant="outline">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="mt-3 text-sm text-neutral-700">
                                  {result.summary}
                                </p>
                                <div className="mt-4 flex items-center gap-4 text-sm text-neutral-600">
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    {result.source}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {result.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-300 h-9 px-3 text-sm border-2 border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 hover:border-neutral-400 hover:-translate-y-0.5 active:bg-neutral-100 shadow-sm hover:shadow-md"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Source
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* action buttons */}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Save Report</Button>
                    <Button>Mark as Reviewed</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* recent reports list */}
        {!searchPerformed && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Previously generated adverse media reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 p-4 transition-all hover:border-neutral-300"
                  >
                    <div>
                      <p className="font-medium text-neutral-900">
                        {report.entityName}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">
                        Generated on {report.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {report.findings === 0 ? (
                        <Badge variant="success">No Findings</Badge>
                      ) : (
                        <Badge variant={getSeverityBadgeVariant(report.severity)}>
                          {report.findings} Finding{report.findings !== 1 ? 's' : ''}
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">
                        View Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}

