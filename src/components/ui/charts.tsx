import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils/cn'

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface BarChartProps {
  data: ChartData[]
  height?: number
  showLabels?: boolean
  showValues?: boolean
  animated?: boolean
  className?: string
}

/**
 * MDReader Bar Chart Component
 * 
 * Simple, accessible bar chart met animations
 * - Responsive design
 * - Smooth animations
 * - Accessibility support
 * - Custom styling
 */
export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 200,
  showLabels = true,
  showValues = true,
  animated = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const maxValue = Math.max(...data.map(d => d.value))
  const defaultColors = [
    'bg-primary-500',
    'bg-secondary-500', 
    'bg-accent-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500'
  ]

  return (
    <div ref={chartRef} className={cn('w-full', className)}>
      <div 
        className="flex items-end justify-between space-x-2"
        style={{ height: `${height}px` }}
      >
        {data.map((item, index) => {
          const percentage = (item.value / maxValue) * 100
          const color = item.color || defaultColors[index % defaultColors.length]
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end"
            >
              {/* Value label */}
              {showValues && (
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                  {item.value}
                </span>
              )}
              
              {/* Bar */}
              <div
                className={cn(
                  'w-full rounded-t transition-all duration-500 ease-out',
                  color,
                  animated && !isVisible && 'opacity-0 transform translate-y-4'
                )}
                style={{
                  height: animated 
                    ? isVisible ? `${percentage}%` : '0%'
                    : `${percentage}%`,
                  transitionDelay: animated ? `${index * 50}ms` : '0ms'
                }}
              />
              
              {/* Label */}
              {showLabels && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 text-center">
                  {item.label}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export interface LineChartProps {
  data: Array<{ x: number; y: number }>
  height?: number
  color?: string
  showPoints?: boolean
  animated?: boolean
  className?: string
}

/**
 * Simple Line Chart Component
 */
export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 200,
  color = '#3B82F6',
  showPoints = true,
  animated = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const maxX = Math.max(...data.map(d => d.x))
  const maxY = Math.max(...data.map(d => d.y))
  
  const points = data
    .map(point => {
      const x = (point.x / maxX) * 100
      const y = 100 - (point.y / maxY) * 100
      return `${x},${y}`
    })
    .join(' ')

  const pathData = `M ${points}`

  return (
    <div ref={chartRef} className={cn('w-full', className)}>
      <svg
        width="100%"
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            'transition-all duration-1000 ease-out',
            animated && !isVisible && 'opacity-0'
          )}
          style={{
            strokeDasharray: animated ? 1000 : 0,
            strokeDashoffset: animated && isVisible ? 0 : 1000
          }}
        />
        
        {/* Points */}
        {showPoints && data.map((point, index) => {
          const x = (point.x / maxX) * 100
          const y = 100 - (point.y / maxY) * 100
          
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
              className={cn(
                'transition-all duration-300 ease-out',
                animated && !isVisible && 'opacity-0 scale-0'
              )}
              style={{
                transitionDelay: animated ? `${index * 100}ms` : '0ms'
              }}
            />
          )
        })}
      </svg>
    </div>
  )
}

export interface PieChartProps {
  data: ChartData[]
  size?: number
  showLabels?: boolean
  animated?: boolean
  className?: string
}

/**
 * Simple Pie Chart Component
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  showLabels = true,
  animated = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (chartRef.current) {
      observer.observe(chartRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const total = data.reduce((sum, item) => sum + item.value, 0)
  const defaultColors = [
    '#3B82F6', // primary-500
    '#6366F1', // secondary-500
    '#10B981', // accent-500
    '#8B5CF6', // purple-500
    '#F59E0B', // yellow-500
    '#EF4444'  // red-500
  ]

  let currentAngle = -90 // Start from top

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    
    currentAngle += angle

    const startAngleRad = (startAngle * Math.PI) / 180
    const endAngleRad = (endAngle * Math.PI) / 180

    const x1 = 50 + 50 * Math.cos(startAngleRad)
    const y1 = 50 + 50 * Math.sin(startAngleRad)
    const x2 = 50 + 50 * Math.cos(endAngleRad)
    const y2 = 50 + 50 * Math.sin(endAngleRad)

    const largeArcFlag = angle > 180 ? 1 : 0

    const pathData = [
      `M 50 50`,
      `L ${x1} ${y1}`,
      `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ')

    return {
      path: pathData,
      color: item.color || defaultColors[index % defaultColors.length],
      label: item.label,
      value: item.value,
      percentage
    }
  })

  return (
    <div ref={chartRef} className={cn('relative', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className="transform -rotate-90"
      >
        {segments.map((segment, index) => (
          <path
            key={index}
            d={segment.path}
            fill={segment.color}
            className={cn(
              'transition-all duration-500 ease-out',
              animated && !isVisible && 'opacity-0 scale-95'
            )}
            style={{
              transformOrigin: '50% 50%',
              transitionDelay: animated ? `${index * 100}ms` : '0ms'
            }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      {showLabels && (
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-2 p-4">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-neutral-600 dark:text-neutral-300">
                {segment.label}: {segment.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Progress Ring Component
 */
export interface ProgressRingProps {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showLabel?: boolean
  animated?: boolean
  className?: string
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  backgroundColor = '#E5E7EB',
  showLabel = true,
  animated = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentValue, setCurrentValue] = useState(0)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ringRef.current) {
      observer.observe(ringRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (animated && isVisible) {
      const timer = setTimeout(() => {
        setCurrentValue(value)
      }, 100)
      return () => clearTimeout(timer)
    } else if (!animated) {
      setCurrentValue(value)
    }
  }, [value, animated, isVisible])

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const percentage = (currentValue / max) * 100
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div ref={ringRef} className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? (isVisible ? strokeDashoffset : circumference) : strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  )
}
