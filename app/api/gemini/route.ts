import { NextRequest, NextResponse } from 'next/server'
import { generateCaption, predictTrends, repurposeContent, analyzePerformance } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ...params } = body

    switch (action) {
      case 'generate':
        const caption = await generateCaption(params.topic, params.platform, params.charLimit)
        return NextResponse.json(caption)

      case 'predict':
        const trends = await predictTrends(params.niche)
        return NextResponse.json({ trends })

      case 'repurpose':
        const variants = await repurposeContent(params.content)
        return NextResponse.json({ variants })

      case 'analyze':
        const analysis = await analyzePerformance(params.views, params.likes, params.shares)
        return NextResponse.json(analysis)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

