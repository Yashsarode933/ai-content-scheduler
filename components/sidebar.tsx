'use client'

import Link from 'next/link'
import { Calendar, BarChart3, Users, Settings, Link2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeView: 'calendar' | 'analytics' | 'team'
  onViewChange: (view: 'calendar' | 'analytics' | 'team') => void
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-card p-4 space-y-2">
      <Button
        variant={activeView === 'calendar' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('calendar')}
      >
        <Calendar className="mr-2 h-4 w-4" />
        Calendar
      </Button>
      <Button
        variant={activeView === 'analytics' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('analytics')}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button
        variant={activeView === 'team' ? 'default' : 'ghost'}
        className="w-full justify-start"
        onClick={() => onViewChange('team')}
      >
        <Users className="mr-2 h-4 w-4" />
        Team
      </Button>
      <div className="pt-4 border-t space-y-2">
        <Link href="/dashboard/connections">
          <Button variant="ghost" className="w-full justify-start">
            <Link2 className="mr-2 h-4 w-4" />
            Connections
          </Button>
        </Link>
        <Button variant="ghost" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>
    </aside>
  )
}

