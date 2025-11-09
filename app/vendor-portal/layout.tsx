'use client'

import { UnifiedNav } from '@/components/layout/unified-nav'
import { Chatbot } from '@/components/ai-chatbot/chatbot'
import { AtmosphericBackground } from '@/components/landing/atmospheric-background'
import { useAuth } from '@/lib/hooks/useAuth'
import { ToastProvider } from '@/components/ui/toast'

export default function VendorPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  // Mock context - in production, this would come from auth/user state
  const chatbotContext = {
    clientId: 'vendor-1',
    clientName: user?.name || 'Vendor',
    onboardingStatus: 'In Progress',
    pendingDocuments: 1,
  }

  return (
    <ToastProvider>
      <AtmosphericBackground variant="light">
        <div className="flex min-h-screen flex-col">
          <UnifiedNav 
            userType="vendor" 
            userName={user?.name || 'Vendor'}
          />
          <main className="flex-1 p-8 md:p-10 lg:p-12">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
          <Chatbot context={chatbotContext} />
        </div>
      </AtmosphericBackground>
    </ToastProvider>
  )
}

