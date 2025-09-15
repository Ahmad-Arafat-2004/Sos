import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, Clock } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import ProductCard from "../components/ProductCard";
import AuthModal from "../components/AuthModal";
import { useAdmin } from "../contexts/AdminContext";
import { Product } from "../contexts/CartContext";

const categories = [
  {
    key: "milk",
    image: "photo/4.jpg",
    color: "from-blue-500 to-blue-600",
  },
  {
    key: "spices",
    image: "photo/2.jpg",
    color: "from-orange-500 to-red-500",
  },
  {
    key: "pickles",
    // restore pickles to local milk-like image
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fe12438f47c744e98a4d75a71611dd8bf%2F3e513131b4664bc8bf59880c463bb08c?format=webp&width=800",
    color: "from-green-600 to-olive-600",
  },
  {
    key: "cleaning",
    // use the uploaded WhatsApp image for Cleaning Supplies
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fe12438f47c744e98a4d75a71611dd8bf%2F3f8f7290819244ebaa41e0d8b30b2062?format=webp&width=800",
    color: "from-green-500 to-olive-600",
  },
];

const features = [
  {
    icon: Truck,
    titleKey: "Fresh Delivery",
    descKey: "Fast and reliable delivery service",
  },
  {
    icon: Shield,
    titleKey: "Premium Quality",
    descKey: "Authentic products from trusted sources",
  },
  {
    icon: Clock,
    titleKey: "Fast Service",
    descKey: "Same day delivery in most areas",
  },
];

const Index: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const { products: adminProducts } = useAdmin();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // fallback to local static products when admin API doesn't provide products
  const fallbackProducts = React.useMemo(() => {
    try {
      // lazy import to avoid module cycles
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const p = require("../data/products");
      return p.getFeaturedProducts();
    } catch (e) {
      return [] as Product[];
    }
  }, []);
  const productsSource = (adminProducts && adminProducts.length > 0) ? adminProducts : fallbackProducts;

  const chunkSize = 3; // number of products to show at once
  const storageKey = "featuredIndex";
  const [featuredIndex, setFeaturedIndex] = React.useState(0);

  // restore index from localStorage on mount
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = parseInt(raw, 10);
        if (!Number.isNaN(parsed)) setFeaturedIndex(parsed);
      }
    } catch (e) {
      // ignore (e.g., SSR)
    }
  }, []);

  // persist index to localStorage when it changes
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, String(featuredIndex));
    } catch (e) {}
  }, [featuredIndex]);

  // rotate featured products every 10 seconds
  React.useEffect(() => {
    if (!productsSource || productsSource.length <= chunkSize) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + chunkSize) % productsSource.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [productsSource]);

  const featuredProducts = React.useMemo(() => {
    if (!products) return [];
    if (products.length <= chunkSize) return products.slice(0, chunkSize);

    // ensure featuredIndex is within bounds
    const safeIndex = Math.max(0, Math.min(featuredIndex, Math.max(0, products.length - 1)));

    // slice from featuredIndex wrapping around
    const end = safeIndex + chunkSize;
    if (end <= products.length) return products.slice(safeIndex, end);

    // wrap
    return products
      .slice(safeIndex, products.length)
      .concat(products.slice(0, end % products.length));
  }, [products, featuredIndex]);

  const handleBuyNow = (product: Product) => {
    if (!user) {
      setSelectedProduct(product);
      setAuthModalOpen(true);
    } else {
      // Proceed to checkout
      console.log("Proceed to checkout with product:", product);
    }
  };

  const handleAuthRequired = () => {
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    if (selectedProduct) {
      // Add to cart after successful auth
      console.log("Add product to cart after auth:", selectedProduct);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-olive-50 to-olive-100 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {t("hero.title")}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {t("hero.subtitle")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/store-selection">
                  <Button
                    size="lg"
                    className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-4 text-lg w-full sm:w-auto"
                  >
                    {t("hero.cta")}
                    <ArrowRight
                      className={`w-5 h-5 ${isRTL ? "rotate-180 mr-2" : "ml-2"}`}
                    />
                  </Button>
                </Link>
                <Link to="/store-selection">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-olive-600 text-olive-600 hover:bg-olive-50 px-8 py-4 text-lg w-full sm:w-auto"
                  >
                    {language === "ar" ? "استكشف المنتجات" : "Explore Products"}
                  </Button>
                </Link>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                  >
                    <div className="w-10 h-10 bg-olive-600 rounded-full flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {feature.titleKey}
                      </h3>
                      <p className="text-gray-600 text-xs">{feature.descKey}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-soft-lg">
                <img
                  src="photo\1.jpg"
                  alt="Traditional Middle Eastern Foods"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -start-6 bg-white rounded-2xl shadow-soft-lg p-4 max-w-xs">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex -space-x-1 rtl:space-x-reverse">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 bg-olive-600 rounded-full border-2 border-white"
                      ></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {language === "ar"
                        ? "1000+ عميل راضٍ"
                        : "1000+ Happy Customers"}
                    </p>
                    <div className="flex items-center space-x-1 rtl:space-x-reverse">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-xs text-gray-600">4.9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("categories.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "ar"
                ? "اكتشف مجموعتنا المختارة بعناية من الأطعمة التراثية الأصيلة"
                : "Discover our carefully curated selection of authentic traditional foods"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.key}
                to={`/store-selection`}
                className="group relative overflow-hidden rounded-2xl aspect-square shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={t(`categories.${category.key}`)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-black text-xl font-bold text-center px-4">
                    {category.key === "milk" &&
                      (language === "ar"
                        ? "منتجات الألبان"
                        : "Milks and cheese")}
                    {category.key === "spices" &&
                      (language === "ar"
                        ? "البهارات والأعشاب"
                        : "Spices & Herbs")}
                    {category.key === "pickles" &&
                      (language === "ar" ? "مخللات" : "Pickles")}
                    {category.key === "cleaning" &&
                      (language === "ar"
                        ? "مواد التنظيف"
                        : "Cleaning Supplies")}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-olive-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t("featured.title")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {language === "ar"
                ? "منتجاتنا الأكثر شعبية وطلباً من عملائنا"
                : "Our most popular and sought-after products by our customers"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyNow={handleBuyNow}
                onAuthRequired={handleAuthRequired}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/store-selection">
              <Button
                variant="outline"
                size="lg"
                className="border-olive-600 text-olive-600 hover:bg-olive-50"
              >
                {language === "ar" ? "عرض جميع المنتجات" : "View All Products"}
                <ArrowRight
                  className={`w-5 h-5 ${isRTL ? "rotate-180 mr-2" : "ml-2"}`}
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-olive-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              {language === "ar" ? "ابق على اطلاع" : "Stay Updated"}
            </h2>
            <p className="text-olive-100 mb-8">
              {language === "ar"
                ? "اشترك في نشرتنا البريدية لتحصل على أحدث العروض والمنتجات الجديدة"
                : "Subscribe to our newsletter for the latest offers and new products"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={
                  language === "ar" ? "بريدك الإلكتروني" : "Your email address"
                }
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <Button className="bg-white text-olive-600 hover:bg-olive-50 px-6 py-3 mt-1">
                {language === "ar" ? "اشتراك" : "Subscribe"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setSelectedProduct(null);
        }}
        initialTab="login"
      />
    </div>
  );
};

export default Index;
