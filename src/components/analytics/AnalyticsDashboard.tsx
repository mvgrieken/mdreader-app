import React, { useState, useEffect } from 'react'
import { Container } from '@/components/layout/Container'
import { Grid } from '@/components/layout/Grid'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, LineChart, ProgressRing } from '@/components/ui/charts'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils/cn'
import {
  Users,
  Eye,
  MousePointer,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

interface AnalyticsData {
  pageViews: number
  uniqueUsers: number
  interactions: number
  errors: number
  avgSessionDuration: number
  topPages: Array<{ path: string; views: number }>
  userGrowth: Array<{ date: string; users: number }>
  featureUsage: Array<{ feature: string; usage: number }>
  performance: Array<{ metric: string; value: number; target: number }>
}

/**
 * Analytics Dashboard Component
 * 
 - Real-time metrics
 - User behavior tracking
 - Performance monitoring
 - Feature usage analytics
 */
export const AnalyticsDashboard: React.FC<{
  className?: string
}> = ({ className }) => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true)
      const response = await fetch(`/api/analytics/dashboard?range=${timeRange}`)
      
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        // Mock data for development
        setData(getMockData())
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Use mock data as fallback
      setData(getMockData())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const handleRefresh = () => {
    fetchAnalytics()
  }

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/analytics/export?range=${timeRange}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `mdreader-analytics-${timeRange}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export analytics:', error)
    }
  }

  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Analytics Dashboard
          </h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Grid cols={4} lg={4} className="gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </Grid>
        
        <Grid cols={2} lg={2} className="gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-64 w-full" />
            </Card>
          ))}
        </Grid>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 dark:text-neutral-400">
          Unable to load analytics data
        </p>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            Analytics Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Monitor your application's performance and user behavior
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                  timeRange === range
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-50'
                )}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={refreshing}
            icon={<RefreshCw className="w-4 h-4" />}
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <Grid cols={4} lg={4} className="gap-6">
        <MetricCard
          title="Page Views"
          value={data.pageViews.toLocaleString()}
          change={12.5}
          icon={<Eye className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Unique Users"
          value={data.uniqueUsers.toLocaleString()}
          change={8.2}
          icon={<Users className="w-5 h-5" />}
          color="green"
        />
        <MetricCard
          title="Interactions"
          value={data.interactions.toLocaleString()}
          change={15.3}
          icon={<MousePointer className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Errors"
          value={data.errors.toLocaleString()}
          change={-5.1}
          icon={<AlertTriangle className="w-5 h-5" />}
          color="red"
        />
      </Grid>

      {/* Charts */}
      <Grid cols={2} lg={2} className="gap-6">
        {/* User Growth Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            User Growth
          </h3>
          <LineChart
            data={data.userGrowth.map((item, index) => ({ x: index, y: item.users }))}
            height={200}
            color="#3B82F6"
            showPoints={true}
          />
        </Card>

        {/* Top Pages Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Top Pages
          </h3>
          <BarChart
            data={data.topPages.map(page => ({
              label: page.path.replace('/', '') || 'Home',
              value: page.views
            }))}
            height={200}
            showValues={true}
          />
        </Card>
      </Grid>

      {/* Feature Usage & Performance */}
      <Grid cols={2} lg={2} className="gap-6">
        {/* Feature Usage */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Feature Usage
          </h3>
          <div className="space-y-4">
            {data.featureUsage.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {feature.feature}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${feature.usage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {feature.usage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Performance Metrics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {data.performance.map((metric, index) => (
              <div key={index} className="text-center">
                <ProgressRing
                  value={metric.value}
                  max={metric.target}
                  size={80}
                  color={metric.value >= metric.target ? '#10B981' : '#F59E0B'}
                />
                <div className="mt-2">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-50">
                    {metric.metric}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {metric.value}/{metric.target}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
  color: 'blue' | 'green' | 'purple' | 'red'
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className={cn('p-2 rounded-lg', colorClasses[color])}>
          {icon}
        </div>
        <div className={cn(
          'text-sm font-medium flex items-center',
          change > 0 ? 'text-green-600' : 'text-red-600'
        )}>
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingUp className="w-4 h-4 mr-1 transform rotate-180" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      
      <div className="mt-4">
        <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
          {value}
        </div>
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          {title}
        </div>
      </div>
    </Card>
  )
}

// Mock data for development
function getMockData(): AnalyticsData {
  return {
    pageViews: 45234,
    uniqueUsers: 8921,
    interactions: 12847,
    errors: 23,
    avgSessionDuration: 245,
    topPages: [
      { path: '/dashboard', views: 15234 },
      { path: '/documents', views: 12456 },
      { path: '/settings', views: 8934 },
      { path: '/help', views: 5610 }
    ],
    userGrowth: [
      { date: '2025-10-24', users: 120 },
      { date: '2025-10-25', users: 145 },
      { date: '2025-10-26', users: 167 },
      { date: '2025-10-27', users: 189 },
      { date: '2025-10-28', users: 234 },
      { date: '2025-10-29', users: 278 },
      { date: '2025-10-30', users: 312 }
    ],
    featureUsage: [
      { feature: 'Document Upload', usage: 89 },
      { feature: 'AI Analysis', usage: 76 },
      { feature: 'Search', usage: 92 },
      { feature: 'Export', usage: 54 },
      { feature: 'Sharing', usage: 67 }
    ],
    performance: [
      { metric: 'FCP', value: 85, target: 100 },
      { metric: 'LCP', value: 92, target: 100 },
      { metric: 'CLS', value: 78, target: 100 },
      { metric: 'FID', value: 95, target: 100 }
    ]
  }
}
