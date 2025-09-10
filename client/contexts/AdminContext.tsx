import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../services/api";
import type { Product, Category, Order, User } from "../services/api";
import { useNotification } from "./NotificationContext";
import { useAuth } from "./AuthContext";

interface AdminStats {
  users: {
    total: number;
    new_this_month: number;
    admins: number;
  };
  products: {
    total: number;
    by_store: {
      "irth-biladi": number;
      cilka: number;
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

interface AdminContextType {
  // Data
  products: Product[];
  orders: Order[];
  categories: Category[];
  users: User[];
  stats: AdminStats | null;

  // Loading states
  loading: boolean;
  productsLoading: boolean;
  ordersLoading: boolean;
  categoriesLoading: boolean;

  // Product methods
  addProduct: (
    product: Omit<Product, "id" | "created_at" | "updated_at">,
  ) => Promise<Product | null>;
  updateProduct: (
    id: string,
    product: Partial<Product>,
  ) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;

  // Category methods
  addCategory: (
    category: Omit<Category, "id" | "created_at" | "updated_at">,
  ) => Promise<Category | null>;
  updateCategory: (
    id: string,
    category: Partial<Category>,
  ) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<void>;

  // Order methods
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;

  // User management
  updateUserRole: (userId: string, role: "user" | "admin") => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // Data refresh methods
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const { showNotification } = useNotification();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Refresh products
  const refreshProducts = async () => {
    if (!isAdmin) return;

    try {
      setProductsLoading(true);
      const result = await apiClient.products.getAll();
      if (result.success && result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Refresh orders
  const refreshOrders = async () => {
    if (!isAdmin) return;

    try {
      setOrdersLoading(true);
      const result = await apiClient.admin.getAllOrders();
      if (result.success && result.data) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Refresh categories (fetch even if user is not admin)
  const refreshCategories = async () => {
    try {
      setCategoriesLoading(true);
      const result = await apiClient.categories.getAll();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Refresh users
  const refreshUsers = async () => {
    if (!isAdmin) return;

    try {
      const result = await apiClient.admin.getAllUsers();
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Refresh stats
  const refreshStats = async () => {
    if (!isAdmin) return;

    try {
      const result = await apiClient.admin.getStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Load initial data when user becomes admin
  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      Promise.all([
        refreshProducts(),
        refreshOrders(),
        refreshCategories(),
        refreshUsers(),
        refreshStats(),
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [isAdmin]);

  // Always load categories so forms work even if admin auth isn't set yet
  React.useEffect(() => {
    refreshCategories();
  }, []);

  // Product methods
  const addProduct = async (
    productData: Omit<Product, "id" | "created_at" | "updated_at">,
  ): Promise<Product | null> => {
    try {
      // Ensure category is a real category id (handle cases where a slug may be sent)
      const payload: any = { ...productData };
      if (payload.category) {
        const found = categories.find(
          (c) => c.id === payload.category || c.slug === payload.category,
        );
        if (found) payload.category = found.id;
      }

      const result = await apiClient.products.create(payload);
      if (result.success && result.data) {
        setProducts((prev) => [...prev, result.data!]);
        showNotification("تم إضافة المنتج بنجاح!", "success");
        await refreshStats(); // Update stats
        return result.data;
      } else {
        showNotification(result.error || "خطأ في إضافة المنتج", "error");
        return null;
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
      return null;
    }
  };

  const updateProduct = async (
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> => {
    try {
      const payload: any = { ...productData };
      if (payload.category) {
        const found = categories.find(
          (c) => c.id === payload.category || c.slug === payload.category,
        );
        if (found) payload.category = found.id;
      }

      const result = await apiClient.products.update(id, payload);
      if (result.success && result.data) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? result.data! : p)),
        );
        showNotification("تم تحديث المنتج بنجاح!", "success");
        return result.data;
      } else {
        showNotification(result.error || "خطأ في تحديث المنتج", "error");
        return null;
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
      return null;
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const result = await apiClient.products.delete(id);
      if (result.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showNotification("تم حذف المنتج بنجاح!", "success");
        await refreshStats(); // Update stats
      } else {
        showNotification(result.error || "خطأ في حذف المنتج", "error");
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
    }
  };

  // Category methods
  const addCategory = async (
    categoryData: Omit<Category, "id" | "created_at" | "updated_at">,
  ): Promise<Category | null> => {
    try {
      const result = await apiClient.categories.create(categoryData);
      if (result.success && result.data) {
        setCategories((prev) => [...prev, result.data!]);
        showNotification("تم إضافة الفئة بنجاح!", "success");
        await refreshStats(); // Update stats
        return result.data;
      } else {
        showNotification(result.error || "خطأ في إضافة الفئة", "error");
        return null;
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
      return null;
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: Partial<Category>,
  ): Promise<Category | null> => {
    try {
      const result = await apiClient.categories.update(id, categoryData);
      if (result.success && result.data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? result.data! : c)),
        );
        showNotification("تم تحديث الفئة بنجاح!", "success");
        return result.data;
      } else {
        showNotification(result.error || "��طأ في تحديث الفئة", "error");
        return null;
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
      return null;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      const result = await apiClient.categories.delete(id);
      if (result.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showNotification("تم حذف الفئة بنجاح!", "success");
        await refreshStats(); // Update stats
      } else {
        const err = result.error || "خطأ في حذف الفئة";
        console.warn("deleteCategory.failed", { id, err });
        showNotification(err, "error");
      }
    } catch (error) {
      console.error("deleteCategory.exception", error);
      const msg =
        error instanceof Error
          ? error.message
          : "خطأ في الاتصال. ��لرجاء المحاولة مرة أخرى";
      showNotification(msg, "error");
    }
  };

  // Order methods
  const updateOrderStatus = async (
    orderId: string,
    status: string,
  ): Promise<void> => {
    try {
      const result = await apiClient.admin.updateOrderStatus(orderId, status);
      if (result.success && result.data) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? result.data! : o)),
        );
        showNotification("تم تحديث حالة الطلب بنجاح!", "success");
        await refreshStats(); // Update stats
      } else {
        showNotification(result.error || "خطأ في تحديث حالة الطلب", "error");
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
    }
  };

  // User management methods
  const updateUserRole = async (
    userId: string,
    role: "user" | "admin",
  ): Promise<void> => {
    try {
      const result = await apiClient.admin.updateUserRole(userId, role);
      if (result.success && result.data) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? result.data! : u)),
        );
        showNotification("تم تحديث دور المستخدم بنجاح!", "success");
        await refreshStats(); // Update stats
      } else {
        showNotification(result.error || "خطأ في تحديث دور المستخدم", "error");
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
    }
  };

  const deleteUser = async (userId: string): Promise<void> => {
    try {
      const result = await apiClient.admin.deleteUser(userId);
      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        showNotification("تم حذف المستخدم بنجاح!", "success");
        await refreshStats(); // Update stats
      } else {
        showNotification(result.error || "خطأ في حذف المستخدم", "error");
      }
    } catch (error) {
      showNotification("خطأ في الاتصال. الرجاء المحاولة مرة أخرى", "error");
    }
  };

  return (
    <AdminContext.Provider
      value={{
        // Data
        products,
        orders,
        categories,
        users,
        stats,

        // Loading states
        loading,
        productsLoading,
        ordersLoading,
        categoriesLoading,

        // Product methods
        addProduct,
        updateProduct,
        deleteProduct,

        // Category methods
        addCategory,
        updateCategory,
        deleteCategory,

        // Order methods
        updateOrderStatus,

        // User management
        updateUserRole,
        deleteUser,

        // Refresh methods
        refreshProducts,
        refreshOrders,
        refreshCategories,
        refreshUsers,
        refreshStats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

// Export types for convenience
export type { Category, Product, Order, User };
