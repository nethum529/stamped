export type MessageSenderType = 'client' | 'employee' | 'system'

export type MessageType = 'text' | 'file' | 'system_notification'

export interface MessageAttachment {
  id: string
  name: string
  fileSize: number
  mimeType: string
  url: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderType: MessageSenderType
  content: string
  type: MessageType
  timestamp: string
  attachments: MessageAttachment[]
  read: boolean
  readAt?: string
}

// Helper functions
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return date.toLocaleDateString()
  } else if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return 'Just now'
  }
}

export function groupMessagesByDate(messages: Message[]): Record<string, Message[]> {
  const grouped: Record<string, Message[]> = {}
  
  messages.forEach(message => {
    const date = new Date(message.timestamp)
    const dateKey = date.toLocaleDateString()
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    
    grouped[dateKey].push(message)
  })
  
  return grouped
}

