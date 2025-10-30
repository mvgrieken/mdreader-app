import React, { useState, useEffect, createContext, useContext } from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  onDismiss?: () => void
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/**
 * Toast Provider voor React context
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto-dismiss
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const clearToasts = () => {
    setToasts([])
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

/**
 * Hook voor het gebruiken van toasts
 */
export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

/**
 * Individual Toast Component
 */
const ToastComponent: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ 
  toast, 
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onRemove(toast.id)
      toast.onDismiss?.()
    }, 200)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg border shadow-lg transition-all duration-200 max-w-md',
        getBgColor(),
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
      )}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-neutral-900">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="mt-1 text-sm text-neutral-600">
            {toast.description}
          </p>
        )}
        {toast.action && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toast.action.onClick}
              className="text-xs"
            >
              {toast.action.label}
            </Button>
          </div>
        )}
      </div>

      {/* Dismiss button */}
      <div className="ml-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="p-1 hover:bg-black/5"
        >
          <X className="w-4 h-4 text-neutral-400" />
        </Button>
      </div>
    </div>
  )
}

/**
 * Toast Container Component
 */
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  )
}

/**
 * Convenience functions for different toast types
 */
export const toast = {
  success: (title: string, description?: string) => ({
    type: 'success' as const,
    title,
    description
  }),
  error: (title: string, description?: string) => ({
    type: 'error' as const,
    title,
    description
  }),
  warning: (title: string, description?: string) => ({
    type: 'warning' as const,
    title,
    description
  }),
  info: (title: string, description?: string) => ({
    type: 'info' as const,
    title,
    description
  })
}
