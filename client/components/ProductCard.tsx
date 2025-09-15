import React from "react";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { Product } from "../contexts/CartContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { useAdmin } from "../contexts/AdminContext";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useToast } from "../hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onBuyNow?: (product: Product) => void;
  onAuthRequired?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuyNow,
  onAuthRequired,
}) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { categories = [] } = useAdmin();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  const handleFavoriteClick = () => {
    if (!user) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }
    toggleFavorite(product);
  };

  return (
    <div className="bg-white rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name[language]}
          loading="lazy"
          onError={(e) => {
            try {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            } catch (err) {
              // ignore
            }
          }}
          className="w-full h-36 object-cover object-center scale-100 group-hover:scale-103 transform transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 end-3 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110",
            isFavorite(product.id)
              ? "bg-red-500 opacity-100"
              : "bg-white/80 opacity-0 group-hover:opacity-100 hover:bg-white",
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors duration-200",
              isFavorite(product.id)
                ? "text-white fill-white"
                : "text-gray-600 hover:text-red-500",
            )}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {product.name[language]}
          </h3>
        </div>

        {/* Weight */}
        {product.weight && (
          <div className="text-olive-600 text-sm font-medium mb-3">
            {product.weight}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-olive-800">
            {product.price.toFixed(2)} {language === "ar" ? "د.أ" : "JD"}
          </div>

          {/* Category Badge */}
          <span className="bg-olive-100 text-olive-700 text-xs px-2 py-1 rounded-full capitalize">
            {categories.find(
              (c) => c.id === product.category || c.slug === product.category,
            )?.name?.[language] ?? String(product.category || "-")}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 border-olive-200 text-olive-700 hover:bg-olive-50 hover:border-olive-300"
          >
            <ShoppingCart className="w-4 h-4 me-2" />
            {t("product.addToCart")}
          </Button>

          <Button
            onClick={handleBuyNow}
            className="flex-1 bg-olive-600 hover:bg-olive-700"
          >
            {t("product.buyNow")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
