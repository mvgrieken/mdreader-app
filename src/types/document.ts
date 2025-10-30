/**
 * Document types voor MDReader
 * Gedefinieerd volgens onze database schema
 */

export interface Document {
  id: string
  user_id: string
  
  // Content
  title: string
  slug?: string
  content: string
  storage_path?: string
  size_bytes?: number
  
  // Metadata (from frontmatter)
  frontmatter: Record<string, any>
  tags: string[]
  category?: string
  status: 'draft' | 'published' | 'archived'
  
  // AI-generated metadata
  ai_tags: string[]
  ai_category?: string
  ai_summary?: string
  embedding?: number[] // Vector embedding for semantic search
  
  // Sharing & permissions
  is_public: boolean
  share_token?: string
  
  // Analytics
  view_count: number
  edit_count: number
  
  // Timestamps
  created_at: string
  updated_at: string
}

export interface DocumentLink {
  id: string
  source_doc_id: string
  target_doc_id: string
  link_type: 'wiki-link' | 'reference' | 'backlink' | 'embed'
  context?: string
  anchor_text?: string
  line_number?: number
  char_position?: number
  created_at: string
}

export interface DocumentVersion {
  id: string
  document_id: string
  title: string
  content: string
  frontmatter: Record<string, any>
  tags: string[]
  version_number: number
  change_summary?: string
  change_type: 'create' | 'edit' | 'delete' | 'restore'
  created_by: string
  created_at: string
  is_compressed: boolean
}

export interface DocumentCollaborator {
  document_id: string
  user_id: string
  permission: 'view' | 'comment' | 'edit' | 'admin'
  invited_by?: string
  invited_at: string
  accepted_at?: string
  last_viewed_at?: string
  last_edited_at?: string
}

// ============================================
// Frontend Types (UI State)
// ============================================

export interface DocumentListItem {
  id: string
  title: string
  slug?: string
  tags: string[]
  category?: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  created_at: string
  updated_at: string
  is_public: boolean
}

export interface DocumentFormData {
  title: string
  content: string
  tags: string[]
  category?: string
  status: 'draft' | 'published' | 'archived'
  is_public: boolean
}

export interface DocumentSearchFilters {
  query?: string
  tags?: string[]
  category?: string
  status?: string
  date_range?: {
    start: string
    end: string
  }
  sort_by?: 'created_at' | 'updated_at' | 'title' | 'view_count'
  sort_order?: 'asc' | 'desc'
}

export interface DocumentSearchResult {
  documents: DocumentListItem[]
  total_count: number
  page: number
  per_page: number
  has_next: boolean
  has_prev: boolean
}

// ============================================
// API Types
// ============================================

export interface CreateDocumentRequest {
  title: string
  content: string
  tags?: string[]
  category?: string
  status?: 'draft' | 'published' | 'archived'
  is_public?: boolean
}

export interface UpdateDocumentRequest {
  title?: string
  content?: string
  tags?: string[]
  category?: string
  status?: 'draft' | 'published' | 'archived'
  is_public?: boolean
}

export interface UploadDocumentRequest {
  file: File
  title?: string
  tags?: string[]
  category?: string
  status?: 'draft' | 'published' | 'archived'
  is_public?: boolean
}

// ============================================
// AI Types
// ============================================

export interface AICategorizationResult {
  category: string
  confidence: number
  suggested_tags: Array<{
    tag: string
    confidence: number
  }>
  summary?: string
}

export interface AISearchResult {
  document: DocumentListItem
  relevance_score: number
  matched_content?: string[]
  matched_tags?: string[]
}

// ============================================
// Validation Schemas (Zod)
// ============================================

import { z } from 'zod'

export const documentSchema = z.object({
  title: z.string().min(1, 'Titel is verplicht').max(200, 'Titel mag max 200 karakters zijn'),
  content: z.string().min(1, 'Content is verplicht'),
  tags: z.array(z.string().max(50)).default([]),
  category: z.string().max(50).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_public: z.boolean().default(false),
})

export const createDocumentSchema = documentSchema.pick({
  title: true,
  content: true,
  tags: true,
  category: true,
  status: true,
  is_public: true,
})

export const updateDocumentSchema = documentSchema.partial()

export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  sort_by: z.enum(['created_at', 'updated_at', 'title', 'view_count']).optional(),
  sort_order: z.enum(['asc', 'desc']).optional(),
})

export type DocumentInput = z.infer<typeof documentSchema>
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>
