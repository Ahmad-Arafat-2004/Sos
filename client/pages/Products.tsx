import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useStore } from "../contexts/StoreContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import ProductCard from "../components/ProductCard";
import AuthModal from "../components/AuthModal";
import { Product } from "../contexts/CartContext";
import { apiClient } from "../services/api";

const Products: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<
    { id: string; name: { en: string; ar: string }; slug: string }[]
  >([]);
  const { addToCart } = useCart();
  const { selectedStore } = useStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // إذا لم يتم اختيار متجر، وجه المستخدم لصفحة الاختيار
  useEffect(() => {
    if (!selectedStore) {
      navigate("/store-selection");
    }
  }, [selectedStore, navigate]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "category">("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const PER_PAGE = 20;
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // جلب البيانات من API (تعمل محل��ًا بدون DB) — الآن بتحميل صفحات
  useEffect(() => {
    // Reset pagination when store changes
    setProducts([]);
    setPage(0);
    setHasMore(true);

    const loadFirst = async () => {
      try {
        const prodRes = await apiClient.products.getAll(
          selectedStore || undefined,
          PER_PAGE,
          0,
        );
        if (prodRes.success && prodRes.data) {
          setProducts(prodRes.data as any);
          setHasMore((prodRes.data as any).length === PER_PAGE);
        } else {
          setProducts([]);
          setHasMore(false);
        }
        const catRes = await apiClient.categories.getAll();
        if (catRes.success && catRes.data) setCategories(catRes.data as any);
      } catch (e) {
        // ignore
        setProducts([]);
        setHasMore(false);
      }
    };

    loadFirst();
  }, [selectedStore]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextOffset = (page + 1) * PER_PAGE;
    try {
      const res = await apiClient.products.getAll(
        selectedStore || undefined,
        PER_PAGE,
        nextOffset,
      );
      if (res.success && res.data) {
        const newItems = res.data as Product[];
        setProducts((prev) => [...prev, ...newItems]);
        setPage((p) => p + 1);
        if (newItems.length < PER_PAGE) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // قراءة الفئة من URL parameters
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const validCategories = categories.map((cat) => cat.slug);
    if (categoryFromUrl && validCategories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams, categories]);

  // إنشاء قائمة الفئات الهرمية مع خيار "جميع المنتجات"
  const categoryOptions = [
    {
      value: "all",
      label: language === "ar" ? "جميع المنتجات" : "All Products",
    },
  ];

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name[language]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.category === selectedCategory ||
        categories.find(
          (cat) => cat.slug === selectedCategory && cat.id === product.category,
        );
      const matchesStore = !selectedStore || product.store === selectedStore;
      return matchesSearch && matchesCategory && matchesStore;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name[language].localeCompare(b.name[language]);
        case "price":
          return a.price - b.price;
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      {selectedStore && (
        <div className="mb-6">
          <button
            onClick={() => navigate("/store-selection")}
            className="flex items-center gap-2 text-gray-600 hover:text-olive-600 transition-colors duration-200 group"
          >
            <ArrowLeft
              className={`w-5 h-5 group-hover:transform ${isRTL ? "rotate-180 group-hover:translate-x-1" : "group-hover:-translate-x-1"} transition-all duration-200`}
            />
            <span className="font-medium">
              {language === "ar" ? "تغيير المتجر" : "Change Store"}
            </span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-gray-900">
            {language === "ar" ? "منتجات" : "Products"}
          </h1>
          {selectedStore && (
            <span
              className={`px-4 py-2 rounded-full text-lg font-semibold ${
                selectedStore === "irth-biladi"
                  ? "bg-olive-100 text-olive-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {selectedStore === "irth-biladi"
                ? language === "ar"
                  ? "إرث بلادي"
                  : "Irth Biladi"
                : "Cilka"}
            </span>
          )}
        </div>
        <p className="text-lg text-gray-600 max-w-2xl">
          {language === "ar"
            ? "اكتشف مجموعتنا الكاملة من الأطعمة التراثية الأصيلة من جميع أنحاء الشرق الأوسط"
            : "Discover our complete collection of authentic traditional foods from across the Middle East"}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search
                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? "right-3" : "left-3"}`}
              />
              <Input
                type="text"
                placeholder={
                  language === "ar"
                    ? "البحث في المنتجات..."
                    : "Search products..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} h-12`}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-white text-gray-900 focus:border-olive-400 focus:ring-olive-400"
            >
              <option value="all">
                {language === "ar" ? "جميع المنتجات" : "All Products"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name[language]}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "name" | "price" | "category")
              }
              className="w-full h-12 px-4 border border-gray-200 rounded-lg bg-white text-gray-900 focus:border-olive-400 focus:ring-olive-400"
            >
              <option value="name">
                {language === "ar" ? "ترتيب بالاسم" : "Sort by Name"}
              </option>
              <option value="price">
                {language === "ar" ? "ترتيب بالسعر" : "Sort by Price"}
              </option>
              <option value="category">
                {language === "ar" ? "ترتيب بالفئة" : "Sort by Category"}
              </option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {language === "ar" ? "فلاتر" : "Filters"}
            </Button>

            <span className="text-sm text-gray-600">
              {language === "ar"
                ? `${filteredProducts.length} منتج`
                : `${filteredProducts.length} products`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="p-2"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="p-2"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products Grid/List */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {language === "ar" ? "لم نجد أي منتجات" : "No products found"}
          </h3>
          <p className="text-gray-600">
            {language === "ar"
              ? "جرب تغيير معايير البحث أو الفلاتر"
              : "Try adjusting your search criteria or filters"}
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) =>
            viewMode === "grid" ? (
              <ProductCard
                key={product.id}
                product={product}
                onBuyNow={handleBuyNow}
                onAuthRequired={handleAuthRequired}
              />
            ) : (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-soft p-6"
              >
                <div className="flex gap-6">
                  <img
                    src={product.image}
                    alt={product.name[language]}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {product.name[language]}
                      </h3>
                      <span className="text-2xl font-bold text-olive-600">
                        {product.price.toFixed(2)}{" "}
                        {language === "ar" ? "د.أ" : "JD"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {product.weight && (
                          <span className="text-olive-600 text-sm font-medium">
                            {product.weight}
                          </span>
                        )}
                        {product.origin && (
                          <span className="bg-olive-100 text-olive-700 text-xs px-2 py-1 rounded-full">
                            {product.origin}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-olive-200 text-olive-700 hover:bg-olive-50"
                          onClick={() => addToCart(product)}
                        >
                          {t("product.addToCart")}
                        </Button>
                        <Button
                          size="sm"
                          className="bg-olive-600 hover:bg-olive-700"
                          onClick={() => handleBuyNow(product)}
                        >
                          {t("product.buyNow")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      )}

      {/* Load More Button */}
      {filteredProducts.length > 0 && (
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-olive-600 text-olive-600 hover:bg-olive-50"
          >
            {language === "ar" ? "تحميل المزيد" : "Load More"}
          </Button>
        </div>
      )}

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

export default Products;
