import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { ApiResponse } from '../services/api';

// Generic API hook
export function useApi<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      
      if (result.success) {
        setData(result.data || null);
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// Mutation hook for create/update/delete operations
export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(params);
      
      if (result.success) {
        return result.data || null;
      } else {
        setError(result.error || 'Unknown error');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  return {
    mutate,
    loading,
    error,
    clearError: () => setError(null),
  };
}

// Specific hooks for common operations

// Products hooks
export function useProducts(store?: string) {
  return useApi(() => apiClient.products.getAll(store), [store]);
}

export function useProduct(id: string) {
  return useApi(() => apiClient.products.getById(id), [id]);
}

export function useCreateProduct() {
  return useMutation(apiClient.products.create);
}

export function useUpdateProduct() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    apiClient.products.update(id, data)
  );
}

export function useDeleteProduct() {
  return useMutation((id: string) => apiClient.products.delete(id));
}

// Categories hooks
export function useCategories() {
  return useApi(() => apiClient.categories.getAll());
}

export function useCreateCategory() {
  return useMutation(apiClient.categories.create);
}

export function useUpdateCategory() {
  return useMutation(({ id, data }: { id: string; data: any }) => 
    apiClient.categories.update(id, data)
  );
}

export function useDeleteCategory() {
  return useMutation((id: string) => apiClient.categories.delete(id));
}

// Auth hooks
export function useLogin() {
  return useMutation(apiClient.auth.login);
}

export function useRegister() {
  return useMutation(apiClient.auth.register);
}

export function useProfile() {
  return useApi(() => apiClient.auth.getProfile());
}

// Orders hooks
export function useUserOrders() {
  return useApi(() => apiClient.orders.getUserOrders());
}

export function useCreateOrder() {
  return useMutation(apiClient.orders.create);
}

// Admin hooks
export function useAdminStats() {
  return useApi(() => apiClient.admin.getStats());
}

export function useAdminActivity(limit?: number) {
  return useApi(() => apiClient.admin.getActivity(limit), [limit]);
}

export function useAllOrders() {
  return useApi(() => apiClient.admin.getAllOrders());
}

export function useAllUsers() {
  return useApi(() => apiClient.admin.getAllUsers());
}

export function useUpdateOrderStatus() {
  return useMutation(({ id, status }: { id: string; status: string }) => 
    apiClient.admin.updateOrderStatus(id, status)
  );
}

export function useUpdateUserRole() {
  return useMutation(({ id, role }: { id: string; role: 'user' | 'admin' }) => 
    apiClient.admin.updateUserRole(id, role)
  );
}
