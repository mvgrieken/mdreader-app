'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'
import { Sun, Moon, Monitor } from 'lucide-react'

type Theme = 'light' | 'dark' | 'system'

export interface ThemeToggleProps {
  variant?: 'button' | 'dropdown'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * MDReader Theme Toggle Component
 * 
 * Dark mode toggle met system preference support
 * - Local storage persistence
 * - System theme detection
 * - Smooth transitions
 * - Accessibility support
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  variant = 'button',
  size = 'md'
}) => {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as Theme
    if (saved) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  if (!mounted) {
    return (
      <div className={cn('w-9 h-9', className)} />
    )
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative', className)}>
        <Button
          variant="ghost"
          size={size}
          className="w-full justify-start"
          icon={theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        >
          {theme === 'system' ? 'System' : theme === 'dark' ? 'Dark' : 'Light'}
        </Button>
        
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50">
          <button
            className={cn(
              'w-full flex items-center px-3 py-2 text-sm hover:bg-neutral-50',
              theme === 'light' && 'bg-primary-50 text-primary-700'
            )}
            onClick={() => handleThemeChange('light')}
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </button>
          <button
            className={cn(
              'w-full flex items-center px-3 py-2 text-sm hover:bg-neutral-50',
              theme === 'dark' && 'bg-primary-50 text-primary-700'
            )}
            onClick={() => handleThemeChange('dark')}
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </button>
          <button
            className={cn(
              'w-full flex items-center px-3 py-2 text-sm hover:bg-neutral-50',
              theme === 'system' && 'bg-primary-50 text-primary-700'
            )}
            onClick={() => handleThemeChange('system')}
          >
            <Monitor className="w-4 h-4 mr-2" />
            System
          </button>
        </div>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')}
      icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      className={cn(
        'relative',
        'transition-all duration-200',
        'hover:bg-neutral-100 dark:hover:bg-neutral-800',
        className
      )}
    />
  )
}

/**
 * Hook for theme management
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme
    if (saved) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}
