import { Lead, PipelineStage, Industry } from '@/lib/types/lead'
import { Client, LifecycleStage, ClientStatus } from '@/lib/types/client'
import { Document, DocumentStatus } from '@/lib/types/document'
import { Message } from '@/lib/types/message'
import { Conversation } from '@/lib/types/conversation'
import { mock

Leads } from '@/lib/mock-data/leads'
import { mockDocuments } from '@/lib/mock-data/documents'
import { mockMessages, mockConversations } from '@/lib/mock-data/messages'

// Simulate API delay
const API_DELAY = 500 // ms

function delay(ms: number = API_DELAY): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock data service - simulates backend API calls
export class MockDataService {
  // ====================
  // LEADS
  // ====================
  
  async getLeads(): Promise<Lead[]> {
    await delay()
    return mockLeads
  }
  
  async getLeadById(id: string): Promise<Lead | null> {
    await delay()
    return mockLeads.find(lead => lead.id === id) || null
  }
  
  async getLeadsByStage(stage: PipelineStage): Promise<Lead[]> {
    await delay()
    return mockLeads.filter(lead => lead.pipelineStage === stage)
  }
  
  async getLeadsByAssignee(assigneeId: string): Promise<Lead[]> {
    await delay()
    return mockLeads.filter(lead => lead.assignedTo === assigneeId)
  }
  
  async searchLeads(query: string): Promise<Lead[]> {
    await delay()
    const lowercaseQuery = query.toLowerCase()
    return mockLeads.filter(lead => 
      lead.companyName.toLowerCase().includes(lowercaseQuery) ||
      lead.contactName.toLowerCase().includes(lowercaseQuery) ||
      lead.contactEmail.toLowerCase().includes(lowercaseQuery)
    )
  }
  
