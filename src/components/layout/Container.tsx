import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  fluid?: boolean
}

/**
 * MDReader Container Component
 * 
 * Consistente container met responsive breakpoints
 * - Mobile-first design
 * - Consistente max-widths
 * - Centered content met padding
 */
export const Container: React.FC<ContainerProps> = ({
  className,
  size = 'lg',
  fluid = false,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',    // 640px
    md: 'max-w-4xl',    // 896px
    lg: 'max-w-6xl',    // 1152px
    xl: 'max-w-7xl',    // 1280px
    '2xl': 'max-w-8xl',   // 1536px
    full: 'max-w-full',
  }

  const classes = cn(
    // Base container styles
    'w-full mx-auto px-4 sm:px-6 lg:px-8',
    // Size constraints
    !fluid && sizeClasses[size],
    className
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
