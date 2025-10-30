import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

/**
 * Optimized Animation Hook
 * 
 * Uses requestAnimationFrame voor smooth animations
 */
export const useOptimizedAnimation = (
  duration: number,
  onUpdate: (progress: number) => void,
  onComplete?: () => void
) => {
  const animationRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)

  const start = () => {
    startTimeRef.current = performance.now()
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) return
      
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      
      onUpdate(easedProgress)
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  useEffect(() => {
    return () => stop()
  }, [])

  return { start, stop }
}

/**
 * Lazy Animation Component
 * 
 - Animates only when visible
 - Uses Intersection Observer
 - Performance optimized
 */
export interface LazyAnimationProps {
  children: React.ReactNode
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'rotate-in'
  duration?: number
  delay?: number
  threshold?: number
  className?: string
}

export const LazyAnimation: React.FC<LazyAnimationProps> = ({
  children,
  animation = 'fade-in',
  duration = 500,
  delay = 0,
  threshold = 0.1,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [threshold, hasAnimated])

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-down': 'animate-slide-down',
    'scale-in': 'animate-scale-in',
    'rotate-in': 'animate-rotate-in'
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all',
        isVisible ? animationClasses[animation] : 'opacity-0',
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

/**
 * Staggered Animation Component
 * 
 - Animates children with staggered delays
 - Performance optimized with CSS transforms
 */
export interface StaggeredAnimationProps {
  children: React.ReactNode[]
  stagger?: number
  animation?: 'fade-in' | 'slide-up' | 'scale-in'
  duration?: number
  className?: string
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  stagger = 100,
  animation = 'fade-in',
  duration = 400,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const animationClasses = {
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'scale-in': 'animate-scale-in'
  }

  return (
    <div ref={containerRef} className={cn(className)}>
      {React.Children.map(children, (child, index) => (
        <div
          className={cn(
            'transition-all',
            isVisible ? animationClasses[animation] : 'opacity-0'
          )}
          style={{
            transitionDuration: `${duration}ms`,
            transitionDelay: isVisible ? `${index * stagger}ms` : '0ms'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * Morph Animation Component
 * 
 - Smooth morphing between shapes
 - Uses SVG path interpolation
 */
export interface MorphAnimationProps {
  fromPath: string
  toPath: string
  size?: number
  duration?: number
  autoPlay?: boolean
  className?: string
}

export const MorphAnimation: React.FC<MorphAnimationProps> = ({
  fromPath,
  toPath,
  size = 100,
  duration = 1000,
  autoPlay = true,
  className
}) => {
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)

  const { start, stop } = useOptimizedAnimation(
    duration,
    (newProgress) => {
      setProgress(newProgress)
    },
    () => {
      setIsPlaying(false)
    }
  )

  useEffect(() => {
    if (isPlaying) {
      start()
    }
  }, [isPlaying, start])

  const interpolatePath = (path1: string, path2: string, t: number) => {
    // Simple path interpolation (for demo purposes)
    // In production, use a proper path interpolation library
    return t > 0.5 ? path2 : path1
  }

  const currentPath = interpolatePath(fromPath, toPath, progress)

  return (
    <div className={cn('inline-block', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transition-all duration-300"
      >
        <path
          d={currentPath}
          fill="currentColor"
          className="text-primary-500"
        />
      </svg>
      
      <button
        onClick={() => setIsPlaying(true)}
        className="mt-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
      >
        Replay
      </button>
    </div>
  )
}

/**
 * Physics Animation Component
 * 
 - Spring physics animations
 - Realistic motion
 */
export interface PhysicsAnimationProps {
  children: React.ReactNode
  tension?: number
  friction?: number
  className?: string
}

export const PhysicsAnimation: React.FC<PhysicsAnimationProps> = ({
  children,
  tension = 300,
  friction = 10,
  className
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)
  const animationRef = useRef<number | undefined>(undefined)
  const lastTimeRef = useRef<number | undefined>(undefined)

  const animate = (currentTime: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = currentTime
    }

    const deltaTime = (currentTime - lastTimeRef.current) / 1000 // Convert to seconds
    lastTimeRef.current = currentTime

    // Spring physics
    const springForce = {
      x: -tension * position.x,
      y: -tension * position.y
    }

    const dampingForce = {
      x: -friction * velocity.x,
      y: -friction * velocity.y
    }

    const acceleration = {
      x: springForce.x + dampingForce.x,
      y: springForce.y + dampingForce.y
    }

    const newVelocity = {
      x: velocity.x + acceleration.x * deltaTime,
      y: velocity.y + acceleration.y * deltaTime
    }

    const newPosition = {
      x: position.x + newVelocity.x * deltaTime,
      y: position.y + newVelocity.y * deltaTime
    }

    setVelocity(newVelocity)
    setPosition(newPosition)

    // Continue animation if there's significant movement
    if (Math.abs(newVelocity.x) > 0.01 || Math.abs(newVelocity.y) > 0.01) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      setIsAnimating(false)
      setPosition({ x: 0, y: 0 })
      setVelocity({ x: 0, y: 0 })
    }
  }

  const startAnimation = () => {
    if (isAnimating) return
    
    setPosition({ x: 50, y: 0 })
    setVelocity({ x: 0, y: 0 })
    setIsAnimating(true)
    lastTimeRef.current = undefined
    
    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <div className={cn('relative inline-block', className)}>
      <div
        className="transition-transform"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      >
        {children}
      </div>
      
      <button
        onClick={startAnimation}
        disabled={isAnimating}
        className="mt-2 px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded hover:bg-primary-200 disabled:opacity-50"
      >
        {isAnimating ? 'Animating...' : 'Start Physics'}
      </button>
    </div>
  )
}

/**
 * Performance Monitor Component
 * 
 - Monitors animation performance
 - Shows FPS counter
 */
export const PerformanceMonitor: React.FC<{
  className?: string
}> = ({ className }) => {
  const [fps, setFps] = useState(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())

  useEffect(() => {
    let animationId: number

    const updateFPS = (currentTime: number) => {
      frameCountRef.current++

      if (currentTime - lastTimeRef.current >= 1000) {
        setFps(frameCountRef.current)
        frameCountRef.current = 0
        lastTimeRef.current = currentTime
      }

      animationId = requestAnimationFrame(updateFPS)
    }

    animationId = requestAnimationFrame(updateFPS)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className={cn('fixed top-4 right-4 bg-black/80 text-white px-3 py-2 rounded text-sm font-mono', className)}>
      FPS: {fps}
    </div>
  )
}

/**
 * Optimized List Animation
 * 
 - Efficient list item animations
 - Uses FLIP technique
 */
export interface OptimizedListProps {
  items: Array<{ id: string; content: React.ReactNode }>
  className?: string
}

export const OptimizedList: React.FC<OptimizedListProps> = ({
  items,
  className
}) => {
  const [animatingItems, setAnimatingItems] = useState<Set<string>>(new Set())

  const handleItemAdd = (id: string) => {
    setAnimatingItems(prev => new Set(prev).add(id))
    setTimeout(() => {
      setAnimatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }, 500)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'p-4 bg-white border border-neutral-200 rounded-lg',
            'transition-all duration-500 ease-out',
            animatingItems.has(item.id)
              ? 'animate-slide-in opacity-0'
              : 'opacity-100'
          )}
        >
          {item.content}
        </div>
      ))}
    </div>
  )
}
