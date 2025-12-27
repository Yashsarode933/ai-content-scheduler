import type { Post, PostAnalytics, TrendPrediction, Project } from './types'

export const mockProjects: Project[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'Tech Startup Launch',
    description: 'Content for our product launch campaign',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Personal Brand',
    description: 'Building my personal brand on social media',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    name: 'Community Growth',
    description: 'Growing our Discord community',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockPosts: Post[] = [
  {
    id: '1',
    user_id: 'user-1',
    project_id: '1',
    title: 'Product Launch Announcement',
    content: 'We\'re excited to announce our new AI-powered content scheduler! 🚀 #AI #ProductLaunch',
    platforms: ['twitter', 'linkedin'],
    scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
    performance_score: 8.5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    project_id: '1',
    title: 'Feature Highlight',
    content: 'Check out our new drag-and-drop calendar interface! 📅✨',
    platforms: ['instagram'],
    scheduled_at: new Date(Date.now() + 172800000).toISOString(),
    status: 'scheduled',
    performance_score: 7.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    project_id: '2',
    title: 'Weekly Tips',
    content: '5 tips for better content scheduling this week 💡',
    platforms: ['twitter', 'linkedin', 'discord'],
    scheduled_at: null,
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockAnalytics: PostAnalytics[] = [
  {
    id: '1',
    post_id: '1',
    platform: 'twitter',
    views: 1250,
    likes: 89,
    shares: 23,
    engagement_rate: 8.96,
    tracked_at: new Date().toISOString(),
  },
  {
    id: '2',
    post_id: '1',
    platform: 'linkedin',
    views: 890,
    likes: 67,
    shares: 12,
    engagement_rate: 8.88,
    tracked_at: new Date().toISOString(),
  },
  {
    id: '3',
    post_id: '2',
    platform: 'instagram',
    views: 2100,
    likes: 156,
    shares: 45,
    engagement_rate: 9.57,
    tracked_at: new Date().toISOString(),
  },
]

export const mockTrends: TrendPrediction[] = [
  {
    topic: 'AI Content Creation',
    predicted_score: 9.2,
    post_idea: 'Share how AI is revolutionizing content creation workflows',
  },
  {
    topic: 'Social Media Automation',
    predicted_score: 8.7,
    post_idea: 'Discuss the future of automated social media management',
  },
  {
    topic: 'Creator Economy Growth',
    predicted_score: 8.1,
    post_idea: 'Explore trends in the growing creator economy',
  },
]

