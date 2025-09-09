import { Request, Response } from 'express';
import { adminService } from '../services/adminService';
import { z } from 'zod';

// Validation schemas
const updateUserRoleSchema = z.object({
  role: z.enum(['user', 'admin'])
});

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getDashboardStats();
    
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

// Get recent activity
export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await adminService.getRecentActivity(limit);
    
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

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await adminService.getAllUsers();
    
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

// Update user role
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = updateUserRoleSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const result = await adminService.updateUserRole(id, validation.data.role);
    
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

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    const result = await adminService.deleteUser(id);
    
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
