import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import ProductCard from '../components/ProductCard';
import { Product } from '../contexts/CartContext';

const Favorites: React.FC = () => {
  const { language, t, isRTL } = useLanguage();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-olive-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto p-8">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'سجل دخول أولاً' : 'Please Login First'}
          </h1>
          <p className="text-gray-600 mb-6">
            {language === 'ar'
              ? 'تحتاج لتسجيل دخول لعرض المنتجات المفضلة لديك'
              : 'You need to login to view your favorite products'
            }
          </p>
          <Link to="/login">
            <Button className="bg-olive-600 hover:bg-olive-700">
              {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-olive-50 pt-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-md mx-auto p-8">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'ar' ? 'لا توجد مفضلة' : 'No Favorites Yet'}
            </h1>
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? 'ابدأ بإضافة المنتجات التي تعجبك للمفضلة'
                : 'Start adding products you love to your favorites'
              }
            </p>
            <Link to="/products">
              <Button className="bg-olive-600 hover:bg-olive-700">
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-olive-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'المفضلة' : 'My Favorites'}
            </h1>
          </div>
          <p className="text-gray-600">
            {language === 'ar' 
              ? `لديك ${favorites.length} منتج في المفضلة`
              : `You have ${favorites.length} products in favorites`
            }
          </p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard 
                product={product}
                onBuyNow={() => {/* Handle buy now */}}
              />
              
              {/* Remove from favorites button */}
              <button
                onClick={() => removeFromFavorites(product.id)}
                className="absolute top-2 left-2 z-10 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                title={language === 'ar' ? 'إزالة من المفضلة' : 'Remove from favorites'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => {
                favorites.forEach(product => addToCart(product));
              }}
              className="bg-olive-600 hover:bg-olive-700"
              disabled={favorites.length === 0}
            >
              <ShoppingCart className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'إضافة الكل للسلة' : 'Add All to Cart'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => window.location.href = '/products'}
              className="border-olive-600 text-olive-600 hover:bg-olive-50"
            >
              {language === 'ar' ? 'ت��فح المزيد' : 'Browse More Products'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
