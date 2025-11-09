import { Lead, AIScoreBreakdown } from '@/lib/types/lead'
import { comprehensiveAIService } from './comprehensive-ai-service'

/**
 * AI Lead Scoring Service
 * Uses DeepSeek AI for comprehensive analysis when available, falls back to rule-based scoring
 */

export class AILeadScoringService {
  private useDeepSeek: boolean = true

  /**
   * Calculate AI score for a lead based on various factors
   * Uses DeepSeek AI when available, otherwise falls back to rule-based scoring
   */
  async calculateLeadScore(lead: Partial<Lead> | Lead): Promise<AIScoreBreakdown> {
    // If we have a full lead with ID, try to use comprehensive AI analysis
    if (this.useDeepSeek && 'id' in lead && lead.id) {
      try {
        const analysis = await comprehensiveAIService.analyzeLead(lead.id)
        return {
          companySize: analysis.breakdown.companySize || 50,
          industry: analysis.breakdown.industry || 50,
          geography: analysis.breakdown.geography || 50,
          contactQuality: analysis.breakdown.contactQuality || 50,
          overall: analysis.score,
        }
      } catch (error) {
        console.error('Error in AI analysis, falling back to rule-based scoring:', error)
        // Fall through to rule-based scoring
      }
    }

    // Fallback to rule-based scoring
    return this.calculateRuleBasedScore(lead)
  }

  /**
   * Calculate score using rule-based logic (fallback)
   */
  calculateRuleBasedScore(lead: Partial<Lead>): AIScoreBreakdown {
    const companySizeScore = this.scoreCompanySize(lead.companySize)
    const industryScore = this.scoreIndustry(lead.industry)
    const geographyScore = this.scoreGeography(lead.country)
    const contactQualityScore = this.scoreContactQuality(lead)

    const overall = Math.round(
      (companySizeScore * 0.25 +
       industryScore * 0.30 +
       geographyScore * 0.20 +
       contactQualityScore * 0.25)
    )

    return {
      companySize: companySizeScore,
      industry: industryScore,
      geography: geographyScore,
      contactQuality: contactQualityScore,
      overall,
    }
  }

  /**
   * Sync version for backwards compatibility (uses rule-based scoring)
   */
  calculateLeadScoreSync(lead: Partial<Lead>): AIScoreBreakdown {
    return this.calculateRuleBasedScore(lead)
  }

  private scoreCompanySize(size?: string): number {
    if (!size) return 50

    // Larger companies score higher
    if (size.includes('1000+')) return 95
    if (size.includes('500-1000')) return 85
    if (size.includes('250-500')) return 75
    if (size.includes('100-250')) return 65
    if (size.includes('50-100')) return 55
    return 45
  }

  private scoreIndustry(industry?: string): number {
    if (!industry) return 50

    // Financial services and healthcare score highest (more compliance needs)
    const highValueIndustries = ['Financial Services', 'Healthcare', 'Technology']
    if (highValueIndustries.includes(industry)) return 90

    const mediumValueIndustries = ['Manufacturing', 'Energy', 'Telecommunications']
    if (mediumValueIndustries.includes(industry)) return 75

    return 60
  }

  private scoreGeography(country?: string): number {
    if (!country) return 50

    // Score based on regulatory complexity and market size
    const tier1Markets = ['United States', 'United Kingdom', 'Germany', 'Switzerland']
    if (tier1Markets.includes(country)) return 90

    const tier2Markets = ['Canada', 'France', 'Netherlands', 'Singapore', 'Australia']
    if (tier2Markets.includes(country)) return 80

    const tier3Markets = ['Japan', 'South Korea', 'UAE', 'Brazil', 'India']
    if (tier3Markets.includes(country)) return 70

    return 60
  }

  private scoreContactQuality(lead: Partial<Lead>): number {
    let score = 50

    // Has email
    if (lead.contactEmail) {
      score += 10
      
      // Email domain quality (not gmail/yahoo)
      if (!lead.contactEmail.includes('@gmail') && !lead.contactEmail.includes('@yahoo')) {
        score += 10
      }
    }

    // Has phone
    if (lead.contactPhone) score += 10

    // Has website
    if (lead.website) score += 10

    // Has LinkedIn
    if (lead.linkedin) score += 5

    // Contact title/role (C-level or compliance-related)
    if (lead.contactName) {
      const nameLower = lead.contactName.toLowerCase()
      if (nameLower.includes('ceo') || nameLower.includes('cfo') || 
          nameLower.includes('chief') || nameLower.includes('compliance') ||
          nameLower.includes('director')) {
        score += 10
      }
    }

    return Math.min(100, score)
  }

  /**
   * Get recommendation based on AI score
   */
  getScoreRecommendation(score: number): {
    priority: 'high' | 'medium' | 'low'
    action: string
    rationale: string
  } {
    if (score >= 80) {
      return {
        priority: 'high',
        action: 'Prioritize immediate outreach',
        rationale: 'Excellent fit with high conversion potential. Schedule discovery call ASAP.',
      }
    } else if (score >= 65) {
      return {
        priority: 'medium',
        action: 'Standard nurture process',
        rationale: 'Good potential lead. Follow standard outreach timeline and qualification process.',
      }
    } else {
      return {
        priority: 'low',
        action: 'Monitor and reassess',
        rationale: 'Lower priority. Add to nurture campaign and reassess in 30-60 days.',
      }
    }
  }

  /**
   * Get score insights for display
   */
  getScoreInsights(breakdown: AIScoreBreakdown): string[] {
    const insights: string[] = []

    if (breakdown.companySize >= 80) {
      insights.push('✓ Large organization with complex compliance needs')
    } else if (breakdown.companySize < 60) {
      insights.push('⚠ Smaller company may have budget constraints')
    }

    if (breakdown.industry >= 80) {
      insights.push('✓ High-compliance industry with strong regulatory requirements')
    }

    if (breakdown.geography >= 80) {
      insights.push('✓ Located in major market with robust compliance frameworks')
    }

    if (breakdown.contactQuality >= 75) {
      insights.push('✓ Quality contact information with decision-making authority')
    } else if (breakdown.contactQuality < 60) {
      insights.push('⚠ Limited contact details - gather more information')
    }

    if (breakdown.overall >= 80) {
      insights.push('🎯 High-value prospect - prioritize for outreach')
    }

    return insights
  }
}

// Export singleton instance
export const aiLeadScoringService = new AILeadScoringService()

