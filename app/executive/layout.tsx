import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function ExecutiveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      title="Executive Dashboard"
      notificationCount={1}
      userRole="executive"
      userName="Diana Prince"
    >
      {children}
    </DashboardShell>
  )
}

