import { Message } from './message'

export type ConversationType = 'client_employee' | 'internal' | 'group'

export interface ConversationParticipant {
  id: string
  name: string
  type: 'client' | 'employee'
  role?: string
  avatar?: string
  lastSeen?: string
  isOnline: boolean
}

export interface Conversation {
  id: string
  type: ConversationType
  clientId?: string
  participants: ConversationParticipant[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
  title?: string
  archived: boolean
}

// Helper functions
export function getConversationTitle(conversation: Conversation, currentUserId: string): string {
  if (conversation.title) {
    return conversation.title
  }
  
  // For 1-on-1 conversations, show the other participant's name
  const otherParticipants = conversation.participants.filter(p => p.id !== currentUserId)
  
  if (otherParticipants.length === 1) {
    return otherParticipants[0].name
  }
  
  if (otherParticipants.length > 1) {
    return otherParticipants.map(p => p.name).join(', ')
  }
  
  return 'Conversation'
}

export function isParticipantTyping(conversation: Conversation, userId: string): boolean {
  // This would be implemented with real-time data
  // For now, returning false
  return false
}

export function getUnreadMessageCount(conversations: Conversation[]): number {
  return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
}

