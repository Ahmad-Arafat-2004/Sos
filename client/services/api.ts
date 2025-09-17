import type {
  ApiResponse,
  Product,
  Category,
  User,
  Order,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../../shared/types";

const API_BASE_URL = "/api";

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.token = localStorage.getItem("auth_token");
  }

  // Set authentication token
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  // Get authentication headers
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Build fetch options
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      let response: Response;
      try {
        response = await fetch(url, fetchOptions);
      } catch (fetchErr) {
        console.error("ApiClient.fetch.error", fetchErr, { url, fetchOptions });
        return {
          success: false,
          error:
            fetchErr instanceof Error
              ? fetchErr.message
              : "Network error: failed to reach API",
        };
      }

      // Safely read response body once and parse JSON if possible
      let text: string | null = null;
      let data: any = null;
      try {
        text = await response.text();
        try {
          data = text ? JSON.parse(text) : null;
        } catch (e) {
          data = null;
        }
      } catch (e) {
        console.warn("ApiClient.readBody.failed", e);
        data = null;
      }

      if (!response.ok) {
        let errMsg =
          data && data.error
            ? data.error
            : `HTTP ${response.status}: ${response.statusText}`;

        // If server provided validation details, include them
        try {
          if (data && Array.isArray(data.details)) {
            const detailMsgs = data.details
              .map((d: any) => (d && d.message ? d.message : JSON.stringify(d)))
              .filter(Boolean);
            if (detailMsgs.length)
              errMsg = `${errMsg}: ${detailMsgs.join("; ")}`;
          }
        } catch (e) {
          // ignore
        }

        return {
          success: false,
          error: errMsg,
        };
      }

      return data !== null ? data : { success: true, data: null };
    } catch (error) {
      console.error("ApiClient.request.unexpected", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown network error",
      };
    }
  }

  // Auth API methods
  auth = {
    register: async (
      userData: RegisterRequest,
    ): Promise<ApiResponse<AuthResponse>> => {
      return this.request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: this.getHeaders(false), // No auth needed for registration
      });
    },

    login: async (
      credentials: LoginRequest,
    ): Promise<ApiResponse<AuthResponse>> => {
      return this.request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: this.getHeaders(false), // No auth needed for login
      });
    },

    getProfile: async (): Promise<ApiResponse<User>> => {
      return this.request<User>("/auth/profile");
    },

    updateProfile: async (
      userData: Partial<User>,
    ): Promise<ApiResponse<User>> => {
      return this.request<User>("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(userData),
      });
    },

    refreshToken: async (): Promise<ApiResponse<AuthResponse>> => {
      return this.request<AuthResponse>("/auth/refresh", {
        method: "POST",
      });
    },

    logout: async (): Promise<ApiResponse<void>> => {
      const result = await this.request<void>("/auth/logout", {
        method: "POST",
      });

      // Clear token on logout
      this.setToken(null);
      return result;
    },
  };

  // Products API methods
  products = {
    getAll: async (
      store?: string,
      limit?: number,
      offset?: number,
    ): Promise<ApiResponse<Product[]>> => {
      const params: string[] = [];
      if (store) params.push(`store=${encodeURIComponent(store)}`);
      if (typeof limit === "number") params.push(`limit=${limit}`);
      if (typeof offset === "number") params.push(`offset=${offset}`);
      const query = params.length ? `?${params.join("&")}` : "";
      return this.request<Product[]>(`/products${query}`);
    },

    getById: async (id: string): Promise<ApiResponse<Product>> => {
      return this.request<Product>(`/products/${id}`);
    },

    create: async (
      productData: Omit<Product, "id" | "created_at" | "updated_at">,
    ): Promise<ApiResponse<Product>> => {
      return this.request<Product>("/products", {
        method: "POST",
        body: JSON.stringify(productData),
      });
    },

    update: async (
      id: string,
      productData: Partial<Product>,
    ): Promise<ApiResponse<Product>> => {
      return this.request<Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
      });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>(`/products/${id}`, {
        method: "DELETE",
      });
    },
  };

  // Categories API methods
  categories = {
    getAll: async (): Promise<ApiResponse<Category[]>> => {
      return this.request<Category[]>("/categories");
    },

    create: async (
      categoryData: Omit<Category, "id" | "created_at" | "updated_at">,
    ): Promise<ApiResponse<Category>> => {
      return this.request<Category>("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
      });
    },

    update: async (
      id: string,
      categoryData: Partial<Category>,
    ): Promise<ApiResponse<Category>> => {
      return this.request<Category>(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
      });
    },

    delete: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>(`/categories/${id}`, {
        method: "DELETE",
      });
    },
  };

  // Settings API methods
  settings = {
    getDeliveryFee: async (): Promise<
      ApiResponse<{ delivery_fee: number }>
    > => {
      return this.request<{ delivery_fee: number }>("/settings/delivery_fee");
    },

    updateDeliveryFee: async (
      amount: number,
    ): Promise<ApiResponse<{ delivery_fee: number }>> => {
      return this.request<{ delivery_fee: number }>("/settings/delivery_fee", {
        method: "PUT",
        body: JSON.stringify({ amount }),
      });
    },
  };

  // Orders API methods
  orders = {
    create: async (orderData: {
      customer_name: string;
      customer_email: string;
      shipping_address: any;
      items: Array<{
        product_id: string;
        quantity: number;
        price: number;
      }>;
    }): Promise<ApiResponse<Order>> => {
      return this.request<Order>("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
    },

    getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
      return this.request<Order[]>("/orders");
    },

    getById: async (id: string): Promise<ApiResponse<Order>> => {
      return this.request<Order>(`/orders/${id}`);
    },
  };

  // Admin API methods
  admin = {
    getStats: async (): Promise<ApiResponse<any>> => {
      return this.request<any>("/admin/stats");
    },

    getActivity: async (limit?: number): Promise<ApiResponse<any[]>> => {
      const query = limit ? `?limit=${limit}` : "";
      return this.request<any[]>(`/admin/activity${query}`);
    },

    getAllOrders: async (): Promise<ApiResponse<Order[]>> => {
      return this.request<Order[]>("/admin/orders");
    },

    updateOrderStatus: async (
      id: string,
      status: string,
    ): Promise<ApiResponse<Order>> => {
      return this.request<Order>(`/admin/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
    },

    getAllUsers: async (): Promise<ApiResponse<User[]>> => {
      return this.request<User[]>("/admin/users");
    },

    updateUserRole: async (
      id: string,
      role: "user" | "admin",
    ): Promise<ApiResponse<User>> => {
      return this.request<User>(`/admin/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      });
    },

    deleteUser: async (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>(`/admin/users/${id}`, {
        method: "DELETE",
      });
    },
  };

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export types for convenience
export type {
  ApiResponse,
  Product,
  Category,
  User,
  Order,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
};
