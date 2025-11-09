import { Lead, PipelineStage, Industry, Meeting, MeetingType } from '@/lib/types/lead'
import { Client, LifecycleStage, ClientStatus } from '@/lib/types/client'
import { Vendor } from '@/lib/types/vendor'
import { Document, DocumentStatus } from '@/lib/types/document'
import { Message } from '@/lib/types/message'
import { Conversation } from '@/lib/types/conversation'
import { mockLeads } from '@/lib/mock-data/leads'
import { mockClients } from '@/lib/mock-data/clients'
import { mockVendors } from '@/lib/mock-data/vendors'
import { mockDocuments } from '@/lib/mock-data/documents'
import { mockMessages, mockConversations } from '@/lib/mock-data/messages'
import { mockRiskScores } from '@/lib/mock-data/risk-scores'
import { realtimeService } from './realtime-service'
import { assignmentService } from './assignment-service'
import { notificationService } from './notification-service'

// Simulate API delay
const API_DELAY = 500 // ms

function delay(ms: number = API_DELAY): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Local storage keys
const STORAGE_KEYS = {
  LEADS: 'stamped_leads',
  CLIENTS: 'stamped_clients',
  VENDORS: 'stamped_vendors',
  MEETINGS: 'stamped_meetings',
  MESSAGES: 'stamped_messages',
}

// Mock data service - simulates backend API calls
export class MockDataService {
  // ====================
  // LEADS
  // ====================
  
