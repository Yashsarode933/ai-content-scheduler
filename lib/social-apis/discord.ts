/**
 * Discord API Integration
 * Uses Discord Webhooks or Bot API
 */

export interface DiscordConfig {
  webhookUrl?: string // For webhook posting (simpler)
  botToken?: string // For bot API (more features)
  channelId?: string // Required if using bot token
}

export interface DiscordPost {
  content: string
  username?: string
  avatarUrl?: string
  embeds?: Array<{
    title?: string
    description?: string
    color?: number
  }>
}

export class DiscordAPI {
  private config: DiscordConfig

  constructor(config: DiscordConfig) {
    this.config = config
  }

  /**
   * Post to Discord using webhook (simpler method)
   */
  async postViaWebhook(post: DiscordPost): Promise<{ id: string }> {
    if (!this.config.webhookUrl) {
      throw new Error('Webhook URL required for Discord posting')
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: post.content.substring(0, 2000), // Discord message limit
          username: post.username,
          avatar_url: post.avatarUrl,
          embeds: post.embeds,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Discord API error: ${error.message || 'Unknown error'}`)
      }

      const data = await response.json()
      return { id: data.id || Date.now().toString() }
    } catch (error: any) {
      console.error('Discord post error:', error)
      throw new Error(`Failed to post to Discord: ${error.message}`)
    }
  }

  /**
   * Post to Discord using bot API
   */
  async postViaBot(post: DiscordPost): Promise<{ id: string }> {
    if (!this.config.botToken || !this.config.channelId) {
      throw new Error('Bot token and channel ID required')
    }

    try {
      const response = await fetch(
        `https://discord.com/api/v10/channels/${this.config.channelId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bot ${this.config.botToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: post.content.substring(0, 2000),
            embeds: post.embeds,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Discord API error: ${error.message || 'Unknown error'}`)
      }

      const data = await response.json()
      return { id: data.id }
    } catch (error: any) {
      console.error('Discord bot post error:', error)
      throw new Error(`Failed to post to Discord: ${error.message}`)
    }
  }

  /**
   * Post to Discord (auto-selects method)
   */
  async post(post: DiscordPost): Promise<{ id: string }> {
    if (this.config.webhookUrl) {
      return this.postViaWebhook(post)
    } else if (this.config.botToken) {
      return this.postViaBot(post)
    } else {
      throw new Error('Either webhook URL or bot token required')
    }
  }

  /**
   * Verify API connection
   */
  async verifyConnection(): Promise<boolean> {
    if (this.config.webhookUrl) {
      // Test webhook
      try {
        const response = await fetch(this.config.webhookUrl, { method: 'GET' })
        return response.status !== 404
      } catch {
        return false
      }
    } else if (this.config.botToken) {
      // Test bot token
      try {
        const response = await fetch('https://discord.com/api/v10/users/@me', {
          headers: {
            'Authorization': `Bot ${this.config.botToken}`,
          },
        })
        return response.ok
      } catch {
        return false
      }
    }
    return false
  }
}

