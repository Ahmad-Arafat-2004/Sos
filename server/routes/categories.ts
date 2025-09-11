import { Request, Response } from 'express';
import { productService } from '../services/productService';
import { z } from 'zod';

// Validation schemas
const createCategorySchema = z.object({
  name: z.object({
    en: z.string().min(1, 'English name is required'),
    ar: z.string().min(1, 'Arabic name is required')
  }),
  description: z.object({
    en: z.string().optional(),
    ar: z.string().optional()
  }).optional(),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
});

const updateCategorySchema = createCategorySchema.partial();

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const result = await productService.getAllCategories();
    
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

// Create new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const validation = createCategorySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const result = await productService.createCategory(validation.data as any);
    
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

// Update category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = updateCategorySchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.error.errors
      });
    }

    const result = await productService.updateCategory(id, validation.data as any);
    
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

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteCategory(id);
    
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
