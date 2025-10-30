/**
 * MDReader Analytics Library
 * 
 * Simple analytics tracking voor user behavior
 * - Page views
 * - User interactions
 * - Performance metrics
 * - Error tracking
 */

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

interface PageView {
  path: string
  title?: string
  referrer?: string
  timestamp?: number
}

interface UserInteraction {
  element: string
  action: string
  context?: Record<string, any>
  timestamp?: number
}

class MDReaderAnalytics {
  private isEnabled: boolean
  private userId?: string
  private sessionId: string

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production'
    this.sessionId = this.generateSessionId()
    
    // Initialize tracking
    if (this.isEnabled) {
      this.initializeTracking()
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeTracking() {
    // Track page view on mount
    if (typeof window !== 'undefined') {
      this.trackPageView(window.location.pathname, document.title)
      
      // Track page changes
      this.setupPageViewTracking()
      
      // Track user interactions
      this.setupInteractionTracking()
      
      // Track performance
      this.setupPerformanceTracking()
      
      // Track errors
      this.setupErrorTracking()
    }
  }

  private setupPageViewTracking() {
    // Track SPA navigation
    let lastPath = window.location.pathname
    
    const checkPathChange = () => {
      if (window.location.pathname !== lastPath) {
        this.trackPageView(window.location.pathname, document.title)
        lastPath = window.location.pathname
      }
    }

    // Check for path changes every 100ms
    setInterval(checkPathChange, 100)
  }

  private setupInteractionTracking() {
    // Track button clicks
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const button = target.closest('button')
      
      if (button) {
        const buttonText = button.textContent?.trim() || 'Unknown'
        const buttonId = button.id || ''
        const buttonClass = button.className || ''
        
        this.trackInteraction('button_click', {
          text: buttonText,
          id: buttonId,
          class: buttonClass,
          page: window.location.pathname
        })
      }

      // Track link clicks
      const link = target.closest('a')
      if (link) {
        const linkText = link.textContent?.trim() || 'Unknown'
        const linkHref = link.getAttribute('href') || ''
        
        this.trackInteraction('link_click', {
          text: linkText,
          href: linkHref,
          page: window.location.pathname
        })
      }

      // Track navigation clicks
      const navItem = target.closest('[role="menuitem"], [role="option"]')
      if (navItem) {
        const navText = navItem.textContent?.trim() || 'Unknown'
        
        this.trackInteraction('navigation_click', {
          item: navText,
          page: window.location.pathname
        })
      }
    })

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target as HTMLFormElement
      const formId = form.id || ''
      const formClass = form.className || ''
      
      this.trackInteraction('form_submit', {
        formId,
        formClass,
        page: window.location.pathname
      })
    })

    // Track search queries
    document.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement
      if (target.type === 'search' || target.getAttribute('placeholder')?.toLowerCase().includes('search')) {
        const searchValue = target.value.trim()
        
        if (searchValue.length > 2) {
          this.trackInteraction('search_query', {
            query: searchValue,
            inputId: target.id,
            page: window.location.pathname
          })
        }
      }
    })
  }

  private setupPerformanceTracking() {
    // Track Core Web Vitals (simplified for now)
    // TODO: Update to latest web-vitals API when needed

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
      this.trackPerformance('page_load_time', { value: loadTime })
    })
  }

  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (e) => {
      this.trackError('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack,
        page: window.location.pathname
      })
    })

    // Track promise rejections
    window.addEventListener('unhandledrejection', (e) => {
      this.trackError('promise_rejection', {
        reason: e.reason,
        page: window.location.pathname
      })
    })
  }

  // Public methods
  trackPageView(path: string, title?: string, referrer?: string) {
    if (!this.isEnabled) return

    const pageView: PageView = {
      path,
      title,
      referrer: referrer || document.referrer,
      timestamp: Date.now()
    }

    this.sendEvent('page_view', pageView)
  }

  trackInteraction(action: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    const interaction: UserInteraction = {
      element: 'ui_element',
      action,
      context: properties,
      timestamp: Date.now()
    }

    this.sendEvent('user_interaction', interaction)
  }

  trackPerformance(metric: string, data: any) {
    if (!this.isEnabled) return

    this.sendEvent('performance', {
      metric,
      data,
      timestamp: Date.now()
    })
  }

  trackError(errorType: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    this.sendEvent('error', {
      errorType,
      properties,
      timestamp: Date.now()
    })
  }

  trackFeature(featureName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return

    this.sendEvent('feature_usage', {
      feature: featureName,
      properties,
      timestamp: Date.now()
    })
  }

  // User identification
  identify(userId: string, traits?: Record<string, any>) {
    if (!this.isEnabled) return
    
    this.userId = userId
    this.sendEvent('user_identify', {
      userId,
      traits,
      timestamp: Date.now()
    })
  }

  // Private method to send events
  private sendEvent(event: string, data: any) {
    if (!this.isEnabled) return

    const payload: AnalyticsEvent = {
      event,
      properties: {
        ...data,
        sessionId: this.sessionId,
        userId: this.userId,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      }
    }

    // Send to analytics endpoint
    this.sendToEndpoint(payload)
  }

  private async sendToEndpoint(payload: AnalyticsEvent) {
    try {
      // In production, send to your analytics service
      // For now, we'll just log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', payload)
        return
      }

      // Production: Send to your analytics endpoint
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      console.error('Analytics tracking failed:', error)
    }
  }

  // Utility methods
  getSessionId(): string {
    return this.sessionId
  }

  getUserId(): string | undefined {
    return this.userId
  }

  isTrackingEnabled(): boolean {
    return this.isEnabled
  }
}

// Create singleton instance
const analytics = new MDReaderAnalytics()

export default analytics

// Export convenience functions
export const trackPageView = (path: string, title?: string) => 
  analytics.trackPageView(path, title)

export const trackInteraction = (action: string, properties?: Record<string, any>) => 
  analytics.trackInteraction(action, properties)

export const trackFeature = (featureName: string, properties?: Record<string, any>) => 
  analytics.trackFeature(featureName, properties)

export const identify = (userId: string, traits?: Record<string, any>) => 
  analytics.identify(userId, traits)
