/**
 * Social Media API Integration Hub
 * Centralized interface for all platform APIs
 */

import { TwitterAPI, TwitterConfig, TwitterPost } from './twitter'
import { LinkedInAPI, LinkedInConfig, LinkedInPost } from './linkedin'
import { InstagramAPI, InstagramConfig, InstagramPost } from './instagram'
import { DiscordAPI, DiscordConfig, DiscordPost } from './discord'
import type { Platform } from '@/lib/types'

export interface SocialMediaConfig {
  twitter?: TwitterConfig
  linkedin?: LinkedInConfig
  instagram?: InstagramConfig
  discord?: DiscordConfig
}

export interface SocialPost {
  content: string
  platform: Platform
  mediaUrl?: string
  options?: Record<string, any>
}

export class SocialMediaManager {
  private config: SocialMediaConfig
  private apis: {
    twitter?: TwitterAPI
    linkedin?: LinkedInAPI
    instagram?: InstagramAPI
    discord?: DiscordAPI
  } = {}

  constructor(config: SocialMediaConfig) {
    this.config = config

    // Initialize API clients
    if (config.twitter) {
      this.apis.twitter = new TwitterAPI(config.twitter)
    }
    if (config.linkedin) {
      this.apis.linkedin = new LinkedInAPI(config.linkedin)
    }
    if (config.instagram) {
      this.apis.instagram = new InstagramAPI(config.instagram)
    }
    if (config.discord) {
      this.apis.discord = new DiscordAPI(config.discord)
    }
  }

  /**
   * Post to a specific platform
   */
  async post(post: SocialPost): Promise<{ id: string; platform: Platform }> {
    switch (post.platform) {
      case 'twitter':
        if (!this.apis.twitter) {
          throw new Error('Twitter API not configured')
        }
        const twitterResult = await this.apis.twitter.postTweet({
          text: post.content,
        })
        return { id: twitterResult.id, platform: 'twitter' }

      case 'linkedin':
        if (!this.apis.linkedin) {
          throw new Error('LinkedIn API not configured')
        }
        const linkedinResult = await this.apis.linkedin.postToProfile({
          text: post.content,
          visibility: 'PUBLIC',
        })
        return { id: linkedinResult.id, platform: 'linkedin' }

      case 'instagram':
        if (!this.apis.instagram) {
          throw new Error('Instagram API not configured')
        }
        const instagramResult = await this.apis.instagram.postImage({
          caption: post.content,
          imageUrl: post.mediaUrl,
        })
        return { id: instagramResult.id, platform: 'instagram' }

      case 'discord':
        if (!this.apis.discord) {
          throw new Error('Discord API not configured')
        }
        const discordResult = await this.apis.discord.post({
          content: post.content,
        })
        return { id: discordResult.id, platform: 'discord' }

      case 'tiktok':
        // TikTok API requires special approval and is more complex
        throw new Error('TikTok API integration requires special approval. Not available yet.')

      default:
        throw new Error(`Unsupported platform: ${post.platform}`)
    }
  }

  /**
   * Post to multiple platforms
   */
  async postToMultiple(
    content: string,
    platforms: Platform[],
    mediaUrl?: string
  ): Promise<Array<{ id: string; platform: Platform; success: boolean; error?: string }>> {
    const results = await Promise.allSettled(
      platforms.map(async (platform) => {
        try {
          const result = await this.post({ content, platform, mediaUrl })
          return { ...result, success: true }
        } catch (error: any) {
          return {
            id: '',
            platform,
            success: false,
            error: error.message,
          }
        }
      })
    )

    return results.map((result) =>
      result.status === 'fulfilled' ? result.value : result.reason
    )
  }

  /**
   * Verify all configured connections
   */
  async verifyAllConnections(): Promise<Record<Platform, boolean>> {
    const results: Record<string, boolean> = {}

    if (this.apis.twitter) {
      results.twitter = await this.apis.twitter.verifyConnection()
    }
    if (this.apis.linkedin) {
      results.linkedin = await this.apis.linkedin.verifyConnection()
    }
    if (this.apis.instagram) {
      results.instagram = await this.apis.instagram.verifyConnection()
    }
    if (this.apis.discord) {
      results.discord = await this.apis.discord.verifyConnection()
    }

    return results as Record<Platform, boolean>
  }
}

