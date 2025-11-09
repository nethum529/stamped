import { NextRequest, NextResponse } from 'next/server'

// Use environment variable for API key (secure)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function POST(request: NextRequest) {
  try {
    const { entityName, dateRange } = await request.json()

    if (!entityName) {
      return NextResponse.json(
        { error: 'Entity name is required' },
        { status: 400 }
      )
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(dateRange || '30'))

    // Create prompt for DeepSeek
    const prompt = `You are an experienced financial compliance analyst conducting comprehensive adverse media research for Know Your Customer (KYC) and Anti-Money Laundering (AML) due diligence.

**Entity Under Review:** "${entityName}"
**Review Period:** ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}

**Task:** Conduct a thorough search for adverse media related to the entity. Focus on information that would be relevant for compliance risk assessment in financial services.

**Scope of Adverse Media Includes:**
- Regulatory violations, fines, or enforcement actions
- Legal proceedings (civil or criminal)
- Fraud, corruption, or bribery allegations
- Money laundering or terrorist financing connections
- Sanctions violations or exposure to sanctioned entities
- Significant reputational damage or ethical controversies
- Environmental, social, or governance (ESG) violations
- Bankruptcy or financial distress indicators

**Output Requirements:**
For EACH finding, provide:
- **title**: Clear, concise headline (max 100 characters)
- **description**: Detailed but concise summary (2-3 sentences, focus on compliance relevance)
- **date**: Exact date in YYYY-MM-DD format (or best available date)
- **source**: Credible source name (e.g., "Financial Times", "Reuters", "SEC.gov")
- **severity**: Assessment based on compliance impact:
  * "Critical" - Major regulatory violations, criminal charges, significant sanctions
  * "High" - Serious legal issues, large fines, regulatory warnings
  * "Medium" - Minor violations, ongoing investigations, reputational concerns
  * "Low" - Historical issues (resolved), minor infractions
- **category**: Primary category from: "Regulatory", "Legal", "Fraud", "Corruption", "Money Laundering", "Sanctions", "Reputational", "ESG", "Financial Distress", "Other"

**Important Instructions:**
1. Prioritize recent and credible sources
2. Exclude unverified rumors or social media speculation
3. Focus on materially significant events
4. If no adverse media found, return empty array: []
5. Return ONLY valid JSON array, no markdown formatting, no explanatory text

**Next Steps & Recommendations:**
After analyzing all findings, provide structured recommendations based on:
- Risk level of findings (Critical/High findings require immediate action)
- Recency of events (recent issues require enhanced due diligence)
- Category patterns (multiple regulatory issues suggest systemic problems)
- Materiality (consider financial impact and reputational risk)

**Output Format (JSON only):**
{
  "findings": [
    {
      "title": "Example: SEC fines company $2M for accounting violations",
      "description": "The Securities and Exchange Commission imposed a $2 million fine on the company for material misstatements in financial reports. The violations occurred between 2020-2022 and involved revenue recognition issues.",
      "date": "2024-01-15",
      "source": "SEC.gov",
      "severity": "High",
      "category": "Regulatory"
    }
  ],
  "nextSteps": [
    {
      "action": "Enhanced Due Diligence (EDD)",
      "priority": "High",
      "description": "Conduct enhanced due diligence review focusing on financial reporting and regulatory compliance. Request additional documentation and certifications.",
      "timeline": "Within 5 business days"
    },
    {
      "action": "Regulatory Verification",
      "priority": "Medium",
      "description": "Verify current regulatory status with relevant authorities and check for any ongoing investigations.",
      "timeline": "Within 10 business days"
    }
  ],
  "overallRiskAssessment": {
    "level": "High",
    "summary": "Multiple regulatory violations indicate elevated compliance risk. Enhanced monitoring required.",
    "recommendation": "Approve with conditions: Enhanced monitoring, quarterly reviews, and additional documentation requirements."
  }
}`

    // Check if API key is configured
    if (!DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'DeepSeek API key not configured. Please set DEEPSEEK_API_KEY in environment variables.' },
        { status: 500 }
      )
    }

    // Call DeepSeek API
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a senior compliance analyst at a financial institution with expertise in KYC/AML due diligence and adverse media screening. You have deep knowledge of regulatory requirements including FATF guidelines, FinCEN regulations, and international sanctions regimes. Your role is to identify and assess compliance-relevant negative information about entities from credible sources. You provide objective, fact-based analysis focused on material compliance risks. You distinguish between verified facts and allegations, and you prioritize information by recency and credibility. When providing next steps and recommendations, be specific, actionable, and prioritize based on risk level. Your recommendations should align with standard compliance practices and regulatory expectations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('DeepSeek API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to fetch adverse media data from DeepSeek API', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract the response content
    const content = data.choices?.[0]?.message?.content || '[]'
    
    // Parse the JSON response
    let parsedData: any = { findings: [], nextSteps: [], overallRiskAssessment: null }
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0])
        // Handle case where response is just an array of findings
        if (Array.isArray(parsedData)) {
          parsedData = { findings: parsedData, nextSteps: [], overallRiskAssessment: null }
        }
      } else {
        parsedData = JSON.parse(content)
        if (Array.isArray(parsedData)) {
          parsedData = { findings: parsedData, nextSteps: [], overallRiskAssessment: null }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse DeepSeek response:', parseError)
      // If parsing fails, return a structured error
      return NextResponse.json({
        findings: [],
        nextSteps: [],
        overallRiskAssessment: null,
        error: 'Failed to parse AI response',
        rawResponse: content
      })
    }

    // Ensure all findings have required fields
    const validatedFindings = (parsedData.findings || []).map((finding: any) => ({
      title: finding.title || 'No title',
      description: finding.description || '',
      date: finding.date || new Date().toISOString().split('T')[0],
      source: finding.source || 'Unknown',
      severity: finding.severity || 'Medium',
      category: finding.category || 'Other',
    }))

    // Validate and structure next steps
    const validatedNextSteps = (parsedData.nextSteps || []).map((step: any) => ({
      action: step.action || 'Review Required',
      priority: step.priority || 'Medium',
      description: step.description || '',
      timeline: step.timeline || 'As soon as possible',
    }))

    // Validate overall risk assessment
    const riskAssessment = parsedData.overallRiskAssessment || {
      level: validatedFindings.some((f: any) => f.severity === 'Critical' || f.severity === 'High') ? 'High' : 'Medium',
      summary: validatedFindings.length > 0 
        ? `Found ${validatedFindings.length} adverse media finding(s). ${validatedFindings.filter((f: any) => f.severity === 'Critical' || f.severity === 'High').length} high or critical risk item(s) identified.`
        : 'No significant adverse media findings identified.',
      recommendation: validatedFindings.length === 0 
        ? 'No additional due diligence required based on adverse media screening.'
        : 'Review findings and conduct appropriate due diligence based on risk level.',
    }

    return NextResponse.json({
      entityName,
      dateRange,
      searchDate: new Date().toISOString(),
      findingsCount: validatedFindings.length,
      findings: validatedFindings,
      nextSteps: validatedNextSteps,
      overallRiskAssessment: riskAssessment,
    })

  } catch (error) {
    console.error('Adverse media API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

