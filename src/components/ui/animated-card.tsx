import React, { useState } from 'react'
import { Card, CardContent, CardHeader } from './card'
import { cn } from '@/lib/utils/cn'

export interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  press?: boolean
  scale?: boolean
  glow?: boolean
  children: React.ReactNode
}

/**
 * MDReader Animated Card Component
 * 
 * Card met geavanceerde micro-interactions
 * - Hover effects
 * - Press animations
 * - Scale transitions
 * - Glow effects
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  className,
  hover = true,
  press = true,
  scale = false,
  glow = false,
  children,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleMouseDown = () => {
    if (press) setIsPressed(true)
  }

  const handleMouseUp = () => {
    if (press) setIsPressed(false)
  }

  const handleMouseLeave = () => {
    if (press) setIsPressed(false)
  }

  const classes = cn(
    // Base transitions
    'transition-all duration-200 ease-out',
    
    // Hover effects
    hover && [
      'hover:shadow-lg',
      'hover:-translate-y-1',
      'cursor-pointer'
    ],
    
    // Press effects
    press && isPressed && [
      'scale-95',
      'shadow-sm'
    ],
    
    // Scale effects
    scale && hover && 'hover:scale-105',
    
    // Glow effects
    glow && hover && [
      'shadow-xl',
      'hover:shadow-primary-500/25'
    ],
    
    className
  )

  return (
    <Card
      className={classes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Card>
  )
}

/**
 * Animated Button met ripple effect
 */
export interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ripple?: boolean
  children: React.ReactNode
}

export const RippleButton: React.FC<RippleButtonProps> = ({
  className,
  ripple = true,
  children,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ripple) {
      onClick?.(e)
      return
    }

    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples(prev => [...prev, newRipple])

    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)

    onClick?.(e)
  }

  return (
    <button
      className={cn(
        'relative overflow-hidden',
        'transition-all duration-200',
        'active:scale-95',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animation: 'ripple 0.6s ease-out'
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}

/**
 * Animated Input met focus effects
 */
export interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  className,
  label,
  error,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      {label && (
        <label
          className={cn(
            'absolute left-3 -top-2 bg-white px-1 text-xs transition-all duration-200',
            isFocused || props.value
              ? 'text-primary-600 -translate-y-1'
              : 'text-neutral-400 translate-y-3'
          )}
        >
          {label}
        </label>
      )}
      
      <input
        className={cn(
          'w-full px-3 py-3 border rounded-lg transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'hover:border-neutral-300',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-neutral-200',
          label && 'pt-5',
          className
        )}
        onFocus={(e) => {
          setIsFocused(true)
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          setIsFocused(false)
          props.onBlur?.(e)
        }}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-xs text-red-500 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Loading Dots Animation
 */
export const LoadingDots: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  }

  return (
    <div className="flex space-x-1">
      <div className={cn(sizeClasses[size], 'bg-primary-600 rounded-full animate-bounce')} style={{ animationDelay: '0ms' }} />
      <div className={cn(sizeClasses[size], 'bg-primary-600 rounded-full animate-bounce')} style={{ animationDelay: '150ms' }} />
      <div className={cn(sizeClasses[size], 'bg-primary-600 rounded-full animate-bounce')} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

/**
 * Pulse Animation Component
 */
export const Pulse: React.FC<{
  children: React.ReactNode
  className?: string
  intensity?: 'light' | 'medium' | 'strong'
}> = ({ children, className, intensity = 'medium' }) => {
  const intensityClasses = {
    light: 'animate-pulse',
    medium: 'animate-pulse',
    strong: 'animate-pulse'
  }

  return (
    <div className={cn(intensityClasses[intensity], className)}>
      {children}
    </div>
  )
}

/**
 * Slide In Animation Component
 */
export const SlideIn: React.FC<{
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}> = ({ children, direction = 'up', delay = 0, className }) => {
  const directionClasses = {
    up: 'translate-y-4 opacity-0',
    down: '-translate-y-4 opacity-0',
    left: 'translate-x-4 opacity-0',
    right: '-translate-x-4 opacity-0'
  }

  return (
    <div
      className={cn(
        'transition-all duration-500 ease-out',
        directionClasses[direction],
        'animate-slide-in',
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
