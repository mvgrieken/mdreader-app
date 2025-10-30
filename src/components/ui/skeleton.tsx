import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  lines?: number
}

/**
 * MDReader Skeleton Component
 * 
 * Loading states met verschillende varianten
 * - Smooth animations
 * - Consistent styling
 * - Accessibility support
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  lines = 1,
  ...props
}) => {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  }

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '2rem'),
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }, (_, i) => (
          <div
            key={i}
            className={cn(
              'bg-neutral-200 animate-pulse rounded',
              i === lines - 1 && 'w-3/4', // Last line shorter
              className
            )}
            style={{
              width: i === lines - 1 ? '75%' : '100%',
              height: '1rem',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-neutral-200 animate-pulse',
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    />
  )
}

/**
 * Card Skeleton voor documenten
 */
export const DocumentCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="40%" height="1rem" />
        </div>
        <Skeleton variant="circular" width="2rem" height="2rem" />
      </div>

      {/* Content */}
      <Skeleton lines={2} />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton width="4rem" height="0.75rem" />
          <Skeleton width="3rem" height="0.75rem" />
        </div>
        <div className="flex space-x-2">
          <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
          <Skeleton variant="circular" width="1.5rem" height="1.5rem" />
        </div>
      </div>
    </div>
  )
}

/**
 * Table Skeleton voor lijsten
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-neutral-200 p-4">
        <div className="grid grid-cols-12 gap-4">
          <Skeleton width="20%" />
          <Skeleton width="30%" />
          <Skeleton width="20%" />
          <Skeleton width="15%" />
          <Skeleton width="15%" />
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-200">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="p-4">
            <div className="grid grid-cols-12 gap-4 items-center">
              <Skeleton width="90%" />
              <Skeleton width="80%" />
              <Skeleton width="70%" />
              <Skeleton width="60%" />
              <div className="flex space-x-2">
                <Skeleton variant="circular" width="1.25rem" height="1.25rem" />
                <Skeleton variant="circular" width="1.25rem" height="1.25rem" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Form Skeleton voor editors
 */
export const FormSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <Skeleton width="40%" height="2rem" />

      {/* Form fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton width="15%" height="1rem" />
          <Skeleton height="3rem" />
        </div>

        <div className="space-y-2">
          <Skeleton width="20%" height="1rem" />
          <Skeleton height="3rem" />
        </div>

        <div className="space-y-2">
          <Skeleton width="10%" height="1rem" />
          <Skeleton height="12rem" />
        </div>

        <div className="space-y-2">
          <Skeleton width="25%" height="1rem" />
          <Skeleton height="3rem" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Skeleton width="6rem" height="2.5rem" />
        <Skeleton width="8rem" height="2.5rem" />
      </div>
    </div>
  )
}
