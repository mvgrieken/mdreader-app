import React from 'react'
import { Button } from './button'
import { cn } from '@/lib/utils/cn'

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'outline'
  }
  illustration?: React.ReactNode
}

/**
 * MDReader Empty State Component
 * 
 * Consistente empty states voor data-afwezigheid
 * - Helpvolle illustraties
 * - Clear call-to-actions
 * - Contextuele messaging
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  action,
  illustration,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6',
        className
      )}
      {...props}
    >
      {/* Illustration or Icon */}
      {illustration || icon ? (
        <div className="mb-6">
          {illustration || (
            <div className="w-16 h-16 text-neutral-400 mx-auto">
              {icon}
            </div>
          )}
        </div>
      ) : null}

      {/* Content */}
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-neutral-900">
          {title}
        </h3>
        {description && (
          <p className="text-neutral-600">
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {action && (
        <div className="mt-6">
          <Button
            variant={action.variant || 'primary'}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}

/**
 * Pre-configured empty states voor common use cases
 */

export const NoDocumentsEmptyState: React.FC<{
  onCreateDocument: () => void
}> = ({ onCreateDocument }) => {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      title="No documents yet"
      description="Create your first document to get started with organizing your knowledge."
      action={{
        label: 'Create Document',
        onClick: onCreateDocument,
        variant: 'primary'
      }}
    />
  )
}

export const NoSearchResultsEmptyState: React.FC<{
  onClearSearch: () => void
  searchTerm?: string
}> = ({ onClearSearch, searchTerm }) => {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
      title="No results found"
      description={
        searchTerm
          ? `No documents found matching "${searchTerm}". Try different keywords or clear the search.`
          : 'Try adjusting your search terms or filters to find what you\'re looking for.'
      }
      action={{
        label: 'Clear Search',
        onClick: onClearSearch,
        variant: 'outline'
      }}
    />
  )
}

export const NoCategoriesEmptyState: React.FC<{
  onCreateCategory: () => void
}> = ({ onCreateCategory }) => {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      }
      title="No categories yet"
      description="Create categories to organize your documents and improve searchability."
      action={{
        label: 'Create Category',
        onClick: onCreateCategory,
        variant: 'primary'
      }}
    />
  )
}

export const NoTagsEmptyState: React.FC<{
  onAddTag: () => void
}> = ({ onAddTag }) => {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      }
      title="No tags found"
      description="Add tags to your documents to make them easier to find and organize."
      action={{
        label: 'Add Tags',
        onClick: onAddTag,
        variant: 'outline'
      }}
    />
  )
}

export const NoFilesEmptyState: React.FC<{
  onUploadFile: () => void
}> = ({ onUploadFile }) => {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      }
      title="No files uploaded"
      description="Upload markdown files to get started with AI-powered categorization and organization."
      action={{
        label: 'Upload Files',
        onClick: onUploadFile,
        variant: 'primary'
      }}
    />
  )
}

export const NetworkErrorEmptyState: React.FC<{
  onRetry: () => void
}> = ({ onRetry }) => {
  return (
    <EmptyState
      icon={
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      }
      title="Something went wrong"
      description="We couldn't load your data. Please check your connection and try again."
      action={{
        label: 'Try Again',
        onClick: onRetry,
        variant: 'primary'
      }}
    />
  )
}
