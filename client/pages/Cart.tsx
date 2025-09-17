import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  X,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Trash2,
  Tag,
  Package,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { Button } from "../components/ui/button";
import { apiClient } from "../services/api";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import AuthModal from "../components/AuthModal";
import CheckoutModal from "../components/CheckoutModal";

const Cart: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, favorites } = useFavorites();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const finalTotal = totalPrice + (deliveryFee || 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleMoveToFavorites = (item: any) => {
    addToFavorites(item.product);
    removeFromCart(item.product.id);
  };

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.id === productId);
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setDeliveryLoading(true);
        const res = await apiClient.settings.getDeliveryFee();
        if (mounted && res && res.success && res.data) {
          setDeliveryFee(res.data.delivery_fee ?? 0);
        }
      } catch (err) {
        console.warn("Failed to load delivery fee", err);
      } finally {
        if (mounted) setDeliveryLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCheckout = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // Open checkout modal to collect name, phone, and address
    setCheckoutOpen(true);
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
              <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
              {language === "ar" ? "العودة للتسوق" : "Continue Shopping"}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === "ar" ? "سلة التسوق" : "Shopping Cart"}
            </h1>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-soft p-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {language === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
            </h3>
            <p className="text-gray-600 mb-8">
              {language === "ar"
                ? "ابدأ بإضافة بعض المنتجات الرائعة إلى سلتك"
                : "Start adding some great products to your cart"}
            </p>
            <Link to="/products">
              <Button size="lg" className="bg-olive-600 hover:bg-olive-700">
                <Package className="w-5 h-5 mr-2" />
                {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
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
          <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          {language === "ar" ? "العودة للتسوق" : "Continue Shopping"}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {language === "ar" ? "سلة التسوق" : "Shopping Cart"}
            </h1>
            <p className="text-gray-600 mt-1">
              {language === "ar"
                ? `${totalItems} منتج في السلة`
                : `${totalItems} item${totalItems !== 1 ? "s" : ""} in your cart`}
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {language === "ar" ? "مسح الكل" : "Clear Cart"}
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
                {language === "ar" ? "المنتجات" : "Items"}
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
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="p-2 hover:bg-gray-50 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.product.id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-16 text-center border-0 shadow-none"
                              min="1"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
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
                            {language === "ar" ? "للمفضلة" : "Save"}
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {(item.product.price * item.quantity).toFixed(2)}{" "}
                            {language === "ar" ? "د.أ" : "JD"}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              {item.product.price.toFixed(2)}{" "}
                              {language === "ar" ? "د.أ للقطعة" : "JD each"}
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
              {language === "ar" ? "ملخص الطلب" : "Order Summary"}
            </h2>

            <Separator className="my-4" />

            {/* Price Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>
                  {totalPrice.toFixed(2)} {language === "ar" ? "د.أ" : "JD"}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{language === "ar" ? "رسوم التوصيل" : "Delivery Fee"}</span>
                <span>
                  {deliveryLoading ? "..." : (deliveryFee || 0).toFixed(2)} {language === "ar" ? "د.أ" : "JD"}
                </span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
              <span>{language === "ar" ? "المجموع" : "Total"}</span>
              <span>
                {finalTotal.toFixed(2)} {language === "ar" ? "د.أ" : "JD"}
              </span>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-olive-600 hover:bg-olive-700 text-white py-3"
              size="lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              {language === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              {language === "ar"
                ? "الشحن والضرائب محسوبة عند الدفع"
                : "Shipping and taxes calculated at checkout"}
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

      {/* Checkout Modal (bilingual) */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        total={finalTotal}
        clearCart={clearCart}
        recipientPhone={"0799600750"}
      />
    </div>
  );
};

export default Cart;
