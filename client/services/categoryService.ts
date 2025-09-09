import { supabase, shouldSkipSupabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type CategoryRow = Database['public']['Tables']['categories']['Row']
type CategoryInsert = Database['public']['Tables']['categories']['Insert']
type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export interface Category {
  id: string
  name: {
    en: string
    ar: string
  }
  description?: {
    en: string
    ar: string
  }
  slug: string
  createdAt?: string
  updatedAt?: string
}

// Helper function to convert database row to Category interface
const dbRowToCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: {
    en: row.name_en,
    ar: row.name_ar
  },
  description: row.description_en || row.description_ar ? {
    en: row.description_en || '',
    ar: row.description_ar || ''
  } : undefined,
  slug: row.slug,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

// Helper function to convert Category to database insert
const categoryToDbInsert = (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): CategoryInsert => ({
  name_en: category.name.en,
  name_ar: category.name.ar,
  description_en: category.description?.en || null,
  description_ar: category.description?.ar || null,
  slug: category.slug
})

// Helper function to convert Category to database update
const categoryToDbUpdate = (category: Partial<Category>): CategoryUpdate => ({
  ...(category.name && {
    name_en: category.name.en,
    name_ar: category.name.ar
  }),
  ...(category.description && {
    description_en: category.description.en || null,
    description_ar: category.description.ar || null
  }),
  ...(category.slug && { slug: category.slug })
})

export const categoryService = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    if (shouldSkipSupabase()) {
      console.log('📋 Using local storage mode for categories')
      throw new Error('Local storage mode - using fallback')
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase error fetching categories:', error.message, error)
        throw new Error(`Failed to fetch categories: ${error.message}`)
      }

      return data?.map(dbRowToCategory) || []
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error fetching categories:', errorMessage)
      throw new Error(`Categories fetch failed: ${errorMessage}`)
    }
  },

  // Get category by ID
  async getById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }

      return data ? dbRowToCategory(data) : null
    } catch (error) {
      console.error('Error fetching category by ID:', error)
      throw error
    }
  },

  // Create new category
  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert(categoryToDbInsert(category))
        .select()
        .single()

      if (error) throw error

      return dbRowToCategory(data)
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  },

  // Update category
  async update(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryToDbUpdate(updates))
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return dbRowToCategory(data)
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  },

  // Delete category
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }
}
