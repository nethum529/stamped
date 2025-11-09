/**
 * Comprehensive AI Analysis Service
 * Aggregates all data and uses DeepSeek for comprehensive analysis
 */

import { mockDataService } from './mock-data-service'
import { Lead } from '@/lib/types/lead'
import { Client } from '@/lib/types/client'
import { Vendor } from '@/lib/types/vendor'
import { Document } from '@/lib/types/document'
import { Message } from '@/lib/types/message'
import { Meeting } from '@/lib/types/lead'

interface ComprehensiveAnalysisResult {
  score: number
  breakdown: {
    companySize?: number
    industry?: number
    geography?: number
    contactQuality?: number
    complianceReadiness?: number
    riskFactors?: number
    financialHealth?: number
    overall: number
  }
  insights: string[]
  recommendations: string[]
  riskFactors: string[]
  confidence: number
  reasoning: string
}

export class ComprehensiveAIService {
  /**
   * Analyze a single lead with comprehensive data context
   */
  async analyzeLead(leadId: string): Promise<ComprehensiveAnalysisResult> {
    try {
      // Fetch the lead
      const lead = await mockDataService.getLeadById(leadId)
      if (!lead) {
        throw new Error('Lead not found')
      }

      // Gather all related data
      const relatedData = await this.gatherRelatedData(lead)

      // Call AI analysis API
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            leads: [lead],
            ...relatedData,
          },
          analysisType: 'lead_scoring',
          context: `Analyzing lead: ${lead.companyName} (${lead.industry}, ${lead.country})`,
        }),
      })

      if (!response.ok) {
        throw new Error('AI analysis failed')
      }

      const analysis = await response.json()
      return this.normalizeAnalysisResult(analysis)
    } catch (error) {
      console.error('Error in comprehensive lead analysis:', error)
      // Return fallback result
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Analyze dashboard data comprehensively
   */
  async analyzeDashboard(): Promise<ComprehensiveAnalysisResult> {
    try {
      // Gather all data
      const [leads, clients, vendors, documents, meetings] = await Promise.all([
        mockDataService.getLeads(),
        mockDataService.getClients(),
        mockDataService.getVendors(),
        mockDataService.getDocuments(),
        mockDataService.getMeetings(),
      ])

      // Get messages (limited to recent)
      let messages: Message[] = []
      try {
        const conversations = await mockDataService.getConversations()
        // Get messages from first few conversations for context
        for (const conv of conversations.slice(0, 5)) {
          const convMessages = await mockDataService.getMessagesByConversationId(conv.id)
          messages.push(...convMessages.slice(0, 10)) // Limit per conversation
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }

      // Get risk assessments from clients and vendors
      const riskAssessments = [
        ...clients.map(c => ({
          entityId: c.id,
          entityType: 'client',
          entityName: c.companyName,
          riskLevel: c.riskLevel,
          riskAssessment: c.riskAssessment,
        })),
        ...vendors.map(v => ({
          entityId: v.id,
          entityType: 'vendor',
          entityName: v.companyName,
          riskLevel: v.riskLevel,
          riskAssessment: v.riskAssessment,
        })),
      ]

      // Get activities from leads
      const activities = leads.flatMap(lead =>
        lead.activities.map(activity => ({
          ...activity,
          leadId: lead.id,
          leadName: lead.companyName,
        }))
      )

      // Call AI analysis API
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            leads: leads.slice(0, 50), // Limit for API efficiency
            clients: clients.slice(0, 30),
            vendors: vendors.slice(0, 20),
            documents: documents.slice(0, 50),
            riskAssessments: riskAssessments.slice(0, 30),
            activities: activities.slice(0, 100),
            meetings: meetings.slice(0, 30),
            messages: messages.slice(0, 50),
          },
          analysisType: 'dashboard_insights',
          context: `Comprehensive dashboard analysis for ${leads.length} leads, ${clients.length} clients, ${vendors.length} vendors`,
        }),
      })

      if (!response.ok) {
        throw new Error('AI analysis failed')
      }

      const analysis = await response.json()
      return this.normalizeAnalysisResult(analysis)
    } catch (error) {
      console.error('Error in comprehensive dashboard analysis:', error)
      return this.getFallbackAnalysis()
    }
  }

  /**
   * Gather all data related to a lead
   */
  private async gatherRelatedData(lead: Lead): Promise<{
    clients?: any[]
    vendors?: any[]
    documents?: any[]
    riskAssessments?: any[]
    activities?: any[]
    meetings?: any[]
    messages?: any[]
  }> {
    try {
      // Get meetings for this lead
      const meetings = await mockDataService.getMeetingsByLeadId(lead.id)

      // Get activities (already in lead)
      const activities = lead.activities || []

      // Get documents if this lead has been converted to a client
      let documents: Document[] = []
      let clients: Client[] = []
      if (lead.status === 'converted') {
        const allClients = await mockDataService.getClients()
        const relatedClient = allClients.find(c => c.notes?.includes(lead.id))
        if (relatedClient) {
          clients = [relatedClient]
          documents = await mockDataService.getDocumentsByClientId(relatedClient.id)
        }
      }

      // Get risk assessments if client exists
      const riskAssessments = clients.map(c => ({
        entityId: c.id,
        entityType: 'client',
        entityName: c.companyName,
        riskLevel: c.riskLevel,
        riskAssessment: c.riskAssessment,
      }))

      return {
        clients,
        documents,
        riskAssessments,
        activities,
        meetings,
      }
    } catch (error) {
      console.error('Error gathering related data:', error)
      return {}
    }
  }

  /**
   * Normalize analysis result to standard format
   */
  private normalizeAnalysisResult(analysis: any): ComprehensiveAnalysisResult {
    return {
      score: analysis.score || analysis.breakdown?.overall || 50,
      breakdown: {
        overall: analysis.score || analysis.breakdown?.overall || 50,
        companySize: analysis.breakdown?.companySize,
        industry: analysis.breakdown?.industry,
        geography: analysis.breakdown?.geography,
        contactQuality: analysis.breakdown?.contactQuality,
        complianceReadiness: analysis.breakdown?.complianceReadiness,
        riskFactors: analysis.breakdown?.riskFactors,
        financialHealth: analysis.breakdown?.financialHealth,
      },
      insights: Array.isArray(analysis.insights) ? analysis.insights : [],
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      riskFactors: Array.isArray(analysis.riskFactors) ? analysis.riskFactors : [],
      confidence: analysis.confidence || 75,
      reasoning: analysis.reasoning || '',
    }
  }

  /**
   * Get fallback analysis result
   */
  private getFallbackAnalysis(): ComprehensiveAnalysisResult {
    return {
      score: 50,
      breakdown: {
        overall: 50,
        companySize: 50,
        industry: 50,
        geography: 50,
        contactQuality: 50,
      },
      insights: ['AI analysis temporarily unavailable. Using basic scoring.'],
      recommendations: ['Please configure DEEPSEEK_API_KEY for enhanced AI analysis.'],
      riskFactors: [],
      confidence: 50,
      reasoning: 'Fallback analysis - AI service unavailable',
    }
  }
}

// Export singleton instance
export const comprehensiveAIService = new ComprehensiveAIService()

