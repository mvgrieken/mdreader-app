import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Supabase client for client-side operations
export const supabase = createClient()

// Helper functions for common operations
export const createDocument = async (document: Database['public']['Tables']['documents']['Insert']) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getDocuments = async (filters?: {
  status?: Database['public']['Tables']['documents']['Row']['status']
  category_id?: string
  author_id?: string
  search?: string
}) => {
  let query = supabase
    .from('documents')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id)
  }
  
  if (filters?.author_id) {
    query = query.eq('author_id', filters.author_id)
  }
  
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const getDocument = async (id: string) => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const updateDocument = async (id: string, updates: Database['public']['Tables']['documents']['Update']) => {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteDocument = async (id: string) => {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) throw error
  return data
}

export const createCategory = async (category: Database['public']['Tables']['categories']['Insert']) => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single()
  
  if (error) throw error
  return data
}
