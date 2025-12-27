/**
 * Instagram API Integration
 * Uses Instagram Graph API (requires Facebook Business account)
 */

export interface InstagramConfig {
  accessToken: string
  instagramBusinessAccountId: string
  pageId: string
}

export interface InstagramPost {
  caption: string
  imageUrl?: string
  mediaType?: 'IMAGE' | 'CAROUSEL'
}

export class InstagramAPI {
  private config: InstagramConfig
  private baseURL = 'https://graph.facebook.com/v18.0'

  constructor(config: InstagramConfig) {
    this.config = config
  }

  /**
   * Post an image to Instagram
   */
  async postImage(post: InstagramPost): Promise<{ id: string }> {
    try {
      // Step 1: Create media container
      const containerResponse = await fetch(
        `${this.baseURL}/${this.config.instagramBusinessAccountId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            image_url: post.imageUrl || '',
            caption: post.caption.substring(0, 2200), // Instagram caption limit
            access_token: this.config.accessToken,
          }),
        }
      )

      if (!containerResponse.ok) {
        const error = await containerResponse.json()
        throw new Error(`Instagram API error: ${error.error?.message || 'Unknown error'}`)
      }

      const containerData = await containerResponse.json()
      const creationId = containerData.id

      // Step 2: Publish the media
      const publishResponse = await fetch(
        `${this.baseURL}/${this.config.instagramBusinessAccountId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            creation_id: creationId,
            access_token: this.config.accessToken,
          }),
        }
      )

      if (!publishResponse.ok) {
        const error = await publishResponse.json()
        throw new Error(`Instagram publish error: ${error.error?.message || 'Unknown error'}`)
      }

      const publishData = await publishResponse.json()
      return { id: publishData.id }
    } catch (error: any) {
      console.error('Instagram post error:', error)
      throw new Error(`Failed to post to Instagram: ${error.message}`)
    }
  }

  /**
   * Verify API connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.baseURL}/${this.config.instagramBusinessAccountId}?fields=id,username&access_token=${this.config.accessToken}`
      )
      return response.ok
    } catch {
      return false
    }
  }
}

