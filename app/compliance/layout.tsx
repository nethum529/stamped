import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function ComplianceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      title="Compliance"
      notificationCount={3}
      userRole="compliance_officer"
      userName="Bob Johnson"
    >
      {children}
    </DashboardShell>
  )
}

