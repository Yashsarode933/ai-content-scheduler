'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, ThumbsUp, ThumbsDown, Copy } from 'lucide-react'

interface TeamCollaborationProps {
  projectId: string
}

export function TeamCollaboration({ projectId }: TeamCollaborationProps) {
  const [inviteLink, setInviteLink] = useState(`https://app.com/invite/${projectId}`)
  const [members] = useState([
    { id: '1', name: 'You', email: 'you@example.com', role: 'owner' },
    { id: '2', name: 'John Doe', email: 'john@example.com', role: 'editor' },
    { id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'viewer' },
  ])

  const [approvals] = useState([
    { id: '1', post: 'Product Launch Announcement', user: 'John Doe', vote: 'up', time: '2h ago' },
    { id: '2', post: 'Feature Highlight', user: 'Jane Smith', vote: 'down', time: '5h ago' },
  ])

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    alert('Invite link copied!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Team Collaboration</h2>
        <p className="text-muted-foreground">Manage team members and approvals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>People with access to this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
                <div className="px-2 py-1 text-xs rounded-md bg-secondary capitalize">
                  {member.role}
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
          <CardDescription>Share this link to invite team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={inviteLink} readOnly className="flex-1" />
            <Button onClick={copyInviteLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Approvals</CardTitle>
          <CardDescription>Team feedback on draft posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {approvals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex-1">
                  <div className="font-medium">{approval.post}</div>
                  <div className="text-sm text-muted-foreground">
                    {approval.user} • {approval.time}
                  </div>
                </div>
                <div>
                  {approval.vote === 'up' ? (
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

