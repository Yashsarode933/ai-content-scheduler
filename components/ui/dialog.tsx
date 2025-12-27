import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-card p-6 shadow-lg">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => {
  return (
    <>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      {children}
    </>
  )
}

const DialogHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>{children}</div>
}

const DialogTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>{children}</h2>
}

const DialogDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }

