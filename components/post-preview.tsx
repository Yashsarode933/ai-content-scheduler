'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Post, Platform } from '@/lib/types'
import { Save, Calendar, Trash2 } from 'lucide-react'

interface PostPreviewProps {
  post: Post
  onUpdate: (post: Post) => void
}

const platformIcons: Record<Platform, string> = {
  twitter: '🐦',
  linkedin: '💼',
  instagram: '📷',
  tiktok: '🎵',
  discord: '💬',
}

export function PostPreview({ post, onUpdate }: PostPreviewProps) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : ''
  )

  const handleSave = () => {
    onUpdate({
      ...post,
      title,
      content,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      status: scheduledAt ? 'scheduled' : 'draft',
      updated_at: new Date().toISOString(),
    })
  }

  const handleDelete = () => {
    if (confirm('Delete this post?')) {
      // In production, delete from Supabase
      console.log('Delete post:', post.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Post Preview
          <div className="flex gap-1">
            {post.platforms.map((platform) => (
              <span key={platform} className="text-2xl" title={platform}>
                {platformIcons[platform]}
              </span>
            ))}
          </div>
        </CardTitle>
        <CardDescription>Edit and schedule your post</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Post content..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Schedule</label>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Platforms</label>
          <div className="flex gap-2 flex-wrap">
            {(['twitter', 'linkedin', 'instagram', 'tiktok', 'discord'] as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => {
                  const newPlatforms = post.platforms.includes(platform)
                    ? post.platforms.filter(p => p !== platform)
                    : [...post.platforms, platform]
                  onUpdate({ ...post, platforms: newPlatforms })
                }}
                className={`px-3 py-1 rounded-md text-sm border ${
                  post.platforms.includes(platform)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-input'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Platform Previews */}
        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-medium">Preview</h4>
          {post.platforms.map((platform) => (
            <div
              key={platform}
              className="p-3 rounded-md border bg-muted/50 text-sm"
            >
              <div className="font-medium mb-1 capitalize">{platform}</div>
              <div className="text-muted-foreground line-clamp-3">{content || 'No content yet'}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

