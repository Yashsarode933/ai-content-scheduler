'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, TrendingUp, Repeat, Mic } from 'lucide-react'
import { generateCaption, predictTrends, repurposeContent } from '@/lib/gemini'
import { cn } from '@/lib/utils'
import type { Post, Platform } from '@/lib/types'

interface AIToolsProps {
  projectId: string
  onPostGenerated: (post: Post) => void
}

export function AITools({ projectId, onPostGenerated }: AIToolsProps) {
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState<Platform>('twitter')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setLoading(true)
    try {
      const result = await generateCaption(topic, platform)
      const newPost: Post = {
        id: `post-${Date.now()}`,
        user_id: 'current-user',
        project_id: projectId,
        title: topic,
        content: `${result.caption} ${result.hashtags.join(' ')} ${result.emoji}`,
        platforms: [platform],
        scheduled_at: null,
        status: 'draft',
        gemini_variants: { [platform]: result.caption },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      onPostGenerated(newPost)
      setTopic('')
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser')
      return
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setTopic(transcript)
      setIsListening(false)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Tools</CardTitle>
        <CardDescription>Generate content with AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic</label>
          <div className="flex gap-2">
            <Input
              placeholder="What's your post about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              disabled={isListening}
              aria-label="Voice input"
            >
              <Mic className={cn('h-4 w-4', isListening && 'animate-pulse text-primary')} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="discord">Discord</option>
          </select>
        </div>

        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Post'}
        </Button>

        <div className="pt-4 border-t space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              setLoading(true)
              try {
                const trends = await predictTrends('technology')
                alert(`Top trend: ${trends[0]?.topic} (Score: ${trends[0]?.predicted_score})`)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Predict Trends
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              if (!topic.trim()) {
                alert('Enter content to repurpose first')
                return
              }
              setLoading(true)
              try {
                const variants = await repurposeContent(topic)
                alert(`Generated 5 platform variants! Check console for details.`)
                console.log('Repurposed variants:', variants)
              } finally {
                setLoading(false)
              }
            }}
            disabled={loading || !topic.trim()}
          >
            <Repeat className="mr-2 h-4 w-4" />
            Repurpose Content
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

