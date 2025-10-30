import { NextRequest, NextResponse } from 'next/server'

/**
 * Feedback API Endpoint
 * 
 * Receives user feedback and stores it for review
 * Sends notifications to team members
 */

interface FeedbackData {
  type: 'bug' | 'feature' | 'general' | 'rating'
  rating?: number
  message: string
  email?: string
  userAgent: string
  url: string
  timestamp: number
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackData = await request.json()
    
    // Validate required fields
    if (!body.type || !body.message || !body.timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate feedback type
    const validTypes = ['bug', 'feature', 'general', 'rating']
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        { error: 'Invalid feedback type' },
        { status: 400 }
      )
    }

    // Validate rating if provided
    if (body.type === 'rating' && (!body.rating || body.rating < 1 || body.rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Log the feedback (in production, store to database)
    console.log('📝 User Feedback Received:', {
      type: body.type,
      rating: body.rating,
      message: body.message.substring(0, 100) + (body.message.length > 100 ? '...' : ''),
      email: body.email || 'Anonymous',
      url: body.url,
      timestamp: new Date(body.timestamp).toISOString()
    })

    // Store to database (placeholder)
    // await db.feedback.create({ data: body })

    // Send notifications (placeholder)
    // await sendToSlack(body)
    // await sendToEmail(body)
    // await createGitHubIssue(body)

    // Handle different feedback types
    switch (body.type) {
      case 'bug':
        await handleBugReport(body)
        break
      case 'feature':
        await handleFeatureRequest(body)
        break
      case 'rating':
        await handleRating(body)
        break
      default:
        await handleGeneralFeedback(body)
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Feedback received successfully',
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })

  } catch (error) {
    console.error('Feedback API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleBugReport(feedback: FeedbackData) {
  console.log('🐛 Bug Report:', {
    message: feedback.message,
    url: feedback.url,
    userAgent: feedback.userAgent
  })
  
  // In production:
  // - Create GitHub issue
  // - Notify development team
  // - Add to bug tracking system
}

async function handleFeatureRequest(feedback: FeedbackData) {
  console.log('💡 Feature Request:', {
    message: feedback.message,
    email: feedback.email
  })
  
  // In production:
  // - Add to feature backlog
  // - Create GitHub discussion
  // - Notify product team
}

async function handleRating(feedback: FeedbackData) {
  console.log('⭐ User Rating:', {
    rating: feedback.rating,
    message: feedback.message
  })
  
  // In production:
  // - Update user satisfaction metrics
  // - Store in analytics
  // - Track trends over time
}

async function handleGeneralFeedback(feedback: FeedbackData) {
  console.log('💬 General Feedback:', {
    message: feedback.message,
    email: feedback.email
  })
  
  // In production:
  // - Store for review
  // - Send to team communication
  // - Categorize and prioritize
}

// Health check
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'MDReader Feedback',
    timestamp: new Date().toISOString()
  })
}
