import { supabase, shouldSkipSupabase } from "../lib/supabase";
import type { Product, Category, ApiResponse } from "../../shared/types";
import { localStore } from "../lib/local-store";

export class ProductService {
  // Get all products
  async getAllProducts(store?: string): Promise<ApiResponse<Product[]>> {
    if (shouldSkipSupabase()) {
      const all = localStore.getProducts();
      const filtered = store ? all.filter((p) => p.store === store) : all;
      return { success: true, data: filtered };
    }

    try {
      let query = supabase.from("products").select(`
          *,
          categories(*)
        `);

      if (store) {
        query = query.eq("store", store);
      }

      const { data, error } = await query;

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      // Transform database format to API format
      const products: Product[] =
        data?.map((product) => ({
          id: product.id,
          name: {
            en: product.name_en,
            ar: product.name_ar,
          },
          description: {
            en: product.description_en,
            ar: product.description_ar,
          },
          price: product.price,
          image: product.image,
          category: product.category_id,
          weight: product.weight,
          origin: product.origin,
          store: product.store,
          created_at: product.created_at,
          updated_at: product.updated_at,
        })) || [];

      return {
        success: true,
        data: products,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch products",
      };
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<ApiResponse<Product>> {
    if (shouldSkipSupabase()) {
      const prod = localStore.getProducts().find((p) => p.id === id);
      return prod
        ? { success: true, data: prod }
        : { success: false, error: "Not found" };
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          categories(*)
        `,
        )
        .eq("id", id)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const product: Product = {
        id: data.id,
        name: {
          en: data.name_en,
          ar: data.name_ar,
        },
        description: {
          en: data.description_en,
          ar: data.description_ar,
        },
        price: data.price,
        image: data.image,
        category: data.category_id,
        weight: data.weight,
        origin: data.origin,
        store: data.store,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: product,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch product",
      };
    }
  }

  // Create new product
  async createProduct(
    productData: Omit<Product, "id" | "created_at" | "updated_at">,
  ): Promise<ApiResponse<Product>> {
    if (shouldSkipSupabase()) {
      const created = localStore.addProduct(productData);
      return {
        success: true,
        data: created,
        message: "Product created successfully",
      };
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .insert({
          name_en: productData.name.en,
          name_ar: productData.name.ar,
          description_en: productData.description.en,
          description_ar: productData.description.ar,
          price: productData.price,
          image: productData.image,
          category_id: productData.category,
          weight: productData.weight,
          origin: productData.origin,
          store: productData.store,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const product: Product = {
        id: data.id,
        name: {
          en: data.name_en,
          ar: data.name_ar,
        },
        description: {
          en: data.description_en,
          ar: data.description_ar,
        },
        price: data.price,
        image: data.image,
        category: data.category_id,
        weight: data.weight,
        origin: data.origin,
        store: data.store,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: product,
        message: "Product created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create product",
      };
    }
  }

  // Update product
  async updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Promise<ApiResponse<Product>> {
    if (shouldSkipSupabase()) {
      const updated = localStore.updateProduct(id, productData);
      return updated
        ? {
            success: true,
            data: updated,
            message: "Product updated successfully",
          }
        : { success: false, error: "Not found" };
    }

    try {
      const updateData: any = {};

      if (productData.name) {
        updateData.name_en = productData.name.en;
        updateData.name_ar = productData.name.ar;
      }
      if (productData.description) {
        updateData.description_en = productData.description.en;
        updateData.description_ar = productData.description.ar;
      }
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.image !== undefined) updateData.image = productData.image;
      if (productData.category) updateData.category_id = productData.category;
      if (productData.weight !== undefined)
        updateData.weight = productData.weight;
      if (productData.origin !== undefined)
        updateData.origin = productData.origin;
      if (productData.store) updateData.store = productData.store;

      const { data, error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const product: Product = {
        id: data.id,
        name: {
          en: data.name_en,
          ar: data.name_ar,
        },
        description: {
          en: data.description_en,
          ar: data.description_ar,
        },
        price: data.price,
        image: data.image,
        category: data.category_id,
        weight: data.weight,
        origin: data.origin,
        store: data.store,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: product,
        message: "Product updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update product",
      };
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    if (shouldSkipSupabase()) {
      const ok = localStore.deleteProduct(id);
      return ok
        ? ({ success: true, message: "Product deleted successfully" } as any)
        : { success: false, error: "Not found" };
    }

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Product deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete product",
      };
    }
  }

  // Get all categories
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    if (shouldSkipSupabase()) {
      return { success: true, data: localStore.getCategories() };
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_en");

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const categories: Category[] =
        data?.map((category) => ({
          id: category.id,
          name: {
            en: category.name_en,
            ar: category.name_ar,
          },
          description: {
            en: category.description_en,
            ar: category.description_ar,
          },
          slug: category.slug,
          created_at: category.created_at,
          updated_at: category.updated_at,
        })) || [];

      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch categories",
      };
    }
  }

  // Create new category
  async createCategory(
    categoryData: Omit<Category, "id" | "created_at" | "updated_at">,
  ): Promise<ApiResponse<Category>> {
    if (shouldSkipSupabase()) {
      const created = localStore.addCategory(categoryData);
      return {
        success: true,
        data: created,
        message: "Category created successfully",
      };
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert({
          name_en: categoryData.name.en,
          name_ar: categoryData.name.ar,
          description_en: categoryData.description?.en || null,
          description_ar: categoryData.description?.ar || null,
          slug: categoryData.slug,
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const category: Category = {
        id: data.id,
        name: {
          en: data.name_en,
          ar: data.name_ar,
        },
        description: {
          en: data.description_en,
          ar: data.description_ar,
        },
        slug: data.slug,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: category,
        message: "Category created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create category",
      };
    }
  }

  // Update category
  async updateCategory(
    id: string,
    categoryData: Partial<Category>,
  ): Promise<ApiResponse<Category>> {
    if (shouldSkipSupabase()) {
      const updated = localStore.updateCategory(id, categoryData as any);
      return updated
        ? {
            success: true,
            data: updated,
            message: "Category updated successfully",
          }
        : { success: false, error: "Not found" };
    }

    try {
      const updateData: any = {};

      if (categoryData.name) {
        updateData.name_en = categoryData.name.en;
        updateData.name_ar = categoryData.name.ar;
      }
      if (categoryData.description) {
        updateData.description_en = categoryData.description.en;
        updateData.description_ar = categoryData.description.ar;
      }
      if (categoryData.slug) updateData.slug = categoryData.slug;

      const { data, error } = await supabase
        .from("categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      const category: Category = {
        id: data.id,
        name: {
          en: data.name_en,
          ar: data.name_ar,
        },
        description: {
          en: data.description_en,
          ar: data.description_ar,
        },
        slug: data.slug,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return {
        success: true,
        data: category,
        message: "Category updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update category",
      };
    }
  }

  // Delete category
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    if (shouldSkipSupabase()) {
      const ok = localStore.deleteCategory(id);
      return ok
        ? ({ success: true, message: "Category deleted successfully" } as any)
        : { success: false, error: "Not found" };
    }

    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        message: "Category deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete category",
      };
    }
  }
}

export const productService = new ProductService();
