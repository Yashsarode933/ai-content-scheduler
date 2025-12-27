import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { SocialMediaManager } from '@/lib/social-apis'
import type { Platform } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postId, platforms, content, mediaUrl } = body

    if (!postId || !platforms || !Array.isArray(platforms) || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, platforms, content' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's social media credentials from database
    // In production, store these securely in Supabase
    const { data: credentials } = await supabase
      .from('social_credentials')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!credentials) {
      return NextResponse.json(
        { error: 'Social media credentials not configured' },
        { status: 400 }
      )
    }

    // Initialize social media manager with user's credentials
    const socialManager = new SocialMediaManager({
      twitter: credentials.twitter_config,
      linkedin: credentials.linkedin_config,
      instagram: credentials.instagram_config,
      discord: credentials.discord_config,
    })

    // Post to platforms
    const results = await socialManager.postToMultiple(
      content,
      platforms as Platform[],
      mediaUrl
    )

    // Update post status in database
    const allSuccessful = results.every((r) => r.success)
    const status = allSuccessful ? 'published' : 'partially_published'

    await supabase
      .from('posts')
      .update({
        status,
        published_at: new Date().toISOString(),
        published_platforms: results.filter((r) => r.success).map((r) => r.platform),
      })
      .eq('id', postId)

    return NextResponse.json({
      success: true,
      results,
      status,
    })
  } catch (error: any) {
    console.error('Social media post error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to post to social media' },
      { status: 500 }
    )
  }
}

