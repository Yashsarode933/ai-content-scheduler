export type Platform = 'twitter' | 'linkedin' | 'instagram' | 'tiktok' | 'discord'

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export type CollaboratorRole = 'owner' | 'editor' | 'viewer'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  project_id?: string
  title: string
  content: string
  platforms: Platform[]
  scheduled_at: string | null
  status: PostStatus
  gemini_variants?: Record<Platform, string>
  performance_score?: number
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  user_id: string
  name: string
  platform: Platform
  content: string
  emoji_style: string
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Collaborator {
  id: string
  project_id: string
  user_id: string
  role: CollaboratorRole
  created_at: string
}

export interface PostAnalytics {
  id: string
  post_id: string
  platform: Platform
  views: number
  likes: number
  shares: number
  engagement_rate: number
  tracked_at: string
}

export interface GeminiResponse {
  caption: string
  hashtags: string[]
  emoji: string
  cta?: string
}

export interface TrendPrediction {
  topic: string
  predicted_score: number
  post_idea: string
}

export interface RepurposingVariants {
  twitter: string[]
  linkedin: string
  tiktok: string
  instagram: string
  discord: string
}

export interface PerformanceAnalysis {
  quality_score: number
  engagement_rate: number
  improvement_tips: string[]
}

