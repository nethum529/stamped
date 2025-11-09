'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, X } from 'lucide-react'
import { Message } from '@/lib/types/message'
import { formatMessageTime } from '@/lib/types/message'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  messages: Message[]
  currentUserId: string
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>
}

export function ChatInterface({ messages, currentUserId, onSendMessage }: ChatInterfaceProps) {
  const [messageText, setMessageText] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!messageText.trim() && attachments.length === 0) return

    setSending(true)
    try {
      await onSendMessage(messageText, attachments)
      setMessageText('')
      setAttachments([])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-neutral-600">No messages yet</p>
              <p className="text-sm text-neutral-500 mt-1">
                Start a conversation with your compliance officer
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUserId
            const isSystem = message.senderType === 'system'

            if (isSystem) {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="rounded-lg bg-neutral-100 px-3 py-2 text-xs text-neutral-600">
                    {message.content}
                  </div>
                </div>
              )
            }

            return (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  isCurrentUser ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                    isCurrentUser ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-700'
                  )}>
                    {message.senderName.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Message Content */}
                <div className={cn(
                  'flex flex-col space-y-1 max-w-[70%]',
                  isCurrentUser ? 'items-end' : 'items-start'
                )}>
                  <div className={cn(
                    'rounded-lg px-4 py-2',
                    isCurrentUser
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-900'
                  )}>
                    {!isCurrentUser && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {message.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className={cn(
                              'flex items-center gap-2 rounded px-2 py-1 text-xs',
                              isCurrentUser ? 'bg-primary-500' : 'bg-neutral-200'
                            )}
                          >
                            <Paperclip className="h-3 w-3" />
                            <span className="truncate">{attachment.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500 px-1">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-200 bg-white p-4">
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2"
              >
                <Paperclip className="h-4 w-4 text-neutral-600" />
                <span className="text-sm text-neutral-700 truncate max-w-[200px]">
                  {file.name}
                </span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={sending}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={(!messageText.trim() && attachments.length === 0) || sending}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        <p className="mt-2 text-xs text-neutral-500">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  )
}