  async getLeads(): Promise<Lead[]> {
    await delay()
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.LEADS)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored leads', e)
        }
      }
    }
    return mockLeads
  }
  
  async getLeadById(id: string): Promise<Lead | null> {
    await delay()
    const leads = await this.getLeads() // Use getLeads to get leads from localStorage
    return leads.find(lead => lead.id === id) || null
  }
  
  async getLeadsByStage(stage: PipelineStage): Promise<Lead[]> {
    await delay()
    const leads = await this.getLeads()
    return leads.filter(lead => lead.pipelineStage === stage)
  }
  
  async getLeadsByAssignee(assigneeId: string): Promise<Lead[]> {
    await delay()
    const leads = await this.getLeads()
    return leads.filter(lead => lead.assignedTo === assigneeId)
  }
  
  async searchLeads(query: string): Promise<Lead[]> {
    await delay()
    const leads = await this.getLeads()
    const lowercaseQuery = query.toLowerCase()
    return leads.filter(lead => 
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
    // Get existing leads
    const existingLeads = await this.getLeads()
    
    // Create new lead
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      companyName: leadData.companyName || '',
      industry: leadData.industry || 'Other',
      country: leadData.country || '',
      contactEmail: leadData.contactEmail || '',
      contactPhone: leadData.contactPhone || '',
      contactName: leadData.contactName || '',
      status: 'active',
      pipelineStage: leadData.pipelineStage || 'prospecting',
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
      assignedTo: leadData.assignedTo || 'emp-001',
      assignedToName: leadData.assignedToName || 'Current User',
      notes: leadData.notes || '',
      activities: [
        {
          id: `${Date.now()}-act-1`,
          type: 'note',
          description: 'Lead added to system',
          timestamp: new Date().toISOString(),
          performedBy: 'Current User',
        },
      ],
      estimatedRevenue: leadData.estimatedRevenue,
      expectedCloseDate: leadData.expectedCloseDate,
      companySize: leadData.companySize,
      website: leadData.website,
      linkedin: leadData.linkedin,
    }
    
    // Add to existing leads
    const updatedLeads = [newLead, ...existingLeads]
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updatedLeads))
    }
    
    return newLead
  }
  
  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    await delay()
    const leads = await this.getLeads()
    const lead = leads.find(l => l.id === id)
    if (!lead) return null
    
    const updatedLead = {
      ...lead,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    
    // Update in storage
    const updatedLeads = leads.map(l => l.id === id ? updatedLead : l)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updatedLeads))
    }
    
    return updatedLead
  }

  async deleteLead(id: string): Promise<boolean> {
    await delay()
    const leads = await this.getLeads()
    const leadIndex = leads.findIndex(l => l.id === id)
    if (leadIndex === -1) return false
    
    // Remove lead from array
    const updatedLeads = leads.filter(l => l.id !== id)
    
    // Update storage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(updatedLeads))
    }
    
    return true
  }

  async convertLeadToClient(leadId: string): Promise<Client | null> {
    await delay()
    const leads = await this.getLeads()
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return null

    // Create client from lead data
    const newClient: Client = {
      id: `client-${Date.now()}`,
      companyName: lead.companyName,
      industry: lead.industry,
      country: lead.country,
      city: undefined,
      address: undefined,
      phone: lead.contactPhone,
      email: lead.contactEmail,
      website: lead.website,
      lifecycleStage: 'onboarding',
      status: 'active',
      lifecycleHistory: [
        {
          id: `history-${Date.now()}`,
          stage: 'onboarding',
          timestamp: new Date().toISOString(),
          changedBy: 'system',
          changedByName: 'System',
          notes: 'Converted from lead',
        },
      ],
      assignedRM: lead.assignedTo,
      assignedRMName: lead.assignedToName,
      assignedOfficer: 'emp-002',
      assignedOfficerName: 'Compliance Officer',
      riskLevel: lead.aiScore >= 70 ? 'high' : lead.aiScore >= 40 ? 'medium' : 'low',
      riskAssessment: {
        overall: lead.aiScore >= 70 ? 'high' : lead.aiScore >= 40 ? 'medium' : 'low',
        sanctionsRisk: Math.round(lead.aiScore * 0.3),
        adverseMediaRisk: Math.round(lead.aiScore * 0.25),
        financialRisk: Math.round(lead.aiScore * 0.2),
        reputationalRisk: Math.round(lead.aiScore * 0.15),
        geographicRisk: Math.round(lead.aiScore * 0.1),
        lastAssessedAt: new Date().toISOString(),
        lastAssessedBy: 'System',
      },
      documents: [],
      requiredDocuments: ['incorporation_certificate', 'proof_of_address', 'identification'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      onboardingStartDate: new Date().toISOString(),
      annualRevenue: lead.estimatedRevenue,
      numberOfEmployees: lead.companySize ? parseInt(lead.companySize) : undefined,
      primaryContact: {
        name: lead.contactName,
        title: 'Primary Contact',
        email: lead.contactEmail,
        phone: lead.contactPhone,
      },
      notes: `Converted from lead: ${lead.id}\n${lead.notes || ''}`,
    }

    // Add client to clients list
    const existingClients = await this.getClients()
    const updatedClients = [newClient, ...existingClients]
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients))
    }

    // Update lead status to converted
    await this.updateLead(leadId, {
      status: 'converted',
      pipelineStage: 'onboarding',
    })

    return newClient
  }
  
  // ====================
  // CLIENTS
  // ====================
  
  async getClients(): Promise<Client[]> {
    await delay()
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.CLIENTS)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored clients', e)
        }
      } else {
        // Initialize with mock clients if not in localStorage
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(mockClients))
        return mockClients
      }
    }
    // Return mock clients as fallback
    return mockClients
  }
  
  async createClient(clientData: Partial<Client>): Promise<Client> {
    await delay()
    // Get existing clients
    const existingClients = await this.getClients()
    
    // Create new client
    const newClient: Client = {
      id: `client-${Date.now()}`,
      companyName: clientData.companyName || '',
      industry: clientData.industry || '',
      country: clientData.country || '',
      city: clientData.city,
      address: clientData.address,
      phone: clientData.phone,
      email: clientData.email || '',
      website: clientData.website,
      lifecycleStage: 'onboarding',
      status: 'active',
      lifecycleHistory: [
        {
          stage: 'onboarding',
          startDate: new Date().toISOString(),
          notes: 'Client onboarding initiated',
        },
      ],
      assignedRM: clientData.assignedRM || 'emp-001',
      assignedRMName: clientData.assignedRMName || 'Current User',
      assignedOfficer: clientData.assignedOfficer || 'emp-002',
      assignedOfficerName: clientData.assignedOfficerName || 'Compliance Officer',
      riskLevel: 'medium',
      riskAssessment: {
        overallScore: 50,
        lastAssessmentDate: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        factors: [],
        assessedBy: 'System',
        notes: 'Initial risk assessment pending',
      },
      documents: [],
      requiredDocuments: ['incorporation_certificate', 'proof_of_address', 'identification'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastContactDate: new Date().toISOString(),
      onboardingStartDate: new Date().toISOString(),
      annualRevenue: clientData.annualRevenue,
      numberOfEmployees: clientData.numberOfEmployees,
      primaryContact: clientData.primaryContact,
      notes: clientData.notes,
    }
    
    // Add to existing clients
    const updatedClients = [newClient, ...existingClients]
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients))
    }
    
    return newClient
  }
  
  async getClientById(id: string): Promise<Client | null> {
    await delay()
    const clients = await this.getClients()
    return clients.find(client => client.id === id) || null
  }
  
  async getClientsByLifecycleStage(stage: LifecycleStage): Promise<Client[]> {
    await delay()
    const clients = await this.getClients()
    return clients.filter(client => client.lifecycleStage === stage)
  }
  
  async getClientsByStatus(status: ClientStatus): Promise<Client[]> {
    await delay()
    const clients = await this.getClients()
    return clients.filter(client => client.status === status)
  }

  async updateClientStatus(
    clientId: string,
    status: ClientStatus,
    notes?: string
  ): Promise<Client | null> {
    await delay()
    const clients = await this.getClients()
    const client = clients.find(c => c.id === clientId)
    if (!client) return null

    // Update client status and lifecycle stage based on status
    let lifecycleStage: LifecycleStage = client.lifecycleStage
    if (status === 'approved') {
      lifecycleStage = 'onboarding'
    } else if (status === 'rejected') {
      lifecycleStage = 'inactive'
    }

    // Add to lifecycle history
    const historyEntry = {
      id: `history-${Date.now()}`,
      stage: lifecycleStage,
      timestamp: new Date().toISOString(),
      changedByName: 'Current User',
      notes: notes || `Status changed to ${status}`,
    }

    const updatedClient: Client = {
      ...client,
      status,
      lifecycleStage,
      lifecycleHistory: [
        ...(client.lifecycleHistory || []),
        historyEntry,
      ],
      updatedAt: new Date().toISOString(),
      approvalDate: status === 'approved' ? new Date().toISOString() : client.approvalDate,
    }

    // Update in storage
    const updatedClients = clients.map(c => c.id === clientId ? updatedClient : c)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients))
    }

    return updatedClient
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
    
    // Emit real-time event
    realtimeService.emit('document:uploaded', {
      documentId: newDocument.id,
      document: newDocument,
      entityId: newDocument.clientId,
      entityType: 'client',
    })
    
    // Get assigned compliance officer and send notification
    try {
      const officer = await assignmentService.getAssignedComplianceOfficer(newDocument.clientId)
      if (officer) {
        await notificationService.addNotification({
          title: 'New Document Uploaded',
          message: `${documentData.uploadedByName || 'Client'} uploaded ${newDocument.type.replace('_', ' ')} - ${newDocument.name}`,
          type: 'info',
          actionUrl: '/compliance/documents',
          metadata: {
            documentId: newDocument.id,
            clientId: newDocument.clientId,
            documentType: newDocument.type,
          },
        })
      }
    } catch (error) {
      console.error('Failed to send document upload notification:', error)
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
    
    // Get messages from localStorage or initialize with mockMessages once
    let allMessages: Message[] = []
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES)
      if (stored) {
        try {
          allMessages = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored messages', e)
          // Initialize with mockMessages if parsing fails
          allMessages = [...mockMessages]
          localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages))
        }
      } else {
        // Initialize localStorage with mockMessages on first use only
        allMessages = [...mockMessages]
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages))
      }
    } else {
      // Server-side: use mockMessages
      allMessages = [...mockMessages]
    }
    
    // Filter by conversationId and sort by timestamp (oldest first for chat display)
    return allMessages
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }
  
  async sendMessage(messageData: Partial<Message>): Promise<Message> {
    await delay(300) // Shorter delay for messages
    
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    
    // Get existing messages from localStorage (which should already include mockMessages if initialized)
    let existingMessages: Message[] = []
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES)
      if (stored) {
        try {
          existingMessages = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored messages', e)
          // Initialize with mockMessages if parsing fails
          existingMessages = [...mockMessages]
        }
      } else {
        // Initialize with mockMessages if no stored messages (first time)
        existingMessages = [...mockMessages]
      }
    } else {
      // Server-side: use mockMessages
      existingMessages = [...mockMessages]
    }
    
    // Add new message to the beginning (we'll sort when displaying)
    const updatedMessages = [newMessage, ...existingMessages]
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedMessages))
    }
    
    // Emit real-time event
    realtimeService.emit('message:sent', {
      messageId: newMessage.id,
      message: newMessage,
      conversationId: newMessage.conversationId,
    })
    
    // If message is from client/vendor, notify assigned employee
    if (messageData.senderType === 'client' || messageData.senderType === 'vendor') {
      try {
        // Extract client/vendor ID from conversation (in real app, would come from conversation metadata)
        const clientId = 'client-1' // Mock - would get from conversation
        
        const officer = await assignmentService.getAssignedOfficer(clientId, messageData.senderType as 'client' | 'vendor')
        if (officer) {
          const previewContent = newMessage.content.length > 100 
            ? newMessage.content.substring(0, 100) + '...' 
            : newMessage.content
          
          await notificationService.addNotification({
            title: `New Message from ${messageData.senderName}`,
            message: previewContent,
            type: 'info',
            actionUrl: `/compliance/messages/${newMessage.conversationId}`,
            metadata: {
              messageId: newMessage.id,
              conversationId: newMessage.conversationId,
              senderId: newMessage.senderId,
            },
          })
        }
      } catch (error) {
        console.error('Failed to send message notification:', error)
      }
    }
    
    return newMessage
  }
  
  async markMessageAsRead(messageId: string): Promise<Message | null> {
    await delay(100) // Very quick operation
    
    // Get messages from localStorage or mockMessages
    let messages: Message[] = []
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES)
      if (stored) {
        try {
          messages = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored messages', e)
          messages = [...mockMessages]
        }
      } else {
        messages = [...mockMessages]
      }
    } else {
      messages = [...mockMessages]
    }
    
    const message = messages.find(msg => msg.id === messageId)
    if (!message) return null
    
    const updatedMessage: Message = {
      ...message,
      read: true,
      readAt: new Date().toISOString(),
    }
    
    // Update in messages array
    const updatedMessages = messages.map(msg => msg.id === messageId ? updatedMessage : msg)
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(updatedMessages))
    }
    
    return updatedMessage
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

  // ====================
  // MEETINGS
  // ====================

  async getMeetings(): Promise<Meeting[]> {
    await delay(100)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MEETINGS)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored meetings', e)
        }
      }
    }
    return []
  }

  async getMeetingsByLeadId(leadId: string): Promise<Meeting[]> {
    await delay(100)
    const meetings = await this.getMeetings()
    return meetings.filter(m => m.leadId === leadId)
  }

  async createMeeting(meetingData: {
    leadId?: string
    clientId?: string
    vendorId?: string
    entityType: 'lead' | 'client' | 'vendor'
    entityName?: string
    title: string
    type: MeetingType
    date: string
    time: string
    duration: number
    attendees: string[]
    notes: string
    createdBy: string
    createdByName: string
  }): Promise<Meeting> {
    await delay()

    const newMeeting: Meeting = {
      id: `meeting-${Date.now()}`,
      leadId: meetingData.leadId,
      clientId: meetingData.clientId,
      vendorId: meetingData.vendorId,
      entityType: meetingData.entityType,
      entityName: meetingData.entityName,
      title: meetingData.title,
      type: meetingData.type,
      date: meetingData.date,
      time: meetingData.time,
      duration: meetingData.duration,
      attendees: meetingData.attendees,
      notes: meetingData.notes,
      createdBy: meetingData.createdBy,
      createdByName: meetingData.createdByName,
      createdAt: new Date().toISOString(),
      status: 'scheduled',
    }

    // Get existing meetings
    const existingMeetings = await this.getMeetings()

    // Add new meeting
    const updatedMeetings = [newMeeting, ...existingMeetings]

    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MEETINGS, JSON.stringify(updatedMeetings))
    }

    return newMeeting
  }

  /**
   * Calculate overall compliance score based on multiple factors
   * Returns a score from 0-100
   */
  async calculateComplianceScore(): Promise<{
    score: number
    breakdown: {
      documentApprovalRate: number
      riskScoreAverage: number
      onboardingCompletion: number
      timelyReviews: number
    }
  }> {
    await delay(100)

    const clients = await this.getClients()
    const documents = mockDocuments

    // 1. Document Approval Rate (40% weight)
    const totalDocuments = documents.length
    const approvedDocuments = documents.filter(d => d.status === 'approved').length
    const documentApprovalRate = totalDocuments > 0 ? (approvedDocuments / totalDocuments) * 40 : 0

    // 2. Risk Score Average (30% weight)
    // Lower risk scores are better, so we calculate: (100 - average risk score) * 30%
    const riskScoreMap: { [key: string]: number } = {
      'Low': 10,
      'Medium': 40,
      'High': 70,
      'Critical': 95
    }
    const totalRiskScore = mockRiskScores.reduce((sum, score) => {
      return sum + (riskScoreMap[score.riskLevel] || 50)
    }, 0)
    const averageRiskScore = mockRiskScores.length > 0 ? totalRiskScore / mockRiskScores.length : 50
    const riskScoreAverage = (100 - averageRiskScore) * 0.30

    // 3. Onboarding Completion (20% weight)
    const totalClients = clients.length
    const completedClients = clients.filter(c =>
      c.lifecycleStage === 'active' || c.lifecycleStage === 'dormant'
    ).length
    const onboardingCompletion = totalClients > 0 ? (completedClients / totalClients) * 20 : 0

    // 4. Timely Document Reviews (10% weight)
    // Documents reviewed within reasonable time (e.g., within 7 days of upload)
    const reviewedDocuments = documents.filter(d =>
      d.reviewedAt && d.uploadedAt
    )
    const timelyReviews = reviewedDocuments.filter(d => {
      if (!d.reviewedAt || !d.uploadedAt) return false
      const uploadDate = new Date(d.uploadedAt).getTime()
      const reviewDate = new Date(d.reviewedAt).getTime()
      const daysDiff = (reviewDate - uploadDate) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7 // Reviewed within 7 days
    }).length
    const timelyReviewsScore = reviewedDocuments.length > 0
      ? (timelyReviews / reviewedDocuments.length) * 10
      : 10 // Default to full score if no data

    // Calculate total score
    const totalScore = Math.round(
      documentApprovalRate +
      riskScoreAverage +
      onboardingCompletion +
      timelyReviewsScore
    )

    return {
      score: Math.min(100, Math.max(0, totalScore)), // Clamp between 0-100
      breakdown: {
        documentApprovalRate: Math.round(documentApprovalRate),
        riskScoreAverage: Math.round(riskScoreAverage),
        onboardingCompletion: Math.round(onboardingCompletion),
        timelyReviews: Math.round(timelyReviewsScore)
      }
    }
  }

  // ====================
  // RISK ASSESSMENT & REPORTS
  // ====================

  async generateRiskReport(entityId: string): Promise<{
    reportId: string
    entityId: string
    entityName: string
    reportUrl: string
    generatedAt: string
    format: 'pdf' | 'csv'
  }> {
    await delay(1500) // Simulate report generation time

    // Find entity (client or vendor)
    const clients = await this.getClients()
    const client = clients.find(c => c.id === entityId)
    const riskScore = mockRiskScores.find(s => s.entityId === entityId)

    const entityName = client?.companyName || riskScore?.entityName || 'Unknown Entity'

    // Generate mock report URL
    const reportId = `report-${Date.now()}`
    const reportUrl = `/api/reports/${reportId}.pdf`

    return {
      reportId,
      entityId,
      entityName,
      reportUrl,
      generatedAt: new Date().toISOString(),
      format: 'pdf',
    }
  }

  async updateRiskAssessment(
    entityId: string,
    data: {
      overallScore?: number
      riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
      sanctionsRisk?: number
      adverseMediaRisk?: number
      financialRisk?: number
      reputationalRisk?: number
      geographicRisk?: number
    }
  ): Promise<boolean> {
    await delay()

    // Update risk score in mock data
    const riskScoreIndex = mockRiskScores.findIndex(s => s.entityId === entityId)
    if (riskScoreIndex !== -1) {
      // Update risk score
      if (data.overallScore !== undefined) {
        mockRiskScores[riskScoreIndex].overallScore = data.overallScore
      }
      if (data.riskLevel) {
        mockRiskScores[riskScoreIndex].riskLevel = data.riskLevel
      }
    }

    // Also update client risk assessment if it's a client
    const clients = await this.getClients()
    const client = clients.find(c => c.id === entityId)
    if (client) {
      const riskLevel = data.riskLevel?.toLowerCase() as 'low' | 'medium' | 'high' | 'critical' || client.riskLevel
      
      const updatedClient: Client = {
        ...client,
        riskLevel,
        riskAssessment: {
          overall: riskLevel,
          sanctionsRisk: data.sanctionsRisk ?? client.riskAssessment.sanctionsRisk,
          adverseMediaRisk: data.adverseMediaRisk ?? client.riskAssessment.adverseMediaRisk,
          financialRisk: data.financialRisk ?? client.riskAssessment.financialRisk,
          reputationalRisk: data.reputationalRisk ?? client.riskAssessment.reputationalRisk,
          geographicRisk: data.geographicRisk ?? client.riskAssessment.geographicRisk,
          lastAssessedAt: new Date().toISOString(),
          lastAssessedBy: 'Current User',
        },
        updatedAt: new Date().toISOString(),
      }

      const updatedClients = clients.map(c => c.id === entityId ? updatedClient : c)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients))
      }
    }

    return true
  }

  async scheduleReview(
    entityId: string,
    date: string,
    notes?: string
  ): Promise<boolean> {
    await delay()

    // In a real app, this would schedule a review in a calendar system
    // For now, we'll just add a note to the client
    const clients = await this.getClients()
    const client = clients.find(c => c.id === entityId)
    if (client) {
      const reviewNote = `Review scheduled for ${new Date(date).toLocaleDateString()}${notes ? `: ${notes}` : ''}`
      const updatedClient: Client = {
        ...client,
        notes: client.notes ? `${client.notes}\n\n${reviewNote}` : reviewNote,
        updatedAt: new Date().toISOString(),
      }

      const updatedClients = clients.map(c => c.id === entityId ? updatedClient : c)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(updatedClients))
      }
    }

    return true
  }

  // ====================
  // VENDORS
  // ====================
  
  async getVendors(): Promise<Vendor[]> {
    await delay()
    // Try to get from localStorage first
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.VENDORS)
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored vendors', e)
        }
      } else {
        // Initialize with mock vendors if not in localStorage
        localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(mockVendors))
        return mockVendors
      }
    }
    // Return mock vendors as fallback
    return mockVendors
  }
  
  async getVendorById(id: string): Promise<Vendor | null> {
    await delay()
    const vendors = await this.getVendors()
    return vendors.find(vendor => vendor.id === id) || null
  }

  async exportVendors(format: 'csv' | 'excel' = 'csv'): Promise<{
    downloadUrl: string
    fileName: string
    format: string
  }> {
    await delay(1000) // Simulate export generation

    // Fetch actual vendor data
    const vendors = await this.getVendors()

    // Generate mock export file
    const exportId = `export-${Date.now()}`
    const fileName = `vendors-export-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`
    const downloadUrl = `/api/exports/${exportId}.${format === 'csv' ? 'csv' : 'xlsx'}`

    // In a real app, this would generate the file on the server
    // For now, we'll create a data URL with CSV content
    if (format === 'csv' && typeof window !== 'undefined') {
      const csvContent = [
        ['Vendor Name', 'Country', 'Category', 'Industry', 'Status', 'Risk Level', 'Annual Spend'],
        ...vendors.map(v => [
          v.companyName,
          v.country,
          v.category,
          v.industry,
          v.status,
          v.riskLevel,
          v.annualSpend ? `$${v.annualSpend.toLocaleString()}` : 'N/A',
        ]),
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      
      // Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    return {
      downloadUrl,
      fileName,
      format,
    }
  }
}

// Export singleton instance
export const mockDataService = new MockDataService()

