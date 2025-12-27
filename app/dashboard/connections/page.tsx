'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { MobileNav } from '@/components/mobile-nav'
import { createClientComponentClient } from '@/lib/supabase'
import { CheckCircle2, XCircle, Twitter, Linkedin, Instagram, MessageSquare, Save, ExternalLink } from 'lucide-react'
import type { Platform } from '@/lib/types'

interface ConnectionStatus {
  twitter: boolean
  linkedin: boolean
  instagram: boolean
  discord: boolean
}

export default function ConnectionsPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    twitter: false,
    linkedin: false,
    instagram: false,
    discord: false,
  })

  // Twitter
  const [twitterApiKey, setTwitterApiKey] = useState('')
  const [twitterApiSecret, setTwitterApiSecret] = useState('')
  const [twitterAccessToken, setTwitterAccessToken] = useState('')
  const [twitterAccessTokenSecret, setTwitterAccessTokenSecret] = useState('')
  const [twitterBearerToken, setTwitterBearerToken] = useState('')

  // LinkedIn
  const [linkedinAccessToken, setLinkedinAccessToken] = useState('')
  const [linkedinOrgId, setLinkedinOrgId] = useState('')

  // Instagram
  const [instagramAccessToken, setInstagramAccessToken] = useState('')
  const [instagramAccountId, setInstagramAccountId] = useState('')
  const [instagramPageId, setInstagramPageId] = useState('')

  // Discord
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState('')
  const [discordBotToken, setDiscordBotToken] = useState('')
  const [discordChannelId, setDiscordChannelId] = useState('')

  useEffect(() => {
    const loadCredentials = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Load existing credentials
      const { data } = await supabase
        .from('social_credentials')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        if (data.twitter_config) {
          setTwitterApiKey(data.twitter_config.apiKey || '')
          setTwitterApiSecret(data.twitter_config.apiSecret || '')
          setTwitterAccessToken(data.twitter_config.accessToken || '')
          setTwitterAccessTokenSecret(data.twitter_config.accessTokenSecret || '')
          setTwitterBearerToken(data.twitter_config.bearerToken || '')
        }
        if (data.linkedin_config) {
          setLinkedinAccessToken(data.linkedin_config.accessToken || '')
          setLinkedinOrgId(data.linkedin_config.organizationId || '')
        }
        if (data.instagram_config) {
          setInstagramAccessToken(data.instagram_config.accessToken || '')
          setInstagramAccountId(data.instagram_config.instagramBusinessAccountId || '')
          setInstagramPageId(data.instagram_config.pageId || '')
        }
        if (data.discord_config) {
          setDiscordWebhookUrl(data.discord_config.webhookUrl || '')
          setDiscordBotToken(data.discord_config.botToken || '')
          setDiscordChannelId(data.discord_config.channelId || '')
        }
      }

      // Verify connections
      await verifyConnections()
      setLoading(false)
    }

    loadCredentials()
  }, [router, supabase])

  const verifyConnections = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('⚠️ Please sign in to verify connections.')
        return
      }

      // First, test Discord webhook directly (bypasses API for faster testing)
      if (discordWebhookUrl) {
        try {
          const testResponse = await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: '✅ Connection test - AI Content Scheduler',
            }),
          })

          if (testResponse.ok || testResponse.status === 204) {
            setConnectionStatus(prev => ({ ...prev, discord: true }))
            alert('✅ Discord webhook verified successfully!\n\nCheck your Discord channel for the test message.')
            return
          } else {
            const errorText = await testResponse.text()
            console.error('Discord webhook test failed:', errorText)
            setConnectionStatus(prev => ({ ...prev, discord: false }))
            alert(`❌ Discord webhook test failed (Status: ${testResponse.status})\n\nError: ${errorText || testResponse.statusText}`)
            return
          }
        } catch (directError: any) {
          console.error('Direct Discord test error:', directError)
          setConnectionStatus(prev => ({ ...prev, discord: false }))
          alert(`❌ Failed to test Discord webhook: ${directError.message}\n\nMake sure the webhook URL is correct.`)
          return
        }
      }

      // For other platforms or if Discord webhook not set, use API route
      const response = await fetch(`/api/social/verify?userId=${user.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setConnectionStatus(data.connected || {
          twitter: false,
          linkedin: false,
          instagram: false,
          discord: false,
        })
        
        const connectedCount = Object.values(data.connected || {}).filter(Boolean).length
        if (connectedCount > 0) {
          alert(`✅ ${connectedCount} platform(s) connected successfully!`)
        } else {
          alert('⚠️ No platforms connected.\n\nMake sure you saved your credentials first.')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Verification API error:', errorData)
        alert(`❌ Verification failed: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error: any) {
      console.error('Failed to verify connections:', error)
      alert(`❌ Network error: ${error.message || 'Could not reach server'}`)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        alert('Please sign in to save credentials')
        return
      }

      // Build credentials object
      const credentials: any = {}

      if (twitterApiKey || twitterAccessToken) {
        credentials.twitter_config = {
          ...(twitterApiKey && { apiKey: twitterApiKey }),
          ...(twitterApiSecret && { apiSecret: twitterApiSecret }),
          ...(twitterAccessToken && { accessToken: twitterAccessToken }),
          ...(twitterAccessTokenSecret && { accessTokenSecret: twitterAccessTokenSecret }),
          ...(twitterBearerToken && { bearerToken: twitterBearerToken }),
        }
      }

      if (linkedinAccessToken) {
        credentials.linkedin_config = {
          accessToken: linkedinAccessToken,
          ...(linkedinOrgId && { organizationId: linkedinOrgId }),
        }
      }

      if (instagramAccessToken) {
        credentials.instagram_config = {
          accessToken: instagramAccessToken,
          ...(instagramAccountId && { instagramBusinessAccountId: instagramAccountId }),
          ...(instagramPageId && { pageId: instagramPageId }),
        }
      }

      if (discordWebhookUrl || discordBotToken) {
        credentials.discord_config = {
          ...(discordWebhookUrl && { webhookUrl: discordWebhookUrl }),
          ...(discordBotToken && { botToken: discordBotToken }),
          ...(discordChannelId && { channelId: discordChannelId }),
        }
      }

      // Check if table exists first
      const { error: checkError } = await supabase
        .from('social_credentials')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      if (checkError) {
        if (checkError.code === '42P01') {
          // Table doesn't exist
          alert(
            '⚠️ Database table not found!\n\n' +
            'Please run the migration:\n\n' +
            '1. Go to Supabase Dashboard → SQL Editor\n' +
            '2. Copy contents of: sql/migrations/002_social_credentials.sql\n' +
            '3. Paste and run it\n' +
            '4. Try saving again'
          )
          return
        }
        throw checkError
      }

      // Upsert credentials
      const { error, data } = await supabase
        .from('social_credentials')
        .upsert(
          {
            user_id: user.id,
            ...credentials,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id',
          }
        )
        .select()

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        })
        
        let errorMsg = error.message || 'Failed to save credentials'
        
        if (error.code === '42501') {
          errorMsg = 'Permission denied. Check Row Level Security policies in Supabase.'
        } else if (error.code === '42P01') {
          errorMsg = 'Table not found. Please run the migration: sql/migrations/002_social_credentials.sql'
        } else if (error.code === '23505') {
          errorMsg = 'Duplicate entry. This should not happen with upsert.'
        }
        
        throw new Error(errorMsg)
      }

      await verifyConnections()
      alert('✅ Credentials saved successfully!\n\nClick "Verify Connections" to test your Discord webhook.')
    } catch (error: any) {
      console.error('Save error:', error)
      
      // Better error message handling
      let errorMessage = 'Unknown error occurred'
      
      if (error?.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.toString) {
        errorMessage = error.toString()
      } else {
        errorMessage = JSON.stringify(error)
      }
      
      alert(`❌ Failed to save credentials:\n\n${errorMessage}\n\nCheck the browser console (F12) for more details.`)
    } finally {
      setSaving(false)
    }
  }

  const PlatformCard = ({
    platform,
    icon: Icon,
    children,
    docsUrl,
  }: {
    platform: Platform
    icon: any
    children: React.ReactNode
    docsUrl: string
  }) => {
    const isConnected = connectionStatus[platform as keyof ConnectionStatus]

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              <CardTitle className="capitalize">{platform}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Not Connected</span>
                </>
              )}
            </div>
          </div>
          <CardDescription>
            Configure your {platform} API credentials to enable automatic posting
            {docsUrl && (
              <a
                href={docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-primary hover:underline inline-flex items-center gap-1"
              >
                View Docs <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Social Media Connections</h1>
          <p className="text-muted-foreground">
            Connect your social media accounts to enable automatic posting
          </p>
        </div>

        <div className="space-y-6">
          {/* Twitter */}
          <PlatformCard
            platform="twitter"
            icon={Twitter}
            docsUrl="https://developer.twitter.com/en/docs"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Key</label>
                  <Input
                    type="password"
                    value={twitterApiKey}
                    onChange={(e) => setTwitterApiKey(e.target.value)}
                    placeholder="Twitter API Key"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Secret</label>
                  <Input
                    type="password"
                    value={twitterApiSecret}
                    onChange={(e) => setTwitterApiSecret(e.target.value)}
                    placeholder="Twitter API Secret"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Access Token</label>
                  <Input
                    type="password"
                    value={twitterAccessToken}
                    onChange={(e) => setTwitterAccessToken(e.target.value)}
                    placeholder="Access Token"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Access Token Secret</label>
                  <Input
                    type="password"
                    value={twitterAccessTokenSecret}
                    onChange={(e) => setTwitterAccessTokenSecret(e.target.value)}
                    placeholder="Access Token Secret"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bearer Token (Optional)</label>
                <Input
                  type="password"
                  value={twitterBearerToken}
                  onChange={(e) => setTwitterBearerToken(e.target.value)}
                  placeholder="Bearer Token"
                />
              </div>
            </div>
          </PlatformCard>

          {/* LinkedIn */}
          <PlatformCard
            platform="linkedin"
            icon={Linkedin}
            docsUrl="https://learn.microsoft.com/en-us/linkedin/"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Access Token</label>
                <Input
                  type="password"
                  value={linkedinAccessToken}
                  onChange={(e) => setLinkedinAccessToken(e.target.value)}
                  placeholder="LinkedIn Access Token"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization ID (Optional - for company pages)</label>
                <Input
                  value={linkedinOrgId}
                  onChange={(e) => setLinkedinOrgId(e.target.value)}
                  placeholder="Organization ID"
                />
              </div>
            </div>
          </PlatformCard>

          {/* Instagram */}
          <PlatformCard
            platform="instagram"
            icon={Instagram}
            docsUrl="https://developers.facebook.com/docs/instagram-api"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Access Token</label>
                <Input
                  type="password"
                  value={instagramAccessToken}
                  onChange={(e) => setInstagramAccessToken(e.target.value)}
                  placeholder="Instagram Access Token"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Instagram Business Account ID</label>
                  <Input
                    value={instagramAccountId}
                    onChange={(e) => setInstagramAccountId(e.target.value)}
                    placeholder="Account ID"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Facebook Page ID</label>
                  <Input
                    value={instagramPageId}
                    onChange={(e) => setInstagramPageId(e.target.value)}
                    placeholder="Page ID"
                  />
                </div>
              </div>
            </div>
          </PlatformCard>

          {/* Discord */}
          <PlatformCard
            platform="discord"
            icon={MessageSquare}
            docsUrl="https://discord.com/developers/docs"
          >
            <div className="space-y-4">
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <p className="text-sm font-medium text-blue-400 mb-1">💡 Quick Setup Guide</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Need help? Follow these simple steps:
                </p>
                <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Right-click your Discord channel → Edit Channel</li>
                  <li>Click "Integrations" → "Webhooks" → "Create Webhook"</li>
                  <li>Copy the Webhook URL and paste it below</li>
                </ol>
                <p className="text-xs text-muted-foreground mt-2">
                  See <code className="bg-background px-1 rounded">DISCORD_SETUP_GUIDE.md</code> for detailed instructions
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Webhook URL (Recommended - Easier)</label>
                <Input
                  type="password"
                  value={discordWebhookUrl}
                  onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/123456789/abcdefgh..."
                />
                <p className="text-xs text-muted-foreground">
                  Paste your Discord webhook URL here. Get it from: Channel Settings → Integrations → Webhooks
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bot Token</label>
                  <Input
                    type="password"
                    value={discordBotToken}
                    onChange={(e) => setDiscordBotToken(e.target.value)}
                    placeholder="Bot Token"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Channel ID</label>
                  <Input
                    value={discordChannelId}
                    onChange={(e) => setDiscordChannelId(e.target.value)}
                    placeholder="Channel ID"
                  />
                </div>
              </div>
            </div>
          </PlatformCard>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={verifyConnections}>
              Verify Connections
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save All Credentials'}
            </Button>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}

