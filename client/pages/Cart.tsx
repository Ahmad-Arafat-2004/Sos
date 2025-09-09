import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Heart, Trash2, Tag, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import AuthModal from '../components/AuthModal';

const Cart: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const navigate = useNavigate();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.1; // 10% tax
  const finalTotal = totalPrice + shipping + tax - discount;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleMoveToFavorites = (item: any) => {
    addToFavorites(item.product);
    removeFromCart(item.product.id);
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  const handleCheckout = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // Navigate to checkout page (to be implemented)
    navigate('/checkout');
  };

  const applyPromoCode = () => {
    const promoCodes: { [key: string]: number } = {
      'WELCOME10': 0.1, // 10% discount
      'SAVE5': 5,        // 5 JD off
      'FIRST20': 0.2     // 20% discount
    };

    const discountRate = promoCodes[promoCode.toUpperCase()];
    if (discountRate) {
      const discountAmount = discountRate < 1 
        ? totalPrice * discountRate 
        : discountRate;
      setDiscount(discountAmount);
      alert(language === 'ar' 
        ? 'تم تطبيق كود الخصم بنجاح!' 
        : 'Promo code applied successfully!'
      );
    } else {
      alert(language === 'ar' 
        ? 'كود الخصم غير صحيح' 
        : 'Invalid promo code'
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-olive-600 hover:text-olive-700 transition-colors mb-4"
            >
              <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              {language === 'ar' ? 'العودة للتسوق' : 'Continue Shopping'}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
            </h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-soft p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'سلة التسوق فارغة' : 'Your cart is empty'}
            </h3>
            <p className="text-gray-600 mb-8">
              {language === 'ar' 
                ? 'ابدأ بإضافة بعض المنتجات الرائعة إلى سلتك'
                : 'Start adding some great products to your cart'
              }
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-olive-600 hover:bg-olive-700">
                <Package className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'تصفح المنتجات' : 'Browse Products'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 text-olive-600 hover:text-olive-700 transition-colors mb-4"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {language === 'ar' ? 'العودة للتسوق' : 'Continue Shopping'}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === 'ar' ? 'سلة التسوق' : 'Shopping Cart'}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === 'ar' 
                ? `${totalItems} منتج في السلة` 
                : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`
              }
            </p>
          </div>
          {items.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {language === 'ar' ? 'مسح الكل' : 'Clear Cart'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {language === 'ar' ? 'المنتجات' : 'Items'}
              </h2>
            </div>
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.product.id} className="p-6">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name[language]}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {item.product.name[language]}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                            {item.product.description[language]}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            {item.product.weight && (
                              <span className="text-sm text-olive-600 font-medium">
                                {item.product.weight}
                              </span>
                            )}
                            {item.product.origin && (
                              <span className="text-xs bg-olive-100 text-olive-700 px-2 py-1 rounded-full">
                                {item.product.origin}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value) || 1)}
                              className="w-16 text-center border-0 shadow-none"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Move to Favorites */}
                          <button
                            onClick={() => handleMoveToFavorites(item)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-olive-600 transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            {language === 'ar' ? 'للمفضلة' : 'Save'}
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {(item.product.price * item.quantity).toFixed(2)} {language === 'ar' ? 'د.أ' : 'JD'}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              {item.product.price.toFixed(2)} {language === 'ar' ? 'د.أ للقطعة' : 'JD each'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'كود الخصم' : 'Promo Code'}
              </label>
              <div className="flex gap-2">
                <Input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل الكود' : 'Enter code'}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim()}
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{totalPrice.toFixed(2)} {language === 'ar' ? 'د.أ' : 'JD'}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">
                      {language === 'ar' ? 'مجاني' : 'Free'}
                    </span>
                  ) : (
                    `${shipping.toFixed(2)} ${language === 'ar' ? 'د.أ' : 'JD'}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                <span>{tax.toFixed(2)} {language === 'ar' ? 'د.أ' : 'JD'}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                  <span>-{discount.toFixed(2)} {language === 'ar' ? 'د.أ' : 'JD'}</span>
                </div>
              )}

              {totalPrice < 50 && (
                <div className="bg-olive-50 border border-olive-200 rounded-lg p-3">
                  <p className="text-sm text-olive-700">
                    {language === 'ar'
                      ? `أضف ${(50 - totalPrice).toFixed(2)} د.أ للحصول على شحن مجاني`
                      : `Add ${(50 - totalPrice).toFixed(2)} JD for free shipping`
                    }
                  </p>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
              <span>{language === 'ar' ? 'المجموع' : 'Total'}</span>
              <span>{finalTotal.toFixed(2)} {language === 'ar' ? 'د.أ' : 'JD'}</span>
            </div>

            <Button 
              onClick={handleCheckout}
              className="w-full bg-olive-600 hover:bg-olive-700 text-white py-3"
              size="lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {language === 'ar' ? 'إتمام الطلب' : 'Proceed to Checkout'}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              {language === 'ar' 
                ? 'الشحن والضرائب محسوبة عند الدفع'
                : 'Shipping and taxes calculated at checkout'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
      />
    </div>
  );
};

export default Cart;
