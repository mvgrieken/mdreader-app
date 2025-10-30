import { NextRequest, NextResponse } from 'next/server'

/**
 * Analytics Dashboard API Endpoint
 * 
 * Returns aggregated analytics data for the dashboard
 * Supports different time ranges and metrics
 */

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '7d'
    
    // Validate range parameter
    const validRanges = ['7d', '30d', '90d']
    if (!validRanges.includes(range)) {
      return NextResponse.json(
        { error: 'Invalid time range' },
        { status: 400 }
      )
    }

    // In production, fetch from your analytics database
    // const data = await fetchAnalyticsData(range)
    
    // For now, return mock data based on range
    const data = getMockAnalyticsData(range as '7d' | '30d' | '90d')

    return NextResponse.json(data)

  } catch (error) {
    console.error('Analytics Dashboard API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getMockAnalyticsData(range: '7d' | '30d' | '90d'): AnalyticsData {
  const multiplier = range === '7d' ? 1 : range === '30d' ? 4 : 12
  
  return {
    pageViews: 45234 * multiplier,
    uniqueUsers: 8921 * multiplier,
    interactions: 12847 * multiplier,
    errors: 23 * Math.ceil(multiplier / 2),
    avgSessionDuration: 245,
    topPages: [
      { path: '/dashboard', views: 15234 * multiplier },
      { path: '/documents', views: 12456 * multiplier },
      { path: '/settings', views: 8934 * multiplier },
      { path: '/help', views: 5610 * multiplier }
    ],
    userGrowth: generateUserGrowthData(range),
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

function generateUserGrowthData(range: '7d' | '30d' | '90d') {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const data = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days + 1)
  
  let users = 100
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    
    // Simulate growth with some randomness
    users += Math.floor(Math.random() * 50) + 10
    
    data.push({
      date: date.toISOString().split('T')[0],
      users: users
    })
  }
  
  return data
}
