import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  leftIcon?: React.ReactNode
}

/**
 * MDReader Input Component
 * 
 * Volgt het design system met:
 * - Consistente styling en focus states
 * - Error states en validation feedback
 * - Icon support voor visuele context
 * - Accessibility met label en error beschrijvingen
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = 'text', 
    label, 
    error, 
    helperText, 
    startIcon, 
    endIcon,
    leftIcon,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${React.useId()}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined
    
    const iconToUse = leftIcon || startIcon
    
    const inputClasses = cn(
      'w-full px-4 py-3 rounded-lg border-2 text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      iconToUse && 'pl-12',
      endIcon && 'pr-12',
      error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:border-blue-500',
      className
    )
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {iconToUse && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-400">{iconToUse}</span>
            </div>
          )}
          
          <input
            type={type}
            id={inputId}
            className={inputClasses}
            ref={ref}
            aria-describedby={cn(errorId, helperId)}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-gray-400">{endIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p 
            id={errorId}
            className="text-sm text-red-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={helperId}
            className="text-sm text-gray-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
