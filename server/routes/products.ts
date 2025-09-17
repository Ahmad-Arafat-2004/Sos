import { Request, Response } from "express";
import { productService } from "../services/productService";
import { z } from "zod";

// Validation schemas
const createProductSchema = z.object({
  name: z.object({
    en: z.string().min(1, "English name is required"),
    ar: z.string().min(1, "Arabic name is required"),
  }),
  description: z
    .object({
      en: z.string().optional(),
      ar: z.string().optional(),
    })
    .optional(),
  price: z.number().positive("Price must be positive"),
  image: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  weight: z.string().optional(),
  origin: z.string().optional(),
  store: z.enum(["irth-biladi", "cilka"]),
});

const updateProductSchema = createProductSchema.partial();

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { store } = req.query;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : undefined;

    const result = await productService.getAllProducts(
      store as string | undefined,
      typeof limit === "number" && !Number.isNaN(limit) ? limit : undefined,
      typeof offset === "number" && !Number.isNaN(offset) ? offset : undefined,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await productService.getProductById(id);

    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Create new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const validation = createProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.error.errors,
      });
    }

    const result = await productService.createProduct(validation.data as any);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = updateProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: validation.error.errors,
      });
    }

    const result = await productService.updateProduct(
      id,
      validation.data as any,
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
