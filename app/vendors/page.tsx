'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { DashboardShell } from '@/components/layout/dashboard-shell'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Filter, Download, Loader2, X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Vendor } from '@/lib/types/vendor'
import { getVendorStatusColor } from '@/lib/types/vendor'
import { useToast } from '@/components/ui/toast'
import { getUserFriendlyErrorMessage } from '@/lib/utils/error-handling'
import { Modal } from '@/components/ui/modal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const getStatusDisplayName = (status: string): string => {
  const statusMap: Record<string, string> = {
    'approved': 'Approved',
    'active': 'Active',
    'pending': 'Pending',
    'under_review': 'Under Review',
    'rejected': 'Rejected',
    'suspended': 'Suspended',
  }
  return statusMap[status] || status
}

const getRiskBadgeVariant = (level: string) => {
  switch (level) {
    case 'high':
    case 'critical':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'default'
  }
}

export default function VendorsPage() {
  const { user } = useAuth()
  const { showSuccess, showError } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    status: 'all',
    riskLevel: 'all',
    country: 'all',
    category: 'all',
  })

  useEffect(() => {
    async function fetchVendors() {
      try {
        setLoading(true)
        const fetchedVendors = await mockDataService.getVendors()
        setVendors(fetchedVendors)
      } catch (error) {
        console.error('Failed to fetch vendors:', error)
        showError('Failed to load vendors. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchVendors()
  }, [])

  // Apply filters
  const filteredVendors = vendors.filter((vendor) => {
    // Search filter
    const matchesSearch = 
      vendor.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (!matchesSearch) return false

    // Status filter
    if (filters.status !== 'all' && vendor.status !== filters.status) return false
    
    // Risk level filter
    if (filters.riskLevel !== 'all' && vendor.riskLevel !== filters.riskLevel) return false
    
    // Country filter
    if (filters.country !== 'all' && vendor.country !== filters.country) return false
    
    // Category filter
    if (filters.category !== 'all' && vendor.category !== filters.category) return false
    
    return true
  })

  // Get unique values for filter options
  const uniqueCountries = Array.from(new Set(vendors.map(v => v.country))).sort()
  const uniqueCategories = Array.from(new Set(vendors.map(v => v.category))).sort()
  const uniqueStatuses = Array.from(new Set(vendors.map(v => v.status))).sort()
  const uniqueRiskLevels = Array.from(new Set(vendors.map(v => v.riskLevel))).sort()

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    setExporting(true)
    try {
      await mockDataService.exportVendors(format)
      showSuccess(`Vendors exported as ${format.toUpperCase()} successfully`)
    } catch (err) {
      showError(getUserFriendlyErrorMessage(err))
    } finally {
      setExporting(false)
    }
  }

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      riskLevel: 'all',
      country: 'all',
      category: 'all',
    })
    setShowFilterModal(false)
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length

  if (loading) {
    return (
      <DashboardShell title="Vendors" userRole="procurement" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Vendors" userRole="procurement" userName={user?.name || undefined}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Search vendors..."
            onChange={setSearchQuery}
            className="sm:w-96"
          />
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline"
              onClick={() => setShowFilterModal(true)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={exporting || filteredVendors.length === 0}
            >
              {exporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </>
              )}
            </Button>
            <Link href="/vendors/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Vendor
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-medium">{vendor.companyName}</TableCell>
                      <TableCell>{vendor.country}</TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>
                        <Badge variant={getVendorStatusColor(vendor.status)}>
                          {getStatusDisplayName(vendor.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(vendor.riskLevel)}>
                          {vendor.riskLevel.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(vendor.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/vendors/${vendor.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-neutral-500 py-8">
                      No vendors found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Filter Modal */}
        <Modal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          title="Filter Vendors"
          description="Apply filters to refine your vendor list"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-2 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusDisplayName(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-2 block">
                Risk Level
              </label>
              <Select
                value={filters.riskLevel}
                onValueChange={(value) => setFilters({ ...filters, riskLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  {uniqueRiskLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-2 block">
                Country
              </label>
              <Select
                value={filters.country}
                onValueChange={(value) => setFilters({ ...filters, country: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-2 block">
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                disabled={activeFilterCount === 0}
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
              <Button onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardShell>
  )
}
