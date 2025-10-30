import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12
  sm?: number
  md?: number
  lg?: number
  xl?: number
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * MDReader Grid Component
 * 
 * Responsive grid system met consistent gaps
 * - Mobile-first breakpoints
 * - Flexible column spans
 * - Consistent spacing
 */
export const Grid: React.FC<GridProps> = ({
  className,
  cols = 1,
  sm,
  md,
  lg,
  xl,
  gap = 'md',
  children,
  ...props
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  }

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2 sm:gap-3',
    md: 'gap-4 sm:gap-6',
    lg: 'gap-6 sm:gap-8',
    xl: 'gap-8 sm:gap-10',
  }

  const classes = cn(
    // Base grid
    'grid',
    // Default columns
    colsClasses[cols],
    // Responsive columns
    sm && `sm:grid-cols-${sm}`,
    md && `md:grid-cols-${md}`,
    lg && `lg:grid-cols-${lg}`,
    xl && `xl:grid-cols-${xl}`,
    // Gap spacing
    gapClasses[gap],
    className
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
