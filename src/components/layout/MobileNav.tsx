import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import {
  Menu,
  X,
  FileText,
  Search,
  Settings,
  BarChart3,
  FolderOpen,
  Tag,
  Zap
} from 'lucide-react'

export interface MobileNavProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

/**
 * MDReader Mobile Navigation Component
 * 
 * Mobile-friendly navigation menu
 * - Slide-out drawer
 * - Touch-friendly interactions
 * - Responsive design
 * - Accessibility support
 */
export const MobileNav: React.FC<MobileNavProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Documents',
      href: '/dashboard/documents',
      icon: <FileText className="w-5 h-5" />
    },
    {
      label: 'Categories',
      href: '/dashboard/categories',
      icon: <FolderOpen className="w-5 h-5" />
    },
    {
      label: 'Tags',
      href: '/dashboard/tags',
      icon: <Tag className="w-5 h-5" />
    },
    {
      label: 'Search',
      href: '/dashboard/search',
      icon: <Search className="w-5 h-5" />
    },
    {
      label: 'Performance',
      href: '/dashboard/performance',
      icon: <Zap className="w-5 h-5" />
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMenu}
          className="p-2"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMenu}
          />

          {/* Menu */}
          <div className="fixed left-0 top-0 h-full w-80 bg-white z-50 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <div className="flex items-center space-x-2">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <span className="text-lg font-semibold text-neutral-900">
                    MDReader
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeMenu}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                      'touch-manipulation', // Faster touch response
                      isActive(item.href)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    )}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-medium">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* User Section */}
              {user && (
                <div className="p-4 border-t border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-700">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Mobile Header Component
 */
export const MobileHeader: React.FC<{
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onBack?: () => void
}> = ({ title, subtitle, actions, user, onBack }) => {
  return (
    <header className="lg:hidden bg-white border-b border-neutral-200">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back button + Title */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="p-2 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            
            {(title || subtitle) && (
              <div className="flex-1 min-w-0">
                {title && (
                  <h1 className="text-lg font-semibold text-neutral-900 truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-neutral-600 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {actions}
            <MobileNav user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}

/**
 * Responsive Container Component
 */
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode
  className?: string
  mobilePadding?: boolean
}> = ({ children, className, mobilePadding = true }) => {
  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        mobilePadding && 'px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </div>
  )
}

/**
 * Mobile Card Component
 */
export const MobileCard: React.FC<{
  children: React.ReactNode
  className?: string
  compact?: boolean
}> = ({ children, className, compact = false }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-neutral-200',
        compact ? 'p-3' : 'p-4',
        'shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
