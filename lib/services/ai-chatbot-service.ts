// Mock AI chatbot service for client portal
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  quickReplies?: string[]
}

export interface ChatbotContext {
  clientId?: string
  clientName?: string
  onboardingStatus?: string
  pendingDocuments?: number
}

class AIChatbotService {
  private context: ChatbotContext = {}

  setContext(context: ChatbotContext) {
    this.context = context
  }

  async sendMessage(userMessage: string): Promise<ChatMessage> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const lowerMessage = userMessage.toLowerCase()

    // Context-aware responses
    let response = ''
    let quickReplies: string[] | undefined

    // Documents
    if (
      lowerMessage.includes('document') ||
      lowerMessage.includes('upload') ||
      lowerMessage.includes('file')
    ) {
      if (this.context.pendingDocuments && this.context.pendingDocuments > 0) {
        response = `You currently have ${this.context.pendingDocuments} pending document(s) that require review. Would you like to view them or upload additional documents?`
        quickReplies = ['View pending documents', 'Upload a document', 'What documents are needed?']
      } else {
        response =
          'All your required documents have been uploaded and approved! If you need to upload additional documents, you can do so in the Documents section.'
        quickReplies = ['Go to Documents', 'What else can you help with?']
      }
    }
    // Onboarding status
    else if (
      lowerMessage.includes('onboard') ||
      lowerMessage.includes('status') ||
      lowerMessage.includes('progress')
    ) {
      response = `Your onboarding status is currently: ${
        this.context.onboardingStatus || 'In Progress'
      }. We're reviewing your submitted documents and will notify you of any updates.`
      quickReplies = ['What documents are needed?', 'How long does approval take?', 'Contact my officer']
    }
    // Timeline/approval time
    else if (
      lowerMessage.includes('long') ||
      lowerMessage.includes('time') ||
      lowerMessage.includes('approval') ||
      lowerMessage.includes('review')
    ) {
      response =
        'Document review typically takes 2-3 business days. For high-priority cases, we offer expedited review within 24 hours. Your assigned compliance officer will keep you updated throughout the process.'
      quickReplies = ['Check my status', 'Contact my officer', 'Anything else?']
    }
    // Officer info
    else if (
      lowerMessage.includes('officer') ||
      lowerMessage.includes('contact') ||
      lowerMessage.includes('help')
    ) {
      response =
        'Your assigned Relationship Manager can be reached via the Messages section. They typically respond within a few hours during business hours (9 AM - 6 PM EST).'
      quickReplies = ['Go to Messages', 'View officer info', 'Ask another question']
    }
    // Greeting
    else if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      response = `Hello${
        this.context.clientName ? ` ${this.context.clientName}` : ''
      }! 👋 I'm your AI assistant. How can I help you today?`
      quickReplies = [
        'Check onboarding status',
        'What documents are needed?',
        'Contact my officer',
      ]
    }
    // Thanks
    else if (
      lowerMessage.includes('thank') ||
      lowerMessage.includes('thanks') ||
      lowerMessage.includes('appreciate')
    ) {
      response = "You're welcome! Is there anything else I can help you with?"
      quickReplies = ['Check my status', 'Upload documents', 'No, I'm good']
    }
    // Default response
    else {
      response =
        "I can help you with questions about your onboarding status, required documents, approval timelines, and connecting with your compliance officer. What would you like to know?"
      quickReplies = [
        'Onboarding status',
        'Required documents',
        'Contact officer',
      ]
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      quickReplies,
    }
  }

  getWelcomeMessage(): ChatMessage {
    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `Hello${
        this.context.clientName ? ` ${this.context.clientName}` : ''
      }! 👋 I'm your AI assistant. I can help you with:

• Checking your onboarding status
• Understanding document requirements
• Approval timelines
• Connecting with your compliance officer

How can I assist you today?`,
      timestamp: new Date().toISOString(),
      quickReplies: [
        'Check onboarding status',
        'What documents are needed?',
        'Contact my officer',
      ],
    }
  }
}

export const aiChatbotService = new AIChatbotService()