  async filterLeads(filters: {
    stage?: PipelineStage
    industry?: Industry
    country?: string
    minScore?: number
    maxScore?: number
  }): Promise<Lead[]> {
    await delay()
    
    let filtered = [...mockLeads]
    
    if (filters.stage) {
      filtered = filtered.filter(lead => lead.pipelineStage === filters.stage)
    }
    
    if (filters.industry) {
      filtered = filtered.filter(lead => lead.industry === filters.industry)
    }
    
    if (filters.country) {
      filtered = filtered.filter(lead => lead.country === filters.country)
    }
    
    if (filters.minScore !== undefined) {
      filtered = filtered.filter(lead => lead.aiScore >= filters.minScore!)
    }
    
    if (filters.maxScore !== undefined) {
      filtered = filtered.filter(lead => lead.aiScore <= filters.maxScore!)
    }
    
    return filtered
  }
  
  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    await delay()
    // In a real app, this would save to database
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      companyName: leadData.companyName || '',
      industry: leadData.industry || 'Other',
      country: leadData.country || '',
      contactEmail: leadData.contactEmail || '',
      contactPhone: leadData.contactPhone || '',
      contactName: leadData.contactName || '',
      status: 'active',
      pipelineStage: 'prospecting',
      aiScore: leadData.aiScore || 50,
      aiScoreBreakdown: leadData.aiScoreBreakdown || {
        companySize: 50,
        industry: 50,
        geography: 50,
        contactQuality: 50,
        overall: 50,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: leadData.assignedTo || '',
      assignedToName: leadData.assignedToName || '',
      notes: leadData.notes || '',
      activities: [],
      ...leadData,
    }
    return newLead
  }
  
  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    await delay()
    const lead = mockLeads.find(l => l.id === id)
    if (!lead) return null
    
    return {
      ...lead,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
  }
  
  // ====================
  // CLIENTS
  // ====================
  
  async getClients(): Promise<Client[]> {
    await delay()
    // For now, return empty array - will be populated with converted leads
    return []
  }
  
  async getClientById(id: string): Promise<Client | null> {
    await delay()
    // Will be implemented when we have client data
    return null
  }
  
  async getClientsByLifecycleStage(stage: LifecycleStage): Promise<Client[]> {
    await delay()
    return []
  }
  
  async getClientsByStatus(status: ClientStatus): Promise<Client[]> {
    await delay()
    return []
  }
  
  // ====================
  // DOCUMENTS
  // ====================
  
  async getDocuments(): Promise<Document[]> {
    await delay()
    return mockDocuments
  }
  
  async getDocumentById(id: string): Promise<Document | null> {
    await delay()
    return mockDocuments.find(doc => doc.id === id) || null
  }
  
  async getDocumentsByClientId(clientId: string): Promise<Document[]> {
    await delay()
    return mockDocuments.filter(doc => doc.clientId === clientId)
  }
  
  async getDocumentsByStatus(status: DocumentStatus): Promise<Document[]> {
    await delay()
    return mockDocuments.filter(doc => doc.status === status)
  }
  
  async uploadDocument(documentData: Partial<Document>): Promise<Document> {
    await delay(1000) // Longer delay for upload simulation
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      clientId: documentData.clientId || '',
      type: documentData.type || 'other',
      name: documentData.name || '',
      fileName: documentData.fileName || '',
      fileSize: documentData.fileSize || 0,
      mimeType: documentData.mimeType || 'application/pdf',
      status: 'uploaded',
      uploadedBy: documentData.uploadedBy || '',
      uploadedByName: documentData.uploadedByName || '',
      uploadedAt: new Date().toISOString(),
      url: documentData.url || '',
      thumbnailUrl: documentData.thumbnailUrl,
      annotations: [],
      comments: [],
      isRequired: documentData.isRequired || false,
      version: 1,
      ...documentData,
    }
    
    return newDocument
  }
  
  async updateDocumentStatus(
    id: string, 
    status: DocumentStatus, 
    reviewerId?: string,
    reviewerName?: string,
    comments?: string[]
  ): Promise<Document | null> {
    await delay()
    
    const document = mockDocuments.find(doc => doc.id === id)
    if (!document) return null
    
    return {
      ...document,
      status,
      reviewedBy: reviewerId,
      reviewedByName: reviewerName,
      reviewedAt: new Date().toISOString(),
      comments: comments || document.comments,
    }
  }
  
  // ====================
  // MESSAGES & CONVERSATIONS
  // ====================
  
  async getConversations(userId?: string): Promise<Conversation[]> {
    await delay()
    
    if (userId) {
      return mockConversations.filter(conv => 
        conv.participants.some(p => p.id === userId)
      )
    }
    
    return mockConversations
  }
  
  async getConversationById(id: string): Promise<Conversation | null> {
    await delay()
    return mockConversations.find(conv => conv.id === id) || null
  }
  
  async getMessagesByConversationId(conversationId: string): Promise<Message[]> {
    await delay()
    return mockMessages.filter(msg => msg.conversationId === conversationId)
  }
  
  async sendMessage(messageData: Partial<Message>): Promise<Message> {
    await delay(300) // Shorter delay for messages
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: messageData.conversationId || '',
      senderId: messageData.senderId || '',
      senderName: messageData.senderName || '',
      senderType: messageData.senderType || 'client',
      content: messageData.content || '',
      type: 'text',
      timestamp: new Date().toISOString(),
      attachments: messageData.attachments || [],
      read: false,
    }
    
    return newMessage
  }
  
  async markMessageAsRead(messageId: string): Promise<Message | null> {
    await delay(100) // Very quick operation
    
    const message = mockMessages.find(msg => msg.id === messageId)
    if (!message) return null
    
    return {
      ...message,
      read: true,
      readAt: new Date().toISOString(),
    }
  }
  
  async markConversationAsRead(conversationId: string): Promise<boolean> {
    await delay(100)
    return true // Success
  }
  
  // ====================
  // STATISTICS & ANALYTICS
  // ====================
  
  async getLeadStatistics() {
    await delay()
    
    const totalLeads = mockLeads.length
    const activeLeads = mockLeads.filter(l => l.status === 'active').length
    const convertedLeads = mockLeads.filter(l => l.pipelineStage === 'converted').length
    const lostLeads = mockLeads.filter(l => l.status === 'lost').length
    
    const stageDistribution = mockLeads.reduce((acc, lead) => {
      acc[lead.pipelineStage] = (acc[lead.pipelineStage] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const averageScore = mockLeads.reduce((sum, lead) => sum + lead.aiScore, 0) / totalLeads
    
    return {
      totalLeads,
      activeLeads,
      convertedLeads,
      lostLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
      stageDistribution,
      averageScore: Math.round(averageScore),
    }
  }
  
  async getDocumentStatistics() {
    await delay()
    
    const totalDocuments = mockDocuments.length
    const pending = mockDocuments.filter(d => d.status === 'pending_upload').length
    const uploaded = mockDocuments.filter(d => d.status === 'uploaded').length
    const underReview = mockDocuments.filter(d => d.status === 'under_review').length
    const approved = mockDocuments.filter(d => d.status === 'approved').length
    const rejected = mockDocuments.filter(d => d.status === 'rejected').length
    const expired = mockDocuments.filter(d => d.status === 'expired').length
    
    return {
      totalDocuments,
      pending,
      uploaded,
      underReview,
      approved,
      rejected,
      expired,
      approvalRate: totalDocuments > 0 ? (approved / totalDocuments) * 100 : 0,
    }
  }
  
  async getUnreadMessageCount(userId: string): Promise<number> {
    await delay(100)
    
    const userConversations = mockConversations.filter(conv => 
      conv.participants.some(p => p.id === userId)
    )
    
    return userConversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }
}

// Export singleton instance
export const mockDataService = new MockDataService()

