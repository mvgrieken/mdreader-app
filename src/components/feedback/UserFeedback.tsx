'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils/cn'
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  X,
  Star,
  Bug,
  Lightbulb,
  Heart
} from 'lucide-react'

export interface FeedbackData {
  type: 'bug' | 'feature' | 'general' | 'rating'
  rating?: number
  message: string
  email?: string
  userAgent: string
  url: string
  timestamp: number
}

/**
 * User Feedback Component
 * 
 - Multiple feedback types
 - Rating system
 - Bug reporting
 - Feature requests
 - General feedback
 */
export const UserFeedback: React.FC<{
  className?: string
  trigger?: React.ReactNode
}> = ({ className, trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general' | 'rating'>('general')
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async () => {
    if (!message.trim()) {
      addToast({
        type: 'warning',
        title: 'Please enter a message',
        description: 'Your feedback is valuable to us!'
      })
      return
    }

    setIsSubmitting(true)

    const feedbackData: FeedbackData = {
      type: feedbackType,
      rating: feedbackType === 'rating' ? rating : undefined,
      message: message.trim(),
      email: email.trim() || undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now()
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      if (response.ok) {
        addToast({
          type: 'success',
          title: 'Thank you for your feedback!',
          description: 'We appreciate your input and will review it soon.'
        })
        
        // Reset form
        setFeedbackType('general')
        setRating(0)
        setMessage('')
        setEmail('')
        setIsOpen(false)
      } else {
        throw new Error('Failed to submit feedback')
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Submission failed',
        description: 'Please try again later or contact support directly.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const feedbackTypes = [
    {
      id: 'general' as const,
      label: 'General Feedback',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Share your thoughts and suggestions'
    },
    {
      id: 'bug' as const,
      label: 'Report a Bug',
      icon: <Bug className="w-5 h-5" />,
      description: 'Help us improve by reporting issues'
    },
    {
      id: 'feature' as const,
      label: 'Feature Request',
      icon: <Lightbulb className="w-5 h-5" />,
      description: 'Suggest new features or improvements'
    },
    {
      id: 'rating' as const,
      label: 'Rate MDReader',
      icon: <Star className="w-5 h-5" />,
      description: 'How would you rate your experience?'
    }
  ]

  const renderFeedbackContent = () => {
    switch (feedbackType) {
      case 'rating':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                How would you rate MDReader?
              </p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-2 transition-colors hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'w-8 h-8 transition-colors',
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300 dark:text-neutral-600'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more about your experience (optional)..."
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg resize-none h-24 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            />
          </div>
        )
        
      default:
        return (
          <div className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                feedbackType === 'bug' 
                  ? 'Describe the bug you encountered...'
                  : feedbackType === 'feature'
                  ? 'Describe the feature you\'d like to see...'
                  : 'Share your feedback with us...'
              }
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg resize-none h-32 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            />
            
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email (optional - for follow-up)"
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50"
            />
          </div>
        )
    }
  }

  const TriggerButton = trigger || (
    <Button
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-40 shadow-lg"
      icon={<MessageSquare className="w-4 h-4" />}
    >
      Feedback
    </Button>
  )

  return (
    <>
      {React.cloneElement(TriggerButton as React.ReactElement, {
        onClick: () => setIsOpen(true)
      } as any)}
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Share Your Feedback"
        description="Help us improve MDReader with your feedback"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              loading={isSubmitting}
              disabled={!message.trim() || (feedbackType === 'rating' && rating === 0)}
            >
              Send Feedback
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Feedback Type Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              What type of feedback?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFeedbackType(type.id)}
                  className={cn(
                    'p-3 text-left border rounded-lg transition-all',
                    'hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20',
                    feedbackType === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'flex-shrink-0',
                      feedbackType === type.id ? 'text-primary-600' : 'text-neutral-500'
                    )}>
                      {type.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-neutral-900 dark:text-neutral-50">
                        {type.label}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {type.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Content */}
          {renderFeedbackContent()}
        </div>
      </Modal>
    </>
  )
}

/**
 * Quick Feedback Buttons
 */
export const QuickFeedback: React.FC<{
  onPositive?: () => void
  onNegative?: () => void
  className?: string
}> = ({ onPositive, onNegative, className }) => {
  const { addToast } = useToast()

  const handlePositive = () => {
    addToast({
      type: 'success',
      title: 'Glad you like it!',
      description: 'Your positive feedback helps us know we\'re on the right track.'
    })
    onPositive?.()
  }

  const handleNegative = () => {
    addToast({
      type: 'info',
      title: 'Help us improve',
      description: 'Please share what didn\'t work for you.'
    })
    onNegative?.()
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-sm text-neutral-600 dark:text-neutral-300">
        Was this helpful?
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePositive}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        <ThumbsUp className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNegative}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <ThumbsDown className="w-4 h-4" />
      </Button>
    </div>
  )
}
