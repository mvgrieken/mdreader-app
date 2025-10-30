import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Document, Category } from '@/types/database'
import { getDocuments, getCategories, deleteDocument } from '@/lib/supabase/client'
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar, 
  Clock, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Archive
} from 'lucide-react'

interface DocumentListProps {
  onDocumentSelect?: (document: Document) => void
  onDocumentEdit?: (document: Document) => void
  onDocumentCreate?: () => void
}

export const DocumentList: React.FC<DocumentListProps> = ({
  onDocumentSelect,
  onDocumentEdit,
  onDocumentCreate
}) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadDocuments()
    loadCategories()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      
      if (statusFilter !== 'all') {
        filters.status = statusFilter
      }
      
      if (selectedCategory) {
        filters.category_id = selectedCategory
      }
      
      if (searchTerm) {
        filters.search = searchTerm
      }

      const data = await getDocuments(filters)
      setDocuments(data)
    } catch (error) {
      console.error('Error loading documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleDeleteDocument = async (document: Document) => {
    if (!confirm(`Are you sure you want to delete "${document.title}"?`)) {
      return
    }

    try {
      await deleteDocument(document.id)
      await loadDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getReadingTime = (wordCount: number | null) => {
    if (!wordCount) return 0
    const wordsPerMinute = 200
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
        <Button onClick={onDocumentCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <Button onClick={loadDocuments} variant="outline">
          Search
        </Button>
      </div>

      {/* Documents Grid */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first document to get started'
              }
            </p>
            {!searchTerm && !selectedCategory && statusFilter === 'all' && (
              <Button onClick={onDocumentCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 
                        className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600"
                        onClick={() => onDocumentSelect?.(document)}
                      >
                        {document.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                        {document.status}
                      </span>
                    </div>
                    
                    {document.summary && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {document.summary}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {document.category && (
                        <span className="flex items-center gap-1">
                          {document.category.icon}
                          {document.category.name}
                        </span>
                      )}
                      
                      {document.word_count && document.word_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getReadingTime(document.word_count)} min read
                        </span>
                      )}
                      
                      {document.created_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(document.created_at)}
                        </span>
                      )}
                    </div>

                    {document.tags && document.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {document.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {document.tags.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{document.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDocumentSelect?.(document)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDocumentEdit?.(document)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(document)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
