import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  Tag,
  FileText,
  User,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Document, Category } from '@/types/database'
import { getDocuments, getCategories } from '@/lib/supabase/client'

interface AdvancedSearchProps {
  onResults?: (documents: Document[]) => void
  onDocumentSelect?: (document: Document) => void
}

interface SearchFilters {
  query: string
  category: string
  status: string
  tags: string[]
  dateFrom: string
  dateTo: string
  author: string
  wordCountMin: number
  wordCountMax: number
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onResults,
  onDocumentSelect
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    status: '',
    tags: [],
    dateFrom: '',
    dateTo: '',
    author: '',
    wordCountMin: 0,
    wordCountMax: 10000
  })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [results, setResults] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSearch = async () => {
    setLoading(true)
    try {
      const searchFilters: any = {}
      
      if (filters.query) {
        searchFilters.search = filters.query
      }
      
      if (filters.category) {
        searchFilters.category_id = filters.category
      }
      
      if (filters.status) {
        searchFilters.status = filters.status
      }
      
      if (filters.author) {
        searchFilters.author_id = filters.author
      }

      const documents = await getDocuments(searchFilters)
      
      // Apply client-side filters for more complex criteria
      let filteredDocuments = documents
      
      if (filters.tags.length > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.tags && filters.tags.some(tag => doc.tags!.includes(tag))
        )
      }
      
      if (filters.dateFrom) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.created_at && new Date(doc.created_at) >= new Date(filters.dateFrom)
        )
      }
      
      if (filters.dateTo) {
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.created_at && new Date(doc.created_at) <= new Date(filters.dateTo)
        )
      }
      
      if (filters.wordCountMin > 0) {
        filteredDocuments = filteredDocuments.filter(doc => 
          (doc.word_count || 0) >= filters.wordCountMin
        )
      }
      
      if (filters.wordCountMax < 10000) {
        filteredDocuments = filteredDocuments.filter(doc => 
          (doc.word_count || 0) <= filters.wordCountMax
        )
      }
      
      setResults(filteredDocuments)
      onResults?.(filteredDocuments)
      
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      setFilters(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: '',
      status: '',
      tags: [],
      dateFrom: '',
      dateTo: '',
      author: '',
      wordCountMin: 0,
      wordCountMax: 10000
    })
    setResults([])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const hasActiveFilters = filters.query || 
    filters.category || 
    filters.status || 
    filters.tags.length > 0 ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.author ||
    filters.wordCountMin > 0 ||
    filters.wordCountMax < 10000

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search documents..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
                leftIcon={<Search className="w-4 h-4" />}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={handleClearFilters} className="text-red-600">
                <X className="w-4 h-4" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Author ID
                </label>
                <Input
                  placeholder="Author ID..."
                  value={filters.author}
                  onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  From Date
                </label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>

              {/* Word Count Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Word Count Range
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.wordCountMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, wordCountMin: parseInt(e.target.value) || 0 }))}
                    className="flex-1"
                  />
                  <span className="text-gray-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.wordCountMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, wordCountMax: parseInt(e.target.value) || 10000 }))}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddTag}
                    variant="outline"
                    disabled={!newTag.trim() || filters.tags.includes(newTag.trim())}
                  >
                    Add
                  </Button>
                </div>
                {filters.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        #{tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">
              Search Results ({results.length})
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((document) => (
                <div
                  key={document.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onDocumentSelect?.(document)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        {document.title}
                      </h4>
                      {document.summary && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {document.summary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        {document.category && (
                          <span>{document.category.icon} {document.category.name}</span>
                        )}
                        <span>{formatDate(document.created_at || '')}</span>
                        {document.word_count && (
                          <span>{document.word_count} words</span>
                        )}
                      </div>
                      {document.tags && document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {document.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {document.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{document.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {results.length === 0 && hasActiveFilters && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              Try adjusting your search criteria or clear all filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
