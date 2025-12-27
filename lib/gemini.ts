import { GoogleGenerativeAI } from '@google/generative-ai'
import type { Platform, GeminiResponse, TrendPrediction, RepurposingVariants, PerformanceAnalysis } from './types'

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY

if (!apiKey) {
  console.warn('Gemini API key not found. AI features will be limited.')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null

export async function generateCaption(
  topic: string,
  platform: Platform,
  charLimit: number = 280
): Promise<GeminiResponse> {
  if (!model) {
    // Fallback mock response
    return {
      caption: `Check out this amazing content about ${topic}! 🚀`,
      hashtags: ['#content', '#social'],
      emoji: '🚀',
      cta: 'Learn more!',
    }
  }

  const platformStyles: Record<Platform, string> = {
    twitter: 'casual, engaging, with trending hashtags',
    linkedin: 'professional, thought-provoking, no emojis',
    instagram: 'visual, emoji-rich, hashtag-heavy',
    tiktok: 'trendy, hook-driven, casual',
    discord: 'community-focused, mention-friendly, emoji-optional',
  }

  const prompt = `Generate a viral ${platform} post about "${topic}". 
Style: ${platformStyles[platform]}
Include 2-3 relevant hashtags, 1-2 emojis (unless LinkedIn), and a clear CTA.
Keep under ${charLimit} characters.
Output ONLY valid JSON: {"caption": "...", "hashtags": ["#tag1", "#tag2"], "emoji": "🚀", "cta": "..."}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Invalid JSON response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      caption: `Exciting update about ${topic}! 🎉`,
      hashtags: ['#update', '#news'],
      emoji: '🎉',
      cta: 'Stay tuned!',
    }
  }
}

export async function predictTrends(niche: string): Promise<TrendPrediction[]> {
  if (!model) {
    return [
      {
        topic: `${niche} automation tools`,
        predicted_score: 8.5,
        post_idea: `Share how ${niche} automation is changing the game in 2024`,
      },
      {
        topic: `${niche} best practices`,
        predicted_score: 7.8,
        post_idea: `Create a thread on top 5 ${niche} strategies that work`,
      },
      {
        topic: `${niche} community growth`,
        predicted_score: 7.2,
        post_idea: `Discuss building authentic ${niche} communities`,
      },
    ]
  }

  const prompt = `Analyze current trends in "${niche}". Predict top 3 trending topics for the next 7 days based on Google Trends data. 
For each topic, suggest 1 post idea.
Output ONLY valid JSON: {"trends": [{"topic": "...", "predicted_score": 8.5, "post_idea": "..."}]}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      return data.trends || []
    }
    
    throw new Error('Invalid JSON response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return [
      {
        topic: `${niche} trends`,
        predicted_score: 7.0,
        post_idea: `Explore the latest ${niche} trends`,
      },
    ]
  }
}

export async function repurposeContent(content: string): Promise<RepurposingVariants> {
  if (!model) {
    return {
      twitter: [
        `${content.substring(0, 250)}... 🚀`,
        `Thread 2: More insights coming! 💡`,
        `Thread 3: Final thoughts on this topic. ✨`,
      ],
      linkedin: `${content}\n\nWhat are your thoughts on this? Let's discuss in the comments.`,
      tiktok: `Hook: "You won't believe this!"\n\nStory: ${content.substring(0, 200)}\n\nCall: Follow for more!`,
      instagram: `${content}\n\n#content #social #marketing #growth 🚀✨💡`,
      discord: `@everyone New update! 🎉\n\n${content}\n\nShare your thoughts below! 👇`,
    }
  }

  const prompt = `Take this content: "${content}". Create 5 platform-specific variants:
1. Twitter thread (3 tweets, max 280 chars each, numbered)
2. LinkedIn professional post (no emojis, formal tone)
3. TikTok script (casual, 30s duration note, format: Hook-Story-Call)
4. Instagram caption (max 2200 chars, hashtags, emojis)
5. Discord announcement (mention-friendly, emojis, clear)

Output ONLY valid JSON:
{
  "variants": {
    "twitter": ["tweet1", "tweet2", "tweet3"],
    "linkedin": "post text",
    "tiktok": "script text",
    "instagram": "caption text",
    "discord": "announcement text"
  }
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      return data.variants || {
        twitter: [content.substring(0, 280)],
        linkedin: content,
        tiktok: content,
        instagram: content,
        discord: content,
      }
    }
    
    throw new Error('Invalid JSON response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      twitter: [content.substring(0, 280)],
      linkedin: content,
      tiktok: content,
      instagram: content,
      discord: content,
    }
  }
}

export async function analyzePerformance(
  views: number,
  likes: number,
  shares: number
): Promise<PerformanceAnalysis> {
  if (!model) {
    const engagementRate = views > 0 ? ((likes + shares) / views) * 100 : 0
    return {
      quality_score: engagementRate > 5 ? 8 : 5,
      engagement_rate: engagementRate,
      improvement_tips: [
        'Post at optimal times',
        'Use more engaging visuals',
        'Include clear CTAs',
      ],
    }
  }

  const prompt = `Analyze this post performance: views=${views}, likes=${likes}, shares=${shares}.
Rate quality 1-10. Calculate engagement rate. Suggest 3 improvement tips.
Output ONLY valid JSON:
{
  "quality_score": 8.5,
  "engagement_rate": 5.2,
  "improvement_tips": ["tip1", "tip2", "tip3"]
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      return {
        quality_score: data.quality_score || 7,
        engagement_rate: data.engagement_rate || ((likes + shares) / views) * 100,
        improvement_tips: data.improvement_tips || [],
      }
    }
    
    throw new Error('Invalid JSON response')
  } catch (error) {
    console.error('Gemini API error:', error)
    const engagementRate = views > 0 ? ((likes + shares) / views) * 100 : 0
    return {
      quality_score: 7,
      engagement_rate: engagementRate,
      improvement_tips: ['Optimize posting times', 'Improve content quality'],
    }
  }
}

