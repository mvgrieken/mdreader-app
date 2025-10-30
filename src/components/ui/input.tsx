import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
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
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${React.useId()}`
    const errorId = error ? `${inputId}-error` : undefined
    const helperId = helperText ? `${inputId}-helper` : undefined
    
    const inputClasses = cn(
      'input-base',
      startIcon && 'pl-12',
      endIcon && 'pr-12',
      error && 'border-error-500 focus:border-error-500 focus:ring-error-200',
      className
    )
    
    return (
      <div className="w-full space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-neutral-400">{startIcon}</span>
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
              <span className="text-neutral-400">{endIcon}</span>
            </div>
          )}
        </div>
        
        {error && (
          <p 
            id={errorId}
            className="text-sm text-error-600 font-medium"
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p 
            id={helperId}
            className="text-sm text-neutral-500"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
