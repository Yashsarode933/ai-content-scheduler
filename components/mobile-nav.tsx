'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Sparkles, BarChart3, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileNavProps {
  activeView?: 'calendar' | 'analytics' | 'team'
  onViewChange?: (view: 'calendar' | 'analytics' | 'team') => void
  projectId?: string
}

export function MobileNav({ activeView, onViewChange, projectId }: MobileNavProps = {}) {
  const pathname = usePathname()
  const currentProjectId = projectId || '1'

  const handleNavClick = (view: 'calendar' | 'analytics' | 'team' | 'home' | 'profile', href: string) => {
    if (view === 'home' || view === 'profile') {
      // Navigate to different page
      return
    }
    // Change view within current page
    if (onViewChange && (view === 'calendar' || view === 'analytics' || view === 'team')) {
      onViewChange(view)
    }
  }

  const navItems = [
    { id: 'home', href: '/dashboard', icon: Home, label: 'Home', view: 'home' as const },
    { id: 'calendar', href: `/dashboard/${currentProjectId}`, icon: Calendar, label: 'Calendar', view: 'calendar' as const },
    { id: 'ai', href: `/dashboard/${currentProjectId}`, icon: Sparkles, label: 'AI', view: 'calendar' as const },
    { id: 'analytics', href: `/dashboard/${currentProjectId}`, icon: BarChart3, label: 'Analytics', view: 'analytics' as const },
    { id: 'profile', href: '/dashboard/profile', icon: User, label: 'Profile', view: 'profile' as const },
  ]

  // Add connections link if on dashboard
  const showConnections = pathname?.startsWith('/dashboard') && !pathname?.includes('/dashboard/connections')

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (activeView && item.view === activeView)
          const isLink = item.view === 'home' || item.view === 'profile'
          
          if (isLink) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full',
                  isActive && 'text-primary'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.view, item.href)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full',
                isActive && 'text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

