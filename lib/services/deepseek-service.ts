/**
 * DeepSeek AI Service
 * Integrates with DeepSeek API for comprehensive data analysis
 */

interface DeepSeekAnalysisRequest {
  data: {
    leads?: any[]
    clients?: any[]
    vendors?: any[]
    documents?: any[]
    riskAssessments?: any[]
    activities?: any[]
    meetings?: any[]
    messages?: any[]
  }
  analysisType: 'lead_scoring' | 'compliance_analysis' | 'risk_assessment' | 'dashboard_insights'
  context?: string
}

interface DeepSeekAnalysisResponse {
  score?: number
  breakdown?: {
    companySize?: number
    industry?: number
    geography?: number
    contactQuality?: number
    complianceReadiness?: number
    riskFactors?: number
    financialHealth?: number
    overall?: number
  }
  insights?: string[]
  recommendations?: string[]
  riskFactors?: string[]
  confidence?: number
  reasoning?: string
}

export class DeepSeekService {
  private apiKey: string
  private apiUrl: string = 'https://api.deepseek.com/v1/chat/completions'

  constructor() {
    // Get API key from environment variable (server-side only)
    // On client-side, this will be empty and we'll use the API route
    if (typeof window === 'undefined') {
      this.apiKey = process.env.DEEPSEEK_API_KEY || ''
      if (!this.apiKey) {
        console.warn('DEEPSEEK_API_KEY not set. AI analysis will use fallback logic.')
      }
    } else {
      // Client-side: API key should not be exposed
      this.apiKey = ''
    }
  }

