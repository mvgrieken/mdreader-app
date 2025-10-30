'use client'

import React, { useState } from 'react'
import { DocumentList } from '@/components/documents/DocumentList'
import { DocumentEditor } from '@/components/documents/DocumentEditor'
import { Document } from '@/types/database'

type View = 'list' | 'editor' | 'preview'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    </div>
  )
}

// Force dynamic rendering for dashboard
export const dynamic = 'force-dynamic'
