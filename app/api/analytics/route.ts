import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { mockAnalytics } from '@/lib/mockData'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    const supabase = createServerClient()

    // In production, fetch from Supabase
    // const { data, error } = await supabase
    //   .from('post_analytics')
    //   .select('*')
    //   .eq('project_id', projectId)

    // if (error) throw error

    // For now, return mock data
    return NextResponse.json({ analytics: mockAnalytics })
  } catch (error: any) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

