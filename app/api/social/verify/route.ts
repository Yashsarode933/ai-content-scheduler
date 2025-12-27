import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { SocialMediaManager } from '@/lib/social-apis'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params (passed from client)
    const userId = request.nextUrl.searchParams.get('userId')
    
    if (!userId) {
      // Try to get from session
      const supabase = createServerClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      return await verifyUserConnections(user.id, supabase)
    }

    // Use provided user ID with service role for server-side access
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    return await verifyUserConnections(userId, supabase)
  } catch (error: any) {
    console.error('Social media verify error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify connections' },
      { status: 500 }
    )
  }
}

async function verifyUserConnections(userId: string, supabase: any) {
  // Get user's social media credentials
  const { data: credentials, error: credError } = await supabase
    .from('social_credentials')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (credError || !credentials) {
    return NextResponse.json({
      connected: {
        twitter: false,
        linkedin: false,
        instagram: false,
        discord: false,
      },
    })
  }

  const connected: Record<string, boolean> = {
    twitter: false,
    linkedin: false,
    instagram: false,
    discord: false,
  }

  // Test Discord webhook directly (easiest to verify)
  if (credentials.discord_config?.webhookUrl) {
    try {
      const testResponse = await fetch(credentials.discord_config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: '✅ Connection verified - AI Content Scheduler',
        }),
      })
      connected.discord = testResponse.ok || testResponse.status === 204
    } catch (error) {
      console.error('Discord webhook test failed:', error)
      connected.discord = false
    }
  }

  // Test other platforms if credentials exist
  if (credentials.twitter_config || credentials.linkedin_config || credentials.instagram_config) {
    try {
      const socialManager = new SocialMediaManager({
        twitter: credentials.twitter_config,
        linkedin: credentials.linkedin_config,
        instagram: credentials.instagram_config,
        discord: credentials.discord_config,
      })

      const verified = await socialManager.verifyAllConnections()
      Object.assign(connected, verified)
    } catch (error) {
      console.error('Platform verification error:', error)
    }
  }

  return NextResponse.json({ connected })
}

