/**
 * Twitter/X API Integration
 * Uses Twitter API v2 for posting tweets
 */

export interface TwitterConfig {
  apiKey: string
  apiSecret: string
  accessToken: string
  accessTokenSecret: string
  bearerToken?: string
}

export interface TwitterPost {
  text: string
  mediaIds?: string[]
  replyToTweetId?: string
}

export class TwitterAPI {
  private config: TwitterConfig
  private baseURL = 'https://api.twitter.com/2'

  constructor(config: TwitterConfig) {
    this.config = config
  }

  /**
   * Post a tweet
   */
  async postTweet(post: TwitterPost): Promise<{ id: string; text: string }> {
    try {
      const response = await fetch(`${this.baseURL}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken || this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: post.text.substring(0, 280), // Twitter character limit
          ...(post.mediaIds && { media: { media_ids: post.mediaIds } }),
          ...(post.replyToTweetId && { reply: { in_reply_to_tweet_id: post.replyToTweetId } }),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Twitter API error: ${error.detail || error.title || 'Unknown error'}`)
      }

      const data = await response.json()
      return {
        id: data.data.id,
        text: data.data.text,
      }
    } catch (error: any) {
      console.error('Twitter post error:', error)
      throw new Error(`Failed to post to Twitter: ${error.message}`)
    }
  }

  /**
   * Post a thread (multiple tweets)
   */
  async postThread(tweets: string[]): Promise<{ ids: string[] }> {
    const ids: string[] = []
    let replyToId: string | undefined

    for (const tweet of tweets) {
      const result = await this.postTweet({
        text: tweet,
        replyToTweetId: replyToId,
      })
      ids.push(result.id)
      replyToId = result.id
      // Small delay between tweets
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return { ids }
  }

  /**
   * Verify API connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken || this.config.accessToken}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

