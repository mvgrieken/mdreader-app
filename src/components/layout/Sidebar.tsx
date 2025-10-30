import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import {
  FileText,
  Search,
  Settings,
  BarChart3,
  FolderOpen,
  Tag,
  Clock,
  Archive,
  Users,
  Zap,
  Menu,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

export interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string | number
  children?: SidebarItem[]
  onClick?: () => void
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarItem[]
  collapsed?: boolean
  onCollapseChange?: (collapsed: boolean) => void
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

/**
 * MDReader Sidebar Component
 * 
 * Moderne sidebar met collapsible navigation
 * - Active state indicators
 * - Nested navigation support
 * - Mobile responsive
 * - User profile section
 */
export const Sidebar: React.FC<SidebarProps> = ({
  className,
  items,
  collapsed = false,
  onCollapseChange,
  user,
  ...props
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  const toggleCollapse = () => {
    onCollapseChange?.(!collapsed)
  }

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)
    const active = isActive(item.href)

    return (
      <div key={item.id}>
        {/* Main item */}
        <div
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer',
            'hover:bg-neutral-100',
            active && 'bg-primary-50 text-primary-700 hover:bg-primary-100',
            collapsed && 'justify-center'
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else if (item.onClick) {
              item.onClick()
            } else if (item.href) {
              // Navigation handled by Next.js Link
            }
          }}
        >
          {item.href ? (
            <Link
              href={item.href}
              className={cn(
                'flex items-center flex-1 min-w-0',
                collapsed && 'justify-center'
              )}
            >
              <div className="flex items-center flex-1 min-w-0">
                <div className="flex-shrink-0 w-5 h-5 text-neutral-500">
                  {item.icon}
                </div>
                {!collapsed && (
                  <>
                    <span className="ml-3 text-sm font-medium truncate">
                      {item.label}
                    </span>
                    {item.badge && (
                      <span className="ml-auto mr-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </div>
            </Link>
          ) : (
            <div className="flex items-center flex-1 min-w-0">
              <div className="flex-shrink-0 w-5 h-5 text-neutral-500">
                {item.icon}
              </div>
              {!collapsed && (
                <>
                  <span className="ml-3 text-sm font-medium truncate">
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="ml-auto mr-2 px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </div>
          )}

          {/* Expand/collapse indicator */}
          {hasChildren && !collapsed && (
            <div className="ml-2">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-neutral-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              )}
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white border-r border-neutral-200 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-primary-600" />
            <span className="text-lg font-semibold text-neutral-900">
              MDReader
            </span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className={cn(
            'p-2',
            collapsed && 'mx-auto'
          )}
        >
          {collapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {items.map((item) => renderSidebarItem(item))}
      </nav>

      {/* User Section */}
      {user && !collapsed && (
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
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
  )
}

/**
 * Default navigation items voor MDReader
 */
export const defaultSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/dashboard'
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FileText className="w-5 h-5" />,
    href: '/dashboard/documents',
    badge: '12',
    children: [
      {
        id: 'all-docs',
        label: 'All Documents',
        icon: <FileText className="w-4 h-4" />,
        href: '/dashboard/documents'
      },
      {
        id: 'recent',
        label: 'Recent',
        icon: <Clock className="w-4 h-4" />,
        href: '/dashboard/documents/recent'
      },
      {
        id: 'archived',
        label: 'Archived',
        icon: <Archive className="w-4 h-4" />,
        href: '/dashboard/documents/archived'
      }
    ]
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: <FolderOpen className="w-5 h-5" />,
    href: '/dashboard/categories',
    badge: '5'
  },
  {
    id: 'tags',
    label: 'Tags',
    icon: <Tag className="w-5 h-5" />,
    href: '/dashboard/tags',
    badge: '23'
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search className="w-5 h-5" />,
    href: '/dashboard/search'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <Zap className="w-5 h-5" />,
    href: '/dashboard/performance'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    href: '/dashboard/settings'
  }
]
