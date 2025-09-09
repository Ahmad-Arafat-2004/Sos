import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { User } from '../services/api';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  // signup now returns the raw ApiResponse so callers can show server errors
  signup: (email: string, password: string, name: string) => Promise<import('../../shared/types').ApiResponse<import('../../shared/types').AuthResponse>>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Check if we have a token
        const token = localStorage.getItem('auth_token');
        if (token) {
          apiClient.setToken(token);

          // Try to get user profile
          const result = await apiClient.auth.getProfile();
          if (result.success && result.data) {
            setUser(result.data);
          } else {
            // Token is invalid, clear it
            apiClient.setToken(null);
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        apiClient.setToken(null);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      const result = await apiClient.auth.login({ email, password });

      if (result.success && result.data) {
        const { user: userData, token } = result.data;

        // Set token and user
        apiClient.setToken(token);
        setUser(userData);

        showNotification(
          'تم تسجيل الدخول بنجاح! أهلاً وسهلاً بك',
          'success'
        );

        return true;
      } else {
        showNotification(
          result.error || 'خطأ في تسجيل الدخول',
          'error'
        );
        return false;
      }
    } catch (error) {
      showNotification(
        'حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى',
        'error'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<import('../../shared/types').ApiResponse<import('../../shared/types').AuthResponse>> => {
    try {
      setIsLoading(true);

      const result = await apiClient.auth.register({ email, password, name });

      if (result.success && result.data) {
        const { user: userData, token } = result.data;

        // Set token and user
        apiClient.setToken(token);
        setUser(userData);

        showNotification(
          'تم إنشاء الحساب بنجاح! مرحباً بك في موقعنا',
          'success'
        );
      } else {
        showNotification(
          result.error || 'خطأ في إنشاء الحساب',
          'error'
        );
      }

      return result;
    } catch (error) {
      showNotification(
        'حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى',
        'error'
      );
      return { success: false, error: error instanceof Error ? error.message : 'Network error' } as any;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Call logout API (mainly for server-side cleanup if needed)
      await apiClient.auth.logout();
    } catch (error) {
      console.error('Error during logout API call:', error);
    } finally {
      // Always clear local state regardless of API call result
      apiClient.setToken(null);
      setUser(null);
      // Remove any admin flags stored in localStorage
      try {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminEmail');
      } catch (e) {
        // ignore
      }
      showNotification(
        'تم تسجيل الخروج بنجاح',
        'success'
      );
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const result = await apiClient.auth.updateProfile(userData);
      
      if (result.success && result.data) {
        setUser(result.data);
        
        showNotification(
          'تم تحديث الملف الشخصي بنجاح',
          'success'
        );
        
        return true;
      } else {
        showNotification(
          result.error || 'خطأ في تحديث الملف الشخصي',
          'error'
        );
        return false;
      }
    } catch (error) {
      showNotification(
        'حدث خطأ في الاتصال. الرجاء المحاولة مرة أخرى',
        'error'
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh token if needed (optional enhancement)
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (user && apiClient.getToken()) {
        try {
          const result = await apiClient.auth.refreshToken();
          if (result.success && result.data) {
            apiClient.setToken(result.data.token);
            setUser(result.data.user);
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      }
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  const isAuthenticated = !!user && !!apiClient.getToken();

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
