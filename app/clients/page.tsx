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
import { Plus, Filter, Download, Loader2 } from 'lucide-react'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Client } from '@/lib/types/client'
import { useAuth } from '@/lib/hooks/useAuth'

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'outline'
    case 'suspended':
      return 'warning'
    default:
      return 'default'
  }
}

const getRiskBadgeVariant = (level: string) => {
  switch (level) {
    case 'critical':
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'success'
    default:
      return 'default'
  }
}

const getLifecycleStageDisplay = (stage: string) => {
  const stages: Record<string, string> = {
    lead: 'Lead',
    prospect: 'Prospect',
    onboarding: 'Onboarding',
    active: 'Active',
    dormant: 'Dormant',
    churned: 'Churned',
  }
  return stages[stage] || stage
}

export default function ClientsPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch clients on mount
  useEffect(() => {
    async function fetchClients() {
      try {
        const fetchedClients = await mockDataService.getClients()
        setClients(fetchedClients)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClients()
  }, [])

  const filteredClients = clients.filter((client) =>
    client.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <DashboardShell title="Clients" userRole="compliance" userName={user?.name || undefined}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Clients" userRole="compliance" userName={user?.name || undefined}>
      <div className="space-y-6">
        {/* action buttons and search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Search clients..."
            onChange={setSearchQuery}
            className="sm:w-96"
          />
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Link href="/clients/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Client
              </Button>
            </Link>
          </div>
        </div>

        {/* clients table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.companyName}</TableCell>
                    <TableCell>{client.country}</TableCell>
                    <TableCell>{client.industry}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(client.status)}>
                        {getLifecycleStageDisplay(client.lifecycleStage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(client.riskLevel)}>
                        {client.riskLevel.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(client.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/clients/${client.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredClients.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-neutral-500">No clients found</p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}

