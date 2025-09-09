import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// For development: use placeholder values if env vars are not set
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder_key'

const finalUrl = supabaseUrl || fallbackUrl
const finalKey = supabaseAnonKey || fallbackKey

export const supabase = createClient(finalUrl, finalKey)

// Flag to check if we're using real Supabase
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey &&
  supabaseUrl !== fallbackUrl && supabaseAnonKey !== fallbackKey)

// Helper function to check if we should skip Supabase operations
export const shouldSkipSupabase = () => {
  return !isSupabaseConfigured || finalUrl === fallbackUrl || finalKey === fallbackKey
}

// Database types
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          description_en: string | null
          description_ar: string | null
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          description_en?: string | null
          description_ar?: string | null
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          description_en?: string | null
          description_ar?: string | null
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name_en: string
          name_ar: string
          description_en: string
          description_ar: string
          price: number
          image: string | null
          category_id: string
          weight: string | null
          origin: string | null
          store: 'irth-biladi' | 'cilka'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_en: string
          name_ar: string
          description_en: string
          description_ar: string
          price: number
          image?: string | null
          category_id: string
          weight?: string | null
          origin?: string | null
          store: 'irth-biladi' | 'cilka'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_en?: string
          name_ar?: string
          description_en?: string
          description_ar?: string
          price?: number
          image?: string | null
          category_id?: string
          weight?: string | null
          origin?: string | null
          store?: 'irth-biladi' | 'cilka'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          customer_name: string
          customer_email: string
          total: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_name: string
          customer_email: string
          total: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_name?: string
          customer_email?: string
          total?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: any
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}
