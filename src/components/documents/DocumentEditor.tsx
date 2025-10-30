import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileUpload } from './FileUpload'
import { AICategorization } from './AICategorization'
import { MarkdownEditor } from '../markdown/MarkdownEditor'
import { Document, Category } from '@/types/database'
import { createDocument, updateDocument, getCategories } from '@/lib/supabase/client'
import { parseMarkdown, generateSummary } from '@/lib/markdown/parser'
import { 
  Save, 
  Eye, 
  Edit, 
  FileText, 
  Tag, 
  Folder,
  X,
  Plus,
  Upload,
  Brain
} from 'lucide-react'

interface DocumentEditorProps {
  document?: Document
  onSave?: (document: Document) => void
  onCancel?: () => void
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(document?.title || '')
  const [content, setContent] = useState(document?.content || '')
  const [summary, setSummary] = useState(document?.summary || '')
  const [categoryId, setCategoryId] = useState(document?.category_id || '')
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>((document?.status as 'draft' | 'published' | 'archived') || 'draft')
  const [tags, setTags] = useState<string[]>(document?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [showAICategorization, setShowAICategorization] = useState(false)

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

  const handleFileUpload = (file: File, fileContent: string) => {
    try {
      // Parse markdown content
      const parsed = parseMarkdown(fileContent)
      
      // Auto-fill form with parsed data
      if (parsed.metadata.title && !title) {
        setTitle(parsed.metadata.title)
      }
      
      if (parsed.metadata.description && !summary) {
        setSummary(parsed.metadata.description)
      }
      
      if (parsed.metadata.tags && parsed.metadata.tags.length > 0) {
        setTags([...new Set([...tags, ...parsed.metadata.tags])])
      }
      
      if (parsed.metadata.category && !categoryId) {
        const matchingCategory = categories.find(cat => 
          cat.name.toLowerCase() === parsed.metadata.category?.toLowerCase()
        )
        if (matchingCategory) {
          setCategoryId(matchingCategory.id)
        }
      }
      
      // Set content
      setContent(parsed.content)
      
      // Auto-generate summary if not provided
      if (!summary && parsed.content) {
        setSummary(generateSummary(parsed.content))
      }
      
      // Hide file upload after successful upload
      setShowFileUpload(false)
      
    } catch (error) {
      console.error('Error parsing markdown file:', error)
      alert('Failed to parse markdown file')
    }
  }

  const handleAICategorySelect = (categoryName: string) => {
    const matchingCategory = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    )
    if (matchingCategory) {
      setCategoryId(matchingCategory.id)
    }
  }

  const handleAITagsSelect = (aiTags: string[]) => {
    setTags([...new Set([...tags, ...aiTags])])
  }

  const handleAISummarySelect = (aiSummary: string) => {
    setSummary(aiSummary)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    try {
      setLoading(true)
      
      const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length
      const readingTime = Math.ceil(wordCount / 200) // 200 words per minute

      const documentData = {
        title: title.trim(),
        content: content.trim(),
        summary: summary.trim() || null,
        category_id: categoryId || null,
        status,
        tags,
        word_count: wordCount,
        reading_time: readingTime
      }

      let savedDocument: Document
      if (document) {
        savedDocument = await updateDocument(document.id, documentData)
      } else {
        savedDocument = await createDocument(documentData)
      }

      onSave?.(savedDocument)
    } catch (error) {
      console.error('Error saving document:', error)
      alert('Failed to save document')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const renderMarkdownPreview = (markdown: string) => {
    // Simple markdown preview (in production, use a proper markdown library)
    return (
      <div className="prose prose-sm max-w-none">
        <h1>{title}</h1>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {document ? 'Edit Document' : 'New Document'}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFileUpload(!showFileUpload)}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowAICategorization(!showAICategorization)}
            className="flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            AI Analysis
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2"
          >
            {isPreview ? (
              <>
                <Edit className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Preview
              </>
            )}
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* File Upload */}
      {showFileUpload && (
        <FileUpload 
          onFileUpload={handleFileUpload}
          maxFileSize={10 * 1024 * 1024} // 10MB
          acceptedTypes={['text/markdown', 'text/plain', '.md', '.txt']}
        />
      )}

      {/* AI Categorization */}
      {showAICategorization && (
        <AICategorization 
          content={content}
          onCategorySelect={handleAICategorySelect}
          onTagsSelect={handleAITagsSelect}
          onSummarySelect={handleAISummarySelect}
        />
      )}

      {/* Document Form */}
      <Card>
        <CardContent className="p-6">
          {isPreview ? (
            <div className="space-y-6">
              {renderMarkdownPreview(content)}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="text-lg font-semibold"
                />
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Folder className="w-4 h-4 inline mr-1" />
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief summary of the document..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
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
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a tag..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddTag}
                      variant="outline"
                      disabled={!newTag.trim() || tags.includes(newTag.trim())}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Content (Markdown)
                </label>
                <MarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Write your document in markdown..."
                  height="500px"
                  showPreview={true}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
