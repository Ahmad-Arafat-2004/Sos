import { supabase, shouldSkipSupabase } from '../lib/supabase';
import type { Order, OrderItem, ApiResponse } from '../../shared/types';

export class OrderService {
  // Create new order
  async createOrder(orderData: {
    user_id: string;
    customer_name: string;
    customer_email: string;
    shipping_address: any;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }): Promise<ApiResponse<Order>> {
    if (shouldSkipSupabase()) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      // Calculate items total
      const itemsTotal = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Fetch delivery fee from settings (if any)
      let deliveryFee = 0;
      try {
        const { data: setting } = await (async () => {
          const { data, error } = await supabase.from('settings').select('value').eq('key','delivery_fee').single();
          if (error) return { data: null } as any;
          return { data: data?.value } as any;
        })();
        if (setting !== null && setting !== undefined) {
          // setting can be a number or object like { amount: 2.5 }
          if (typeof setting === 'number') {
            deliveryFee = setting;
          } else if (typeof setting === 'object' && setting.amount) {
            deliveryFee = parseFloat(String(setting.amount)) || 0;
          } else {
            deliveryFee = parseFloat(String(setting)) || 0;
          }
        }
      } catch (e) {
        deliveryFee = 0;
      }

      const total = itemsTotal + deliveryFee;

      // Create order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          total: total,
          status: 'pending',
          shipping_address: orderData.shipping_address
        })
        .select()
        .single();

      if (orderError) {
        return {
          success: false,
          error: orderError.message
        };
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: orderResult.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { data: itemsResult, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select(`
          *,
          products(*)
        `);

      if (itemsError) {
        // Rollback order if items creation fails
        await supabase.from('orders').delete().eq('id', orderResult.id);
        return {
          success: false,
          error: itemsError.message
        };
      }

      // Transform to API format
      const order: Order = {
        id: orderResult.id,
        user_id: orderResult.user_id,
        customer_name: orderResult.customer_name,
        customer_email: orderResult.customer_email,
        total: orderResult.total,
        status: orderResult.status,
        shipping_address: orderResult.shipping_address,
        items: itemsResult?.map(item => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          product: item.products ? {
            id: item.products.id,
            name: {
              en: item.products.name_en,
              ar: item.products.name_ar
            },
            description: {
              en: item.products.description_en,
              ar: item.products.description_ar
            },
            price: item.products.price,
            image: item.products.image,
            category: item.products.category_id,
            weight: item.products.weight,
            origin: item.products.origin,
            store: item.products.store,
            created_at: item.products.created_at,
            updated_at: item.products.updated_at
          } : undefined
        })) || [],
        created_at: orderResult.created_at,
        updated_at: orderResult.updated_at
      };

      return {
        success: true,
        data: order,
        message: 'Order created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create order'
      };
    }
  }

  // Get orders for a user
  async getUserOrders(userId: string): Promise<ApiResponse<Order[]>> {
    if (shouldSkipSupabase()) {
      return {
        success: true,
        data: [],
        message: 'Using fallback data - Supabase not configured'
      };
    }

    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (ordersError) {
        return {
          success: false,
          error: ordersError.message
        };
      }

      const transformedOrders: Order[] = orders?.map(order => ({
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total: order.total,
        status: order.status,
        shipping_address: order.shipping_address,
        items: order.order_items?.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          product: item.products ? {
            id: item.products.id,
            name: {
              en: item.products.name_en,
              ar: item.products.name_ar
            },
            description: {
              en: item.products.description_en,
              ar: item.products.description_ar
            },
            price: item.products.price,
            image: item.products.image,
            category: item.products.category_id,
            weight: item.products.weight,
            origin: item.products.origin,
            store: item.products.store,
            created_at: item.products.created_at,
            updated_at: item.products.updated_at
          } : undefined
        })) || [],
        created_at: order.created_at,
        updated_at: order.updated_at
      })) || [];

      return {
        success: true,
        data: transformedOrders
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch orders'
      };
    }
  }

  // Get order by ID
  async getOrderById(orderId: string, userId?: string): Promise<ApiResponse<Order>> {
    if (shouldSkipSupabase()) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(*)
          )
        `)
        .eq('id', orderId);

      // If userId provided, filter by user (for user-specific access)
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: order, error } = await query.single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      const transformedOrder: Order = {
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total: order.total,
        status: order.status,
        shipping_address: order.shipping_address,
        items: order.order_items?.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          product: item.products ? {
            id: item.products.id,
            name: {
              en: item.products.name_en,
              ar: item.products.name_ar
            },
            description: {
              en: item.products.description_en,
              ar: item.products.description_ar
            },
            price: item.products.price,
            image: item.products.image,
            category: item.products.category_id,
            weight: item.products.weight,
            origin: item.products.origin,
            store: item.products.store,
            created_at: item.products.created_at,
            updated_at: item.products.updated_at
          } : undefined
        })) || [],
        created_at: order.created_at,
        updated_at: order.updated_at
      };

      return {
        success: true,
        data: transformedOrder
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch order'
      };
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(
    orderId: string, 
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<ApiResponse<Order>> {
    if (shouldSkipSupabase()) {
      return {
        success: false,
        error: 'Supabase not configured'
      };
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select(`
          *,
          order_items(
            *,
            products(*)
          )
        `)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      const transformedOrder: Order = {
        id: data.id,
        user_id: data.user_id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        total: data.total,
        status: data.status,
        shipping_address: data.shipping_address,
        items: data.order_items?.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          product: item.products ? {
            id: item.products.id,
            name: {
              en: item.products.name_en,
              ar: item.products.name_ar
            },
            description: {
              en: item.products.description_en,
              ar: item.products.description_ar
            },
            price: item.products.price,
            image: item.products.image,
            category: item.products.category_id,
            weight: item.products.weight,
            origin: item.products.origin,
            store: item.products.store,
            created_at: item.products.created_at,
            updated_at: item.products.updated_at
          } : undefined
        })) || [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return {
        success: true,
        data: transformedOrder,
        message: 'Order status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update order status'
      };
    }
  }

  // Get all orders (admin only)
  async getAllOrders(): Promise<ApiResponse<Order[]>> {
    if (shouldSkipSupabase()) {
      return {
        success: true,
        data: [],
        message: 'Using fallback data - Supabase not configured'
      };
    }

    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      const transformedOrders: Order[] = orders?.map(order => ({
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total: order.total,
        status: order.status,
        shipping_address: order.shipping_address,
        items: order.order_items?.map((item: any) => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          created_at: item.created_at,
          product: item.products ? {
            id: item.products.id,
            name: {
              en: item.products.name_en,
              ar: item.products.name_ar
            },
            description: {
              en: item.products.description_en,
              ar: item.products.description_ar
            },
            price: item.products.price,
            image: item.products.image,
            category: item.products.category_id,
            weight: item.products.weight,
            origin: item.products.origin,
            store: item.products.store,
            created_at: item.products.created_at,
            updated_at: item.products.updated_at
          } : undefined
        })) || [],
        created_at: order.created_at,
        updated_at: order.updated_at
      })) || [];

      return {
        success: true,
        data: transformedOrders
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch orders'
      };
    }
  }
}

export const orderService = new OrderService();