  /**
   * Analyze comprehensive data using DeepSeek AI
   */
  async analyzeData(request: DeepSeekAnalysisRequest): Promise<DeepSeekAnalysisResponse> {
    if (!this.apiKey) {
      // Fallback to basic analysis if API key is not set
      return this.fallbackAnalysis(request)
    }

    try {
      // Prepare the prompt for DeepSeek
      const prompt = this.buildAnalysisPrompt(request)

      // Call DeepSeek API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an expert compliance and risk analysis AI. Analyze the provided data and return structured JSON responses with scores, insights, and recommendations. Always return valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
          stream: false,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('DeepSeek API error:', errorText)
        return this.fallbackAnalysis(request)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        return this.fallbackAnalysis(request)
      }

      // Parse the JSON response
      const analysis = JSON.parse(content)
      return this.normalizeResponse(analysis)
    } catch (error) {
      console.error('Error calling DeepSeek API:', error)
      return this.fallbackAnalysis(request)
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  private buildAnalysisPrompt(request: DeepSeekAnalysisRequest): string {
    const { data, analysisType, context } = request

    let prompt = `Analyze the following compliance and risk management data for ${analysisType}.\n\n`

    // Add context
    if (context) {
      prompt += `Context: ${context}\n\n`
    }

    // Add data summaries
    if (data.leads && data.leads.length > 0) {
      prompt += `LEADS DATA (${data.leads.length} leads):\n`
      prompt += JSON.stringify(data.leads.slice(0, 10), null, 2) // Limit to first 10 for token efficiency
      if (data.leads.length > 10) {
        prompt += `\n... and ${data.leads.length - 10} more leads\n`
      }
      prompt += '\n'
    }

    if (data.clients && data.clients.length > 0) {
      prompt += `CLIENTS DATA (${data.clients.length} clients):\n`
      prompt += JSON.stringify(data.clients.slice(0, 5), null, 2)
      if (data.clients.length > 5) {
        prompt += `\n... and ${data.clients.length - 5} more clients\n`
      }
      prompt += '\n'
    }

    if (data.vendors && data.vendors.length > 0) {
      prompt += `VENDORS DATA (${data.vendors.length} vendors):\n`
      prompt += JSON.stringify(data.vendors.slice(0, 5), null, 2)
      if (data.vendors.length > 5) {
        prompt += `\n... and ${data.vendors.length - 5} more vendors\n`
      }
      prompt += '\n'
    }

    if (data.documents && data.documents.length > 0) {
      prompt += `DOCUMENTS DATA (${data.documents.length} documents):\n`
      prompt += JSON.stringify(data.documents.slice(0, 10), null, 2)
      if (data.documents.length > 10) {
        prompt += `\n... and ${data.documents.length - 10} more documents\n`
      }
      prompt += '\n'
    }

    if (data.riskAssessments && data.riskAssessments.length > 0) {
      prompt += `RISK ASSESSMENTS DATA:\n`
      prompt += JSON.stringify(data.riskAssessments, null, 2)
      prompt += '\n'
    }

    if (data.activities && data.activities.length > 0) {
      prompt += `ACTIVITIES DATA (${data.activities.length} activities):\n`
      prompt += JSON.stringify(data.activities.slice(0, 20), null, 2)
      prompt += '\n'
    }

    if (data.meetings && data.meetings.length > 0) {
      prompt += `MEETINGS DATA (${data.meetings.length} meetings):\n`
      prompt += JSON.stringify(data.meetings.slice(0, 10), null, 2)
      prompt += '\n'
    }

    // Add analysis instructions based on type
    switch (analysisType) {
      case 'lead_scoring':
        prompt += `\nPlease analyze this data and provide:
1. An overall lead score (0-100) based on:
   - Company size and growth potential
   - Industry fit and compliance needs
   - Geographic market attractiveness
   - Contact quality and decision-making authority
   - Financial indicators
   - Compliance readiness
   - Risk factors

2. A breakdown with scores (0-100) for:
   - companySize
   - industry
   - geography
   - contactQuality
   - complianceReadiness (optional)
   - riskFactors (optional)
   - financialHealth (optional)
   - overall

3. Key insights (array of strings)
4. Recommendations (array of strings)
5. Risk factors (array of strings, if any)
6. Confidence level (0-100)
7. Reasoning (brief explanation of the analysis)

Return your response as JSON with this structure:
{
  "score": <number>,
  "breakdown": { ... },
  "insights": [ ... ],
  "recommendations": [ ... ],
  "riskFactors": [ ... ],
  "confidence": <number>,
  "reasoning": "<string>"
}`
        break

      case 'dashboard_insights':
        prompt += `\nPlease analyze this comprehensive data and provide:
1. Overall health score (0-100) for the organization
2. Key insights about:
   - Pipeline health
   - Compliance status
   - Risk trends
   - Growth opportunities
   - Areas of concern

3. Actionable recommendations
4. Risk factors to monitor
5. Confidence level

Return as JSON with: score, breakdown, insights, recommendations, riskFactors, confidence, reasoning`
        break

      default:
        prompt += `\nPlease provide comprehensive analysis with scores, insights, recommendations, and risk factors.`
    }

    return prompt
  }

  /**
   * Normalize DeepSeek response to our standard format
   */
  private normalizeResponse(analysis: any): DeepSeekAnalysisResponse {
    return {
      score: analysis.score || analysis.overall || undefined,
      breakdown: analysis.breakdown || {
        overall: analysis.score || analysis.overall,
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
      reasoning: analysis.reasoning || analysis.explanation || '',
    }
  }

  /**
   * Fallback analysis when DeepSeek API is not available
   */
  private fallbackAnalysis(request: DeepSeekAnalysisRequest): DeepSeekAnalysisResponse {
    // Simple fallback logic
    const data = request.data
    let score = 50

    if (data.leads && data.leads.length > 0) {
      const avgLeadScore = data.leads.reduce((sum: number, lead: any) => {
        return sum + (lead.aiScore || 50)
      }, 0) / data.leads.length
      score = Math.round(avgLeadScore)
    }

    return {
      score,
      breakdown: {
        overall: score,
        companySize: 50,
        industry: 50,
        geography: 50,
        contactQuality: 50,
      },
      insights: ['Using fallback analysis. Please configure DEEPSEEK_API_KEY for enhanced AI analysis.'],
      recommendations: ['Configure DeepSeek API key for comprehensive AI-powered analysis.'],
      confidence: 50,
      reasoning: 'Fallback analysis - DeepSeek API not configured',
    }
  }
}

// Export singleton instance
export const deepSeekService = new DeepSeekService()

