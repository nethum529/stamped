'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChatInterface } from '@/components/client-portal/chat-interface'
import { mockDataService } from '@/lib/services/mock-data-service'
import { Message } from '@/lib/types/message'
import { motion } from 'framer-motion'

export default function VendorMessagesPage() {
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])

  const currentUserId = 'vendor-001-user'
  const conversationId = 'conv-vendor-001'

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const msgs = await mockDataService.getMessagesByConversationId(conversationId)
        setMessages(msgs)
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    const newMessage = await mockDataService.sendMessage({
      conversationId,
      senderId: currentUserId,
      senderName: 'Vendor User',
      senderType: 'client',
      content,
      attachments: attachments?.map(file => ({
        id: `att-${Date.now()}-${Math.random()}`,
        name: file.name,
        fileSize: file.size,
        mimeType: file.type,
        url: URL.createObjectURL(file),
      })) || [],
    })

    setMessages(prev => [...prev, newMessage])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          Messages
        </h1>
        <p className="text-lg text-neutral-600">
          Communicate with your assigned compliance officer
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="h-[calc(100vh-16rem)] overflow-hidden">
          <ChatInterface
            messages={messages}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
          />
        </Card>
      </motion.div>
    </div>
  )
}

