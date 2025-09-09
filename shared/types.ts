// Shared types between client and server

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

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Product types for API
export interface Product {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  price: number;
  image: string | null;
  category: string;
  weight?: string;
  origin?: string;
  store: 'irth-biladi' | 'cilka';
  created_at: string;
  updated_at: string;
}

// Category types for API
export interface Category {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description?: {
    en: string | null;
    ar: string | null;
  };
  slug: string;
  created_at: string;
  updated_at: string;
}

// User types for API
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

// Order types for API
export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    street: string;
    city: string;
    country: string;
    postal_code?: string;
    phone?: string;
  };
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price: number;
  created_at: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
