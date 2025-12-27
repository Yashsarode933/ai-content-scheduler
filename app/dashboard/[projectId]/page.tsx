'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Sidebar } from '@/components/sidebar'
import { Calendar } from '@/components/calendar'
import { PostPreview } from '@/components/post-preview'
import { AITools } from '@/components/ai-tools'
import { TemplateLibrary } from '@/components/template-library'
import { Analytics } from '@/components/analytics'
import { TeamCollaboration } from '@/components/team-collaboration'
import { MobileNav } from '@/components/mobile-nav'
import { createClientComponentClient } from '@/lib/supabase'
import { mockPosts } from '@/lib/mockData'
import type { Post } from '@/lib/types'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params?.projectId as string
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [activeView, setActiveView] = useState<'calendar' | 'analytics' | 'team'>('calendar')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // In production, fetch from Supabase
      // const { data } = await supabase
      //   .from('posts')
      //   .select('*')
      //   .eq('project_id', projectId)
      // if (data) setPosts(data)
    }

    checkAuth()
  }, [projectId, router, supabase])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            {activeView === 'calendar' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Calendar
                    posts={posts}
                    onPostSelect={setSelectedPost}
                    onPostUpdate={(updatedPost) => {
                      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
                    }}
                  />
                </div>
                <div className="space-y-6">
                  <TemplateLibrary onSelectTemplate={(template) => {
                    const newPost: Post = {
                      id: `template-${Date.now()}`,
                      user_id: 'current-user',
                      project_id: projectId,
                      title: template.name,
                      content: template.content,
                      platforms: [template.platform],
                      scheduled_at: null,
                      status: 'draft',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                    }
                    setSelectedPost(newPost)
                    setPosts([...posts, newPost])
                  }} />
                  <AITools projectId={projectId} onPostGenerated={(post) => {
                    setPosts([...posts, post])
                    setSelectedPost(post)
                  }} />
                  {selectedPost && (
                    <PostPreview post={selectedPost} onUpdate={(updated) => {
                      setPosts(posts.map(p => p.id === updated.id ? updated : p))
                      setSelectedPost(updated)
                    }} />
                  )}
                </div>
              </div>
            )}
            {activeView === 'analytics' && <Analytics projectId={projectId} />}
            {activeView === 'team' && <TeamCollaboration projectId={projectId} />}
          </main>
        </div>
      </div>
      <MobileNav 
        activeView={activeView} 
        onViewChange={setActiveView}
        projectId={projectId}
      />
    </div>
  )
}

