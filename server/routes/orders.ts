import { Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { z } from 'zod';

// Validation schemas
const createOrderSchema = z.object({
  customer_name: z.string().min(1, 'Customer name is required'),
  customer_email: z.string().email('Invalid email format'),
  shipping_address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    postal_code: z.string().optional(),
    phone: z.string().optional()
  }),
  items: z.array(z.object({
    product_id: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
    price: z.number().positive('Price must be positive')
  })).min(1, 'Order must contain at least one item')
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
});

// Create new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const validation = createOrderSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const orderData = {
      user_id: req.user.id,
      customer_name: validation.data.customer_name,
      customer_email: validation.data.customer_email,
      shipping_address: validation.data.shipping_address,
      items: validation.data.items
    };

    const result = await orderService.createOrder(orderData);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get user's orders
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const result = await orderService.getUserOrders(req.user.id);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const { id } = req.params;
    
    // Regular users can only see their own orders, admins can see all
    const userId = req.user.role === 'admin' ? undefined : req.user.id;
    const result = await orderService.getOrderById(id, userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get all orders (admin only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrders();
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = updateOrderStatusSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const result = await orderService.updateOrderStatus(id, validation.data.status);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
