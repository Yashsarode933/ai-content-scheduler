import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel cron jobs)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = createServerClient()
    const now = new Date().toISOString()

    // Find posts scheduled for now (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

    // Fetch scheduled posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('status', 'scheduled')
      .gte('scheduled_at', fiveMinutesAgo)
      .lte('scheduled_at', now)

    if (error) throw error

    if (!posts || posts.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No posts to publish',
        processed: 0
      })
    }

    // Process each post
    const results = []
    for (const post of posts) {
      try {
        // Get user's social credentials
        const { data: credentials } = await supabase
          .from('social_credentials')
          .select('*')
          .eq('user_id', post.user_id)
          .single()

        if (!credentials) {
          results.push({ postId: post.id, status: 'error', error: 'No credentials configured' })
          continue
        }

        // Post to social media via API
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/social/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postId: post.id,
            platforms: post.platforms,
            content: post.content,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to post to social media')
        }

        results.push({ postId: post.id, status: 'published' })
      } catch (err: any) {
        console.error(`Error publishing post ${post.id}:`, err)
        results.push({ postId: post.id, status: 'error', error: err.message })
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cron job executed',
      processed: results.length,
      results
    })
  } catch (error: any) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

