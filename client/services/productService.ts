import { supabase, shouldSkipSupabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'
import { Product } from '../contexts/CartContext'

type ProductRow = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

// Helper function to convert database row to Product interface
const dbRowToProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: {
    en: row.name_en,
    ar: row.name_ar
  },
  description: {
    en: row.description_en,
    ar: row.description_ar
  },
  price: row.price,
  image: row.image || '',
  category: row.category_id || '',
  weight: row.weight || '',
  origin: row.origin || '',
  store: row.store as 'irth-biladi' | 'cilka'
})

// Helper function to convert Product to database insert
const productToDbInsert = (product: Omit<Product, 'id'>): ProductInsert => ({
  name_en: product.name.en,
  name_ar: product.name.ar,
  description_en: product.description.en,
  description_ar: product.description.ar,
  price: product.price,
  image: product.image || null,
  category_id: product.category,
  weight: product.weight || null,
  origin: product.origin || null,
  store: product.store
})

// Helper function to convert Product to database update
const productToDbUpdate = (product: Partial<Product>): ProductUpdate => ({
  ...(product.name && {
    name_en: product.name.en,
    name_ar: product.name.ar
  }),
  ...(product.description && {
    description_en: product.description.en,
    description_ar: product.description.ar
  }),
  ...(product.price !== undefined && { price: product.price }),
  ...(product.image !== undefined && { image: product.image || null }),
  ...(product.category && { category_id: product.category }),
  ...(product.weight !== undefined && { weight: product.weight || null }),
  ...(product.origin !== undefined && { origin: product.origin || null }),
  ...(product.store && { store: product.store })
})

export const productService = {
  // Get all products
  async getAll(): Promise<Product[]> {
    if (shouldSkipSupabase()) {
      console.log('📦 Using local storage mode for products')
      throw new Error('Local storage mode - using fallback')
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Supabase error fetching products:', error.message, error)
        throw new Error(`Failed to fetch products: ${error.message}`)
      }

      return data?.map(dbRowToProduct) || []
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      console.error('Error fetching products:', errorMessage)
      throw new Error(`Products fetch failed: ${errorMessage}`)
    }
  },

  // Get products by store
  async getByStore(store: 'irth-biladi' | 'cilka'): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store', store)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(dbRowToProduct) || []
    } catch (error) {
      console.error('Error fetching products by store:', error)
      throw error
    }
  },

  // Get products by category
  async getByCategory(categoryId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(dbRowToProduct) || []
    } catch (error) {
      console.error('Error fetching products by category:', error)
      throw error
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }

      return data ? dbRowToProduct(data) : null
    } catch (error) {
      console.error('Error fetching product by ID:', error)
      throw error
    }
  },

  // Create new product
  async create(product: Omit<Product, 'id'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(productToDbInsert(product))
        .select()
        .single()

      if (error) throw error

      return dbRowToProduct(data)
    } catch (error) {
      console.error('Error creating product:', error)
      throw error
    }
  },

  // Update product
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productToDbUpdate(updates))
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return dbRowToProduct(data)
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }
}
