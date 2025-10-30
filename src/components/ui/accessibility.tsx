import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Skip Link Component
 * 
 * Accessibility feature for keyboard navigation
 */
export const SkipLink: React.FC<{
  href: string
  children: React.ReactNode
  className?: string
}> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        'absolute top-0 left-0 -translate-y-full -translate-x-full',
        'bg-primary-600 text-white px-4 py-2 rounded-md',
        'focus:translate-y-0 focus:translate-x-0',
        'z-50 transition-transform duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        className
      )}
    >
      {children}
    </a>
  )
}

/**
 * Focus Trap Hook
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>

    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstElement.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      
      // Restore focus
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isActive])

  return containerRef
}

/**
 * Announcer Component for Screen Readers
 */
export const Announcer: React.FC<{
  message: string
  politeness?: 'polite' | 'assertive' | 'off'
  className?: string
}> = ({ message, politeness = 'polite', className }) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className={cn('sr-only', className)}
    >
      {message}
    </div>
  )
}

/**
 * Use Announcer Hook
 */
export const useAnnouncer = () => {
  const [message, setMessage] = useState('')
  const [politeness, setPoliteness] = useState<'polite' | 'assertive'>('polite')

  const announce = (newMessage: string, newPoliteness?: 'polite' | 'assertive') => {
    setMessage('')
    setTimeout(() => {
      setMessage(newMessage)
      if (newPoliteness) setPoliteness(newPoliteness)
    }, 100)
  }

  const AnnouncerComponent = () => (
    <Announcer message={message} politeness={politeness} />
  )

  return { announce, AnnouncerComponent }
}

/**
 * Keyboard Navigation Hook
 */
export const useKeyboardNavigation = (
  items: Array<{ id: string; element?: HTMLElement }>,
  onSelect?: (id: string) => void
) => {
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setFocusedIndex(prev => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setFocusedIndex(prev => (prev - 1 + items.length) % items.length)
        break
      case 'Home':
        e.preventDefault()
        setFocusedIndex(0)
        break
      case 'End':
        e.preventDefault()
        setFocusedIndex(items.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (focusedIndex >= 0 && onSelect) {
          onSelect(items[focusedIndex].id)
        }
        break
      case 'Escape':
        e.preventDefault()
        setFocusedIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (focusedIndex >= 0 && items[focusedIndex]?.element) {
      items[focusedIndex].element?.focus()
    }
  }, [focusedIndex, items])

  return { focusedIndex, handleKeyDown, setFocusedIndex }
}

/**
 * Accessible Button Component
 */
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  icon,
  iconPosition = 'left',
  disabled,
  className,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:ring-neutral-200',
    outline: 'border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-200',
    ghost: 'text-neutral-600 hover:bg-neutral-100 focus:ring-neutral-200'
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={loading || disabled}
      aria-disabled={loading || disabled}
      aria-describedby={loading ? 'loading-description' : undefined}
      {...props}
    >
      {loading && (
        <div 
          id="loading-description"
          className="sr-only"
          aria-live="polite"
        >
          {loadingText}
        </div>
      )}
      
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span>{loading ? loadingText : children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
    </button>
  )
}

/**
 * Accessible Form Field Component
 */
export interface FormFieldProps {
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactElement
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required = false,
  children
}) => {
  const fieldId = React.useId()
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  const clonedChild = React.cloneElement(children, {
    id: fieldId,
    'aria-describedby': [
      hint ? hintId : null,
      error ? errorId : null
    ].filter(Boolean).join(' '),
    'aria-invalid': error ? 'true' : 'false',
    'aria-required': required
  } as any)

  return (
    <div className="space-y-1">
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {hint && (
        <p id={hintId} className="text-sm text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>
      )}
      
      {clonedChild}
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Live Region Component
 */
export const LiveRegion: React.FC<{
  children: React.ReactNode
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  className?: string
}> = ({ 
  children, 
  politeness = 'polite', 
  atomic = false, 
  relevant = 'additions text',
  className 
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant as any}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  )
}

/**
 * Use Screen Reader Hook
 */
export const useScreenReader = () => {
  const [announcement, setAnnouncement] = useState('')

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('')
    setTimeout(() => {
      setAnnouncement(message)
    }, 100)
  }

  const ScreenReaderComponent = () => (
    <LiveRegion politeness="polite">
      {announcement}
    </LiveRegion>
  )

  return { announce, ScreenReaderComponent }
}
