import React, { useState } from 'react'
import { Sidebar, defaultSidebarItems } from './Sidebar'
import { Container } from './Container'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { MobileNav, MobileHeader } from './MobileNav'
import { cn } from '@/lib/utils/cn'

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title?: string
  subtitle?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  actions?: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

/**
 * MDReader Dashboard Layout Component
 * 
 * Complete dashboard layout met sidebar en header
 * - Responsive sidebar
 * - Breadcrumb navigation
 * - Page actions
 * - Error boundaries
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  className,
  children,
  title,
  subtitle,
  breadcrumbs,
  actions,
  user,
  ...props
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className={cn('min-h-screen bg-neutral-50 dark:bg-neutral-900', className)}>
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
          <Sidebar
            items={defaultSidebarItems}
            collapsed={sidebarCollapsed}
            onCollapseChange={setSidebarCollapsed}
            user={user}
            className="h-full"
          />
        </div>

        {/* Main Content */}
        <div
          className={cn(
            'flex-1 transition-all duration-300',
            'lg:block hidden',
            sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
          )}
        >
          {/* Desktop Header */}
          {(title || breadcrumbs || actions) && (
            <header className="hidden lg:block bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <Container>
                <div className="py-6">
                  {/* Breadcrumbs */}
                  {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex mb-4" aria-label="Breadcrumb">
                      <ol className="flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                          <li key={index} className="flex items-center">
                            {index > 0 && (
                              <svg
                                className="w-4 h-4 text-neutral-400 dark:text-neutral-500 mx-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {crumb.href ? (
                              <a
                                href={crumb.href}
                                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                              >
                                {crumb.label}
                              </a>
                            ) : (
                              <span className="text-neutral-900 dark:text-neutral-50 font-medium">
                                {crumb.label}
                              </span>
                            )}
                          </li>
                        ))}
                      </ol>
                    </nav>
                  )}

                  {/* Page Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {title && (
                        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                          {title}
                        </h1>
                      )}
                      {subtitle && (
                        <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                          {subtitle}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 ml-4 flex-shrink-0">
                      <ThemeToggle />
                      {actions}
                    </div>
                  </div>
                </div>
              </Container>
            </header>
          )}

          {/* Desktop Main Content */}
          <main className="hidden lg:block">
            <Container>
              <div className="py-6">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </Container>
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex-1">
          {/* Mobile Header */}
          <MobileHeader
            title={title}
            subtitle={subtitle}
            actions={
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                {actions}
              </div>
            }
            user={user}
          />

          {/* Mobile Main Content */}
          <main>
            <Container size="sm">
              <div className="py-4">
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </div>
            </Container>
          </main>
        </div>
      </div>
    </div>
  )
}
