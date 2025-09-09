import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './CartContext';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (product: Product) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userFavorites, setUserFavorites] = useState<Record<string, Product[]>>({});
  const { user } = useAuth();

  const favorites = user ? (userFavorites[user.email] || []) : [];

  // تحميل المفضلة من localStorage عند بداية التطبيق
  useEffect(() => {
    const savedUserFavorites = localStorage.getItem('userFavorites');
    if (savedUserFavorites) {
      try {
        const parsedUserFavorites = JSON.parse(savedUserFavorites);
        setUserFavorites(parsedUserFavorites);
      } catch (error) {
        console.error('Error parsing user favorites from localStorage:', error);
      }
    }
  }, []);

  // حفظ المفضلة في localStorage عند التغيير
  useEffect(() => {
    localStorage.setItem('userFavorites', JSON.stringify(userFavorites));
  }, [userFavorites]);

  const addToFavorites = (product: Product) => {
    if (!user) return;

    setUserFavorites(prev => {
      const userEmail = user.email;
      const currentUserFavorites = prev[userEmail] || [];

      if (!currentUserFavorites.find(item => item.id === product.id)) {
        return {
          ...prev,
          [userEmail]: [...currentUserFavorites, product]
        };
      }
      return prev;
    });
  };

  const removeFromFavorites = (productId: string) => {
    if (!user) return;

    setUserFavorites(prev => {
      const userEmail = user.email;
      const currentUserFavorites = prev[userEmail] || [];

      return {
        ...prev,
        [userEmail]: currentUserFavorites.filter(item => item.id !== productId)
      };
    });
  };

  const isFavorite = (productId: string) => {
    if (!user) return false;
    return favorites.some(item => item.id === productId);
  };

  const toggleFavorite = (product: Product) => {
    if (!user) return;

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
