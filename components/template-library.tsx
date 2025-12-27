'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Platform } from '@/lib/types'
import { FileText, Twitter, Linkedin, Instagram, Music, MessageSquare } from 'lucide-react'

const platformIcons: Record<Platform, any> = {
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  tiktok: Music,
  discord: MessageSquare,
}

const templates = [
  {
    id: '1',
    name: 'Twitter Thread',
    platform: 'twitter' as Platform,
    content: 'Thread starter: [Your main point]\n\n1/ [First supporting point]\n2/ [Second supporting point]\n3/ [Call to action]',
    emoji_style: 'minimal',
  },
  {
    id: '2',
    name: 'LinkedIn Post',
    platform: 'linkedin' as Platform,
    content: 'Professional insight: [Your thought]\n\n[Body paragraph with value]\n\nWhat are your thoughts? Let\'s discuss in the comments.',
    emoji_style: 'none',
  },
  {
    id: '3',
    name: 'Instagram Carousel',
    platform: 'instagram' as Platform,
    content: '✨ [Hook]\n\n[Main content with storytelling]\n\n[Call to action]\n\n#hashtag1 #hashtag2 #hashtag3',
    emoji_style: 'rich',
  },
  {
    id: '4',
    name: 'Discord Announcement',
    platform: 'discord' as Platform,
    content: '@everyone 🎉 New Update!\n\n[Announcement details]\n\nShare your thoughts below! 👇',
    emoji_style: 'moderate',
  },
  {
    id: '5',
    name: 'TikTok Script',
    platform: 'tiktok' as Platform,
    content: 'Hook: "You won\'t believe this!"\n\nStory: [30-second story setup]\n\nCall: Follow for more tips!',
    emoji_style: 'trendy',
  },
]

interface TemplateLibraryProps {
  onSelectTemplate: (template: typeof templates[0]) => void
}

export function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Templates
        </CardTitle>
        <CardDescription>Choose a template to get started</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {templates.map((template) => {
          const Icon = platformIcons[template.platform]
          return (
            <Button
              key={template.id}
              variant="outline"
              className="w-full justify-start"
              onClick={() => onSelectTemplate(template)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {template.name}
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

