'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DocumentList } from '@/components/documents/DocumentList'
import { DocumentEditor } from '@/components/documents/DocumentEditor'
import { PerformanceDashboard } from '@/components/performance/PerformanceDashboard'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Document } from '@/types/database'
import { Plus } from 'lucide-react'

type View = 'list' | 'editor' | 'preview' | 'performance'

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<View>('list')
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>()

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document)
    setCurrentView('preview')
  }

  const handleDocumentEdit = (document: Document) => {
    setSelectedDocument(document)
    setCurrentView('editor')
  }

  const handleDocumentCreate = () => {
    setSelectedDocument(undefined)
    setCurrentView('editor')
  }

  const handleDocumentSave = (document: Document) => {
    setSelectedDocument(undefined)
    setCurrentView('list')
  }

  const handleCancel = () => {
    setSelectedDocument(undefined)
    setCurrentView('list')
  }

  // Mock user data - in real app this would come from auth
  const user = {
    name: 'John Doe',
    email: 'john@example.com'
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'list':
        return 'Documents'
      case 'editor':
        return selectedDocument ? 'Edit Document' : 'Create Document'
      case 'preview':
        return 'Document Preview'
      case 'performance':
        return 'Performance Dashboard'
      default:
        return 'Dashboard'
    }
  }

  const getPageSubtitle = () => {
    switch (currentView) {
      case 'list':
        return 'Manage and organize your documents'
      case 'editor':
        return 'Edit your markdown document with AI assistance'
      case 'preview':
        return 'View document details and content'
      case 'performance':
        return 'Monitor application performance and metrics'
      default:
        return 'Welcome to MDReader'
    }
  }

  const getBreadcrumbs = () => {
    switch (currentView) {
      case 'list':
        return [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Documents' }
        ]
      case 'editor':
        return [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Documents', href: '/dashboard' },
          { label: selectedDocument ? 'Edit' : 'Create' }
        ]
      case 'preview':
        return [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Documents', href: '/dashboard' },
          { label: 'Preview' }
        ]
      case 'performance':
        return [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Performance' }
        ]
      default:
        return [{ label: 'Dashboard' }]
    }
  }

  const getPageActions = () => {
    switch (currentView) {
      case 'list':
        return (
          <Button onClick={handleDocumentCreate} icon={<Plus className="w-4 h-4" />}>
            Create Document
          </Button>
        )
      case 'performance':
        return (
          <Button onClick={() => window.location.reload()}>
            Refresh Metrics
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <DashboardLayout
      title={getPageTitle()}
      subtitle={getPageSubtitle()}
      breadcrumbs={getBreadcrumbs()}
      actions={getPageActions()}
      user={user}
    >
      {/* Content */}
      {currentView === 'list' && (
        <DocumentList
          onDocumentSelect={handleDocumentSelect}
          onDocumentEdit={handleDocumentEdit}
          onDocumentCreate={handleDocumentCreate}
        />
      )}

      {currentView === 'editor' && (
        <DocumentEditor
          document={selectedDocument}
          onSave={handleDocumentSave}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'preview' && selectedDocument && (
        <DocumentEditor
          document={selectedDocument}
          onSave={handleDocumentSave}
          onCancel={handleCancel}
        />
      )}

      {currentView === 'performance' && (
        <PerformanceDashboard />
      )}
    </DashboardLayout>
  )
}

// Force dynamic rendering for dashboard
export const dynamic = 'force-dynamic'
