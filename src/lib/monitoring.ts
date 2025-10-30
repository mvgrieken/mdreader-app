/**
 * MDReader Monitoring Library
 * 
 - Performance monitoring
 - Error tracking
 - User behavior analytics
 - System health checks
 */

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
}

interface ErrorInfo {
  message: string
  stack?: string
  source: string
  userId?: string
  sessionId: string
  timestamp: number
  userAgent: string
  url: string
}

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: Array<{
    name: string
    status: 'pass' | 'fail' | 'warn'
    responseTime?: number
    message?: string
  }>
  timestamp: number
}

class MDReaderMonitoring {
  private isInitialized: boolean = false
  private metrics: PerformanceMetric[] = []
  private errors: ErrorInfo[] = []
  private userId?: string
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async initialize() {
    if (this.isInitialized || typeof window === 'undefined') return

    // Setup performance monitoring
    this.setupPerformanceMonitoring()
    
    // Setup error tracking
    this.setupErrorTracking()
    
    // Setup health checks
    this.setupHealthChecks()
    
    this.isInitialized = true
  }

  private setupPerformanceMonitoring() {
    // Monitor Core Web Vitals (simplified for now)
    // TODO: Update to latest web-vitals API when needed

    // Monitor page load performance
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      this.recordMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, 'ms')
      this.recordMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms')
      this.recordMetric('first_byte', navigation.responseStart - navigation.requestStart, 'ms')
      
      // Monitor resource loading
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const totalResources = resources.length
      const totalSize = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0)
      
      this.recordMetric('resources_loaded', totalResources, 'count')
      this.recordMetric('total_transfer_size', totalSize, 'bytes')
    })

    // Monitor route changes (for SPA)
    let lastPath = window.location.pathname
    const checkRouteChange = () => {
      if (window.location.pathname !== lastPath) {
        const startTime = performance.now()
        
        // Wait for the route to fully load
        setTimeout(() => {
          const loadTime = performance.now() - startTime
          this.recordMetric('route_change_time', loadTime, 'ms')
        }, 100)
        
        lastPath = window.location.pathname
      }
    }
    
    setInterval(checkRouteChange, 100)
  }

  private setupErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackError({
        message: e.message,
        stack: e.error?.stack,
        source: 'javascript',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    })

    // Promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError({
        message: `Unhandled promise rejection: ${e.reason}`,
        source: 'promise',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    })

    // Network errors
    window.addEventListener('online', () => {
      this.recordMetric('network_status', 1, 'binary')
    })

    window.addEventListener('offline', () => {
      this.recordMetric('network_status', 0, 'binary')
      this.trackError({
        message: 'Network connection lost',
        source: 'network',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    })
  }

  private setupHealthChecks() {
    // Periodic health checks
    setInterval(async () => {
      const health = await this.performHealthCheck()
      
      if (health.status !== 'healthy') {
        this.trackError({
          message: `Health check failed: ${health.checks.filter(c => c.status === 'fail').map(c => c.name).join(', ')}`,
          source: 'health_check',
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }
    }, 30000) // Every 30 seconds
  }

  private async performHealthCheck(): Promise<HealthCheck> {
    const checks = []
    
    // Check API connectivity
    try {
      const startTime = performance.now()
      const response = await fetch('/api/health', { 
        method: 'GET',
        cache: 'no-cache'
      })
      const responseTime = performance.now() - startTime
      
      checks.push({
        name: 'api_connectivity',
        status: (response.ok ? 'pass' : 'fail') as 'pass' | 'fail',
        responseTime,
        message: response.ok ? 'OK' : `HTTP ${response.status}`
      })
    } catch (error) {
      checks.push({
        name: 'api_connectivity',
        status: 'fail' as 'fail',
        message: 'Network error'
      })
    }

    // Check browser performance
    const memory = (performance as any).memory
    if (memory) {
      const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit
      checks.push({
        name: 'memory_usage',
        status: (memoryUsage > 0.8 ? 'warn' : 'pass') as 'warn' | 'pass',
        message: `${Math.round(memoryUsage * 100)}% used`
      })
    }

    // Check connection speed
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      checks.push({
        name: 'connection_speed',
        status: (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' ? 'warn' : 'pass') as 'warn' | 'pass',
        message: connection.effectiveType
      })
    }

    const failedChecks = checks.filter(c => c.status === 'fail')
    const warnChecks = checks.filter(c => c.status === 'warn')
    
    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (failedChecks.length > 0) {
      status = 'unhealthy'
    } else if (warnChecks.length > 0) {
      status = 'degraded'
    } else {
      status = 'healthy'
    }

    return {
      status,
      checks,
      timestamp: Date.now()
    }
  }

  // Public methods
  recordMetric(name: string, value: number, unit: string) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now()
    }

    this.metrics.push(metric)
    
    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Send to monitoring service
    this.sendMetric(metric)
  }

  trackError(error: Omit<ErrorInfo, 'sessionId' | 'userId'>) {
    const errorInfo: ErrorInfo = {
      ...error,
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.errors.push(errorInfo)
    
    // Keep only last 50 errors
    if (this.errors.length > 50) {
      this.errors = this.errors.slice(-50)
    }

    // Send to error tracking service
    this.sendError(errorInfo)
  }

  identify(userId: string) {
    this.userId = userId
  }

  // Get monitoring data
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  getErrors(): ErrorInfo[] {
    return [...this.errors]
  }

  getHealthStatus(): Promise<HealthCheck> {
    return this.performHealthCheck()
  }

  // Private methods for sending data
  private async sendMetric(metric: PerformanceMetric) {
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      })
    } catch (error) {
      console.error('Failed to send metric:', error)
    }
  }

  private async sendError(error: ErrorInfo) {
    try {
      await fetch('/api/monitoring/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      })
    } catch (error) {
      console.error('Failed to send error:', error)
    }
  }
}

// Create singleton instance
const monitoring = new MDReaderMonitoring()

export default monitoring

// Export convenience functions
export const recordMetric = (name: string, value: number, unit: string) => 
  monitoring.recordMetric(name, value, unit)

export const trackError = (error: Omit<ErrorInfo, 'sessionId' | 'userId'>) => 
  monitoring.trackError(error)

export const identifyUser = (userId: string) => 
  monitoring.identify(userId)

export const getHealthStatus = () => 
  monitoring.getHealthStatus()
