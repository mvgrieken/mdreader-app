import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  Gauge, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  HardDrive,
  Package,
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react'
import { performanceMonitor, PerformanceReport } from '@/lib/performance/monitor'

export const PerformanceDashboard: React.FC = () => {
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    generateReport()
    
    if (autoRefresh) {
      const interval = setInterval(generateReport, 5000) // Refresh every 5 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const generateReport = () => {
    setLoading(true)
    // Small delay to ensure metrics are collected
    setTimeout(() => {
      const newReport = performanceMonitor.generateReport()
      setReport(newReport)
      setLoading(false)
    }, 100)
  }

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'excellent': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'good': return <TrendingUp className="w-5 h-5 text-blue-600" />
      case 'needs-improvement': return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'poor': return <TrendingDown className="w-5 h-5 text-red-600" />
      default: return <Gauge className="w-5 h-5 text-gray-600" />
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getProgressValue = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100)
  }

  const getProgressColor = (value: number, max: number, goodThreshold: number) => {
    const percentage = (value / max) * 100
    if (percentage <= goodThreshold) return 'bg-green-500'
    if (percentage <= goodThreshold * 2) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Gauge className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Performance Dashboard</h3>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(report.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateReport}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getScoreIcon(report.score)}
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Performance Score</h4>
                <p className="text-sm text-gray-500">Overall application health</p>
              </div>
            </div>
            <Badge className={getScoreColor(report.score)}>
              {report.score.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Load Time */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-900">Load Time</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatTime(report.metrics.loadTime)}
            </p>
            <Progress 
              value={getProgressValue(report.metrics.loadTime, 5000)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">Target: &lt;3s</p>
          </CardContent>
        </Card>

        {/* API Response */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <h4 className="font-medium text-gray-900">API Response</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatTime(report.metrics.apiResponseTime || 0)}
            </p>
            <Progress 
              value={getProgressValue(report.metrics.apiResponseTime || 0, 1000)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">Target: &lt;500ms</p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">Memory Usage</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatBytes(report.metrics.memoryUsage || 0)}
            </p>
            <Progress 
              value={getProgressValue(report.metrics.memoryUsage || 0, 100 * 1024 * 1024)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">Target: &lt;50MB</p>
          </CardContent>
        </Card>

        {/* Bundle Size */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-gray-900">Bundle Size</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">
              {formatBytes(report.metrics.bundleSize || 0)}
            </p>
            <Progress 
              value={getProgressValue(report.metrics.bundleSize || 0, 1024 * 1024)}
              className="h-2"
            />
            <p className="text-xs text-gray-500 mt-1">Target: &lt;1MB</p>
          </CardContent>
        </Card>
      </div>

      {/* Web Vitals */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold text-gray-900">Core Web Vitals</h4>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* LCP */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Largest Contentful Paint (LCP)</p>
              <p className="text-sm text-gray-500">Loading performance</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatTime(report.metrics.lcp || 0)}</p>
              <Badge 
                variant="outline"
                className={(report.metrics.lcp || 0) < 2500 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
              >
                {(report.metrics.lcp || 0) < 2500 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>

          {/* FID */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">First Input Delay (FID)</p>
              <p className="text-sm text-gray-500">Interactivity</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{formatTime(report.metrics.fid || 0)}</p>
              <Badge 
                variant="outline"
                className={(report.metrics.fid || 0) < 100 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
              >
                {(report.metrics.fid || 0) < 100 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>

          {/* CLS */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Cumulative Layout Shift (CLS)</p>
              <p className="text-sm text-gray-500">Visual stability</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">{(report.metrics.cls || 0).toFixed(3)}</p>
              <Badge 
                variant="outline"
                className={(report.metrics.cls || 0) < 0.1 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}
              >
                {(report.metrics.cls || 0) < 0.1 ? 'Good' : 'Needs Work'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <h4 className="font-semibold text-gray-900">Optimization Suggestions</h4>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {report.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
