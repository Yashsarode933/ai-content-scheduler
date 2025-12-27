/**
 * LinkedIn API Integration
 * Uses LinkedIn API v2 for posting
 */

export interface LinkedInConfig {
  accessToken: string
  organizationId?: string // For company pages
}

export interface LinkedInPost {
  text: string
  visibility: 'PUBLIC' | 'CONNECTIONS'
}

export class LinkedInAPI {
  private config: LinkedInConfig
  private baseURL = 'https://api.linkedin.com/v2'

  constructor(config: LinkedInConfig) {
    this.config = config
  }

  /**
   * Post to LinkedIn personal profile
   */
  async postToProfile(post: LinkedInPost): Promise<{ id: string }> {
    try {
      // Get user's person ID first
      const userResponse = await fetch(`${this.baseURL}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
      })

      if (!userResponse.ok) {
        throw new Error('Failed to get LinkedIn user info')
      }

      const userData = await userResponse.json()
      const personId = userData.sub

      // Create UGC Post
      const ugcResponse = await fetch(`${this.baseURL}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: `urn:li:person:${personId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.text,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': post.visibility,
          },
        }),
      })

      if (!ugcResponse.ok) {
        const error = await ugcResponse.json()
        throw new Error(`LinkedIn API error: ${error.message || 'Unknown error'}`)
      }

      const data = await ugcResponse.json()
      return { id: data.id }
    } catch (error: any) {
      console.error('LinkedIn post error:', error)
      throw new Error(`Failed to post to LinkedIn: ${error.message}`)
    }
  }

  /**
   * Post to LinkedIn company page
   */
  async postToCompany(post: LinkedInPost): Promise<{ id: string }> {
    if (!this.config.organizationId) {
      throw new Error('Organization ID required for company posts')
    }

    try {
      const response = await fetch(`${this.baseURL}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0',
        },
        body: JSON.stringify({
          author: `urn:li:organization:${this.config.organizationId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.text,
              },
              shareMediaCategory: 'NONE',
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`LinkedIn API error: ${error.message || 'Unknown error'}`)
      }

      const data = await response.json()
      return { id: data.id }
    } catch (error: any) {
      console.error('LinkedIn company post error:', error)
      throw new Error(`Failed to post to LinkedIn: ${error.message}`)
    }
  }

  /**
   * Verify API connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/userinfo`, {
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

