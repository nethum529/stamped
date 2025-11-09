import { NextRequest, NextResponse } from 'next/server'
import { deepSeekService } from '@/lib/services/deepseek-service'

/**
 * API Route for DeepSeek AI Analysis
 * This route handles server-side AI analysis requests
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { data, analysisType, context } = body

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      )
    }

    if (!analysisType) {
      return NextResponse.json(
        { error: 'Analysis type is required' },
        { status: 400 }
      )
    }

    // Call DeepSeek service
    const analysis = await deepSeekService.analyzeData({
      data,
      analysisType,
      context,
    })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in AI analysis API:', error)
    return NextResponse.json(
      { error: 'Failed to perform AI analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

