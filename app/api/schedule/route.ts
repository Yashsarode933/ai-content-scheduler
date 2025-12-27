import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, scheduledAt } = body

    if (!postId || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createServerClient()

    // In production, update post in Supabase
    // const { error } = await supabase
    //   .from('posts')
    //   .update({ scheduled_at: scheduledAt, status: 'scheduled' })
    //   .eq('id', postId)

    // if (error) throw error

    return NextResponse.json({ success: true, message: 'Post scheduled successfully' })
  } catch (error: any) {
    console.error('Schedule error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

