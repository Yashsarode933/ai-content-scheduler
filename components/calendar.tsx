'use client'

import { useState, useMemo } from 'react'
import { Calendar as BigCalendar, momentLocalizer, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import type { Post, Platform } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const localizer = momentLocalizer(moment)

interface CalendarProps {
  posts: Post[]
  onPostSelect: (post: Post) => void
  onPostUpdate: (post: Post) => void
}

const platformColors: Record<Platform, string> = {
  twitter: '#1DA1F2',
  linkedin: '#0077B5',
  instagram: '#E4405F',
  tiktok: '#000000',
  discord: '#5865F2',
}

export function Calendar({ posts, onPostSelect, onPostUpdate }: CalendarProps) {
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())

  const events = useMemo(() => {
    return posts
      .filter(post => post.scheduled_at)
      .map(post => ({
        id: post.id,
        title: post.title,
        start: new Date(post.scheduled_at!),
        end: new Date(new Date(post.scheduled_at!).getTime() + 30 * 60000), // 30 min event
        resource: post,
        style: {
          backgroundColor: post.platforms[0] ? platformColors[post.platforms[0]] : '#6366f1',
          borderColor: post.platforms[0] ? platformColors[post.platforms[0]] : '#6366f1',
        },
      }))
  }, [posts])

  const eventStyleGetter = (event: any) => {
    return {
      style: {
        ...event.style,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  const handleSelectEvent = (event: any) => {
    onPostSelect(event.resource)
  }

  const handleSelectSlot = ({ start }: { start: Date }) => {
    // Create new post at selected time
    const newPost: Post = {
      id: `new-${Date.now()}`,
      user_id: 'current-user',
      title: 'New Post',
      content: '',
      platforms: ['twitter'],
      scheduled_at: start.toISOString(),
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    onPostSelect(newPost)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '600px' }} className="dark:text-foreground">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            style={{ height: '100%' }}
            className="dark:bg-card dark:text-foreground"
          />
        </div>
        <div className="mt-4 flex gap-4 flex-wrap">
          {Object.entries(platformColors).map(([platform, color]) => (
            <div key={platform} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              <span className="text-sm capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

