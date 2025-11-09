import { DashboardShell } from '@/components/layout/dashboard-shell'

export default function RiskAnalystLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell
      title="Risk Analysis"
      notificationCount={2}
      userRole="risk_analyst"
      userName="Charlie Brown"
    >
      {children}
    </DashboardShell>
  )
}

