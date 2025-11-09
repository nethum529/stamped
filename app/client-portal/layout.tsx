'use client'

import { ClientNav } from '@/components/client-portal/client-nav'
import { Chatbot } from '@/components/ai-chatbot/chatbot'

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Mock context - in production, this would come from auth/user state
  const chatbotContext = {
    clientId: 'client-1',
    clientName: 'Global Innovations Inc.',
    onboardingStatus: 'In Progress',
    pendingDocuments: 1,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100/50">
      <ClientNav />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Chatbot context={chatbotContext} />
    </div>
  )
}

