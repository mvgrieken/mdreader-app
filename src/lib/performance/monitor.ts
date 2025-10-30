import React, { useState, useEffect } from 'react'

/**
 * Performance Monitoring for MDReader
 * 
 * Tracks application performance metrics and provides optimization suggestions
 */

export interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiResponseTime: number
  memoryUsage: number
  bundleSize: number
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
}

export interface PerformanceReport {
  metrics: PerformanceMetrics
  score: 'excellent' | 'good' | 'needs-improvement' | 'poor'
  suggestions: string[]
  timestamp: string
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.initializeObservers()
  }

  private initializeObservers() {
    // Only run on client side
    if (typeof window === 'undefined') return

    // Observe navigation timing
    if ('navigation' in performance) {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      this.metrics.loadTime = nav.loadEventEnd - nav.loadEventStart
      this.metrics.renderTime = nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart
    }

    // Observe Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          this.metrics.lcp = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(lcpObserver)
      } catch (e) {
        console.warn('LCP observer not supported')
      }

      // Observe First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
        this.observers.push(fidObserver)
      } catch (e) {
        console.warn('FID observer not supported')
      }

      // Observe Cumulative Layout Shift
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              this.metrics.cls = clsValue
            }
          })
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
        this.observers.push(clsObserver)
      } catch (e) {
        console.warn('CLS observer not supported')
      }
    }
  }

  trackApiResponseTime(url: string, startTime: number) {
    const endTime = performance.now()
    const responseTime = endTime - startTime
    this.metrics.apiResponseTime = responseTime
    
    // Log slow API calls
    if (responseTime > 1000) {
      console.warn(`Slow API call to ${url}: ${responseTime.toFixed(2)}ms`)
    }
  }

  trackMemoryUsage() {
    if (typeof window === 'undefined') return
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize
    }
  }

  trackBundleSize() {
    if (typeof window === 'undefined') return
    // This would typically be measured during build time
    // For now, we'll estimate based on loaded resources
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const totalSize = resources.reduce((acc, resource) => {
      return acc + (resource.transferSize || 0)
    }, 0)
    this.metrics.bundleSize = totalSize
  }

  generateReport(): PerformanceReport {
    this.trackMemoryUsage()
    this.trackBundleSize()

    const metrics = this.metrics as PerformanceMetrics
    const suggestions = this.generateSuggestions(metrics)
    const score = this.calculateScore(metrics)

    return {
      metrics,
      score,
      suggestions,
      timestamp: new Date().toISOString()
    }
  }

  private generateSuggestions(metrics: PerformanceMetrics): string[] {
    const suggestions: string[] = []

    if (metrics.loadTime > 3000) {
      suggestions.push('Consider lazy loading heavy components')
      suggestions.push('Optimize images and assets')
    }

    if (metrics.renderTime > 1000) {
      suggestions.push('Reduce component complexity')
      suggestions.push('Use React.memo for expensive components')
    }

    if (metrics.apiResponseTime > 1000) {
      suggestions.push('Implement API response caching')
      suggestions.push('Add request debouncing')
    }

    if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB
      suggestions.push('Check for memory leaks')
      suggestions.push('Implement virtual scrolling for large lists')
    }

    if (metrics.lcp > 2500) {
      suggestions.push('Optimize largest content element')
      suggestions.push('Preload critical resources')
    }

    if (metrics.fid > 100) {
      suggestions.push('Reduce JavaScript execution time')
      suggestions.push('Split code into smaller chunks')
    }

    if (metrics.cls > 0.1) {
      suggestions.push('Specify dimensions for images and videos')
      suggestions.push('Reserve space for dynamic content')
    }

    if (suggestions.length === 0) {
      suggestions.push('Performance is optimal!')
    }

    return suggestions
  }

  private calculateScore(metrics: PerformanceMetrics): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    let score = 0

    // Load time scoring
    if (metrics.loadTime < 1000) score += 25
    else if (metrics.loadTime < 3000) score += 15
    else if (metrics.loadTime < 5000) score += 5

    // API response time scoring
    if (metrics.apiResponseTime < 200) score += 25
    else if (metrics.apiResponseTime < 500) score += 15
    else if (metrics.apiResponseTime < 1000) score += 5

    // LCP scoring
    if (metrics.lcp < 2500) score += 25
    else if (metrics.lcp < 4000) score += 15
    else if (metrics.lcp < 6000) score += 5

    // FID scoring
    if (metrics.fid < 100) score += 25
    else if (metrics.fid < 300) score += 15
    else if (metrics.fid < 500) score += 5

    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'needs-improvement'
    return 'poor'
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Utility functions for performance tracking
export const trackPerformance = (name: string, fn: () => void | Promise<void>) => {
  const startTime = performance.now()
  
  const result = fn()
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const endTime = performance.now()
      console.log(`${name} took ${(endTime - startTime).toFixed(2)}ms`)
    })
  } else {
    const endTime = performance.now()
    console.log(`${name} took ${(endTime - startTime).toFixed(2)}ms`)
    return result
  }
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// React hooks for performance optimization
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const useThrottle = <T>(value: T, limit: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value)

  useEffect(() => {
    let inThrottle = false
    
    const handler = setTimeout(() => {
      if (!inThrottle) {
        setThrottledValue(value)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }, 0)

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

// Memory leak detection
export const useMemoryLeakDetection = (componentName: string) => {
  useEffect(() => {
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
    
    return () => {
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      const memoryDiff = finalMemory - initialMemory
      
      if (memoryDiff > 1024 * 1024) { // More than 1MB increase
        console.warn(`Potential memory leak detected in ${componentName}: ${(memoryDiff / 1024 / 1024).toFixed(2)}MB`)
      }
    }
  }, [componentName])
}
