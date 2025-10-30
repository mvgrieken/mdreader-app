import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader } from './card'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

/**
 * MDReader Error Boundary Component
 * 
 * Catcht React errors en toont fallback UI
 * - Development debugging info
 * - Production user-friendly errors
 * - Error reporting integration
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // TODO: Send to error reporting service
    // reportError(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900">
                Something went wrong
              </h3>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-neutral-600">
                We're sorry, but something unexpected happened. 
                {process.env.NODE_ENV === 'development' 
                  ? ' Check the console for details.'
                  : ' Please try refreshing the page.'
                }
              </p>
              
              {/* Development error details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left">
                  <summary className="text-sm text-red-600 cursor-pointer">
                    Error Details
                  </summary>
                  <div className="mt-2 p-3 bg-red-50 rounded text-xs text-red-800 overflow-auto max-h-32">
                    <div className="font-semibold">{this.state.error.name}</div>
                    <div className="mt-1">{this.state.error.message}</div>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
              
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
                <Button onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook voor functionele componenten
 */
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo)
    
    // TODO: Send to error reporting service
    // reportError(error, errorInfo)
  }, [])
}
