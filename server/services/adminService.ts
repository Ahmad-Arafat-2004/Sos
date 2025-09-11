import { supabase, shouldSkipSupabase } from '../lib/supabase';
import type { ApiResponse } from '../../shared/types';

export interface AdminStats {
  users: {
    total: number;
    new_this_month: number;
    admins: number;
  };
  products: {
    total: number;
    by_store: {
      'irth-biladi': number;
      'cilka': number;
    };
    by_category: Array<{
      category_name: string;
      count: number;
    }>;
  };
  orders: {
    total: number;
    total_revenue: number;
    this_month: number;
    this_month_revenue: number;
    by_status: {
      pending: number;
      processing: number;
      shipped: number;
      delivered: number;
      cancelled: number;
    };
  };
  categories: {
    total: number;
  };
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'order_created' | 'product_added' | 'category_added';
  description: string;
  created_at: string;
  details?: any;
}

export class AdminService {
  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    if (shouldSkipSupabase()) {
      return {
        success: true,
        data: {
          users: { total: 0, new_this_month: 0, admins: 0 },
          products: { 
            total: 0, 
            by_store: { 'irth-biladi': 0, 'cilka': 0 },
            by_category: []
          },
          orders: {
            total: 0,
            total_revenue: 0,
            this_month: 0,
            this_month_revenue: 0,
            by_status: {
              pending: 0,
              processing: 0,
              shipped: 0,
              delivered: 0,
              cancelled: 0
            }
          },
          categories: { total: 0 }
        },
        message: 'Using fallback data - Supabase not configured'
      };
    }

    try {
      // Get current date for monthly calculations
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Users statistics
      const { data: usersData } = await supabase
        .from('users')
        .select('id, created_at, role');

      const totalUsers = usersData?.length || 0;
      const newUsersThisMonth = usersData?.filter(u => u.created_at >= startOfMonth).length || 0;
      const adminUsers = usersData?.filter(u => u.role === 'admin').length || 0;

      // Products statistics
      const { data: productsData } = await supabase
        .from('products')
        .select('id, store, category_id, categories(name_en)');

      const totalProducts = productsData?.length || 0;
      const irthBiladiProducts = productsData?.filter(p => p.store === 'irth-biladi').length || 0;
      const cilkaProducts = productsData?.filter(p => p.store === 'cilka').length || 0;

      // Products by category
      const categoryCount: { [key: string]: number } = {};
      productsData?.forEach((product: any) => {
        const categoryName = (product as any).categories?.name_en || 'Unknown';
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });

      const productsByCategory = Object.entries(categoryCount).map(([category_name, count]) => ({
        category_name,
        count
      }));

      // Orders statistics
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, total, status, created_at');

      const totalOrders = ordersData?.length || 0;
      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.total, 0) || 0;
      
      const ordersThisMonth = ordersData?.filter(o => o.created_at >= startOfMonth) || [];
      const thisMonthOrders = ordersThisMonth.length;
      const thisMonthRevenue = ordersThisMonth.reduce((sum, order) => sum + order.total, 0);

      // Orders by status
      const ordersByStatus = {
        pending: ordersData?.filter(o => o.status === 'pending').length || 0,
        processing: ordersData?.filter(o => o.status === 'processing').length || 0,
        shipped: ordersData?.filter(o => o.status === 'shipped').length || 0,
        delivered: ordersData?.filter(o => o.status === 'delivered').length || 0,
        cancelled: ordersData?.filter(o => o.status === 'cancelled').length || 0,
      };

      // Categories statistics
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id');

      const totalCategories = categoriesData?.length || 0;

      const stats: AdminStats = {
        users: {
          total: totalUsers,
          new_this_month: newUsersThisMonth,
          admins: adminUsers
        },
        products: {
          total: totalProducts,
          by_store: {
            'irth-biladi': irthBiladiProducts,
            'cilka': cilkaProducts
          },
          by_category: productsByCategory
        },
        orders: {
          total: totalOrders,
          total_revenue: totalRevenue,
          this_month: thisMonthOrders,
          this_month_revenue: thisMonthRevenue,
          by_status: ordersByStatus
        },
        categories: {
          total: totalCategories
        }
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch dashboard statistics'
      };
    }
  }

  // Get recent activity
  async getRecentActivity(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    if (shouldSkipSupabase()) {
      return {
        success: true,
        data: [],
        message: 'Using fallback data - Supabase not configured'
      };
    }

    try {
      const activities: RecentActivity[] = [];

      // Get recent users
      const { data: recentUsers } = await supabase
        .from('users')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      recentUsers?.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_registered',
          description: `New user ${user.name} registered`,
          created_at: user.created_at,
          details: { user_email: user.email }
        });
      });

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, customer_name, total, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      recentOrders?.forEach(order => {
        activities.push({
          id: `order-${order.id}`,
          type: 'order_created',
          description: `New order by ${order.customer_name} - $${order.total}`,
          created_at: order.created_at,
          details: { order_id: order.id, total: order.total }
        });
      });

      // Get recent products
      const { data: recentProducts } = await supabase
        .from('products')
        .select('id, name_en, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      recentProducts?.forEach(product => {
        activities.push({
          id: `product-${product.id}`,
          type: 'product_added',
          description: `New product added: ${product.name_en}`,
          created_at: product.created_at,
          details: { product_id: product.id }
        });
      });

      // Get recent categories
      const { data: recentCategories } = await supabase
        .from('categories')
        .select('id, name_en, created_at')
        .order('created_at', { ascending: false })
        .limit(2);

      recentCategories?.forEach(category => {
        activities.push({
          id: `category-${category.id}`,
          type: 'category_added',
          description: `New category added: ${category.name_en}`,
          created_at: category.created_at,
          details: { category_id: category.id }
        });
      });

      // Sort all activities by date and limit
      const sortedActivities = activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);

      return {
        success: true,
        data: sortedActivities
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch recent activity'
      };
    }
  }

  // Get all users (admin management)
  async getAllUsers(): Promise<ApiResponse<any[]>> {
    if (shouldSkipSupabase()) {
      return {
        success: true,
        data: [],
        message: 'Using fallback data - Supabase not configured'
      };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch users'
      };
    }
  }

  // Update user role
  async updateUserRole(userId: string, role: 'user' | 'admin'): Promise<ApiResponse<any>> {
    if (shouldSkipSupabase()) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: data,
        message: 'User role updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update user role'
      };
    }
  }

  // Delete user
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    if (shouldSkipSupabase()) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete user'
      };
    }
  }
}

export const adminService = new AdminService();
