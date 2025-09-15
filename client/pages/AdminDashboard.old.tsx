import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  BarChart3,
  LogOut,
  Shield,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAdmin } from "../contexts/AdminContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Product } from "../contexts/CartContext";

const AdminDashboard: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const {
    products: rawProducts,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    getProductStats,
  } = useAdmin();

  // فلترة شاملة للمنتجات لضمان عدم وجود null أو undefined
  const products = React.useMemo(() => {
    if (!Array.isArray(rawProducts)) return [];
    return rawProducts.filter(
      (product) =>
        product &&
        typeof product === "object" &&
        product.id &&
        product.name &&
        product.name.en &&
        product.name.ar &&
        product.store &&
        typeof product.price === "number",
    );
  }, [rawProducts]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "orders"
  >("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    price: 0,
    image: "",
    category: "dairy",
    weight: "",
    origin: "",
    store: "irth-biladi",
  });

  const stats = getProductStats();

  // تنظيف editingProduct إذا كان فاسد
  React.useEffect(() => {
    if (
      editingProduct &&
      (!editingProduct.store || !editingProduct.name || !editingProduct.id)
    ) {
      setEditingProduct(null);
    }
  }, [editingProduct]);

  // إذا كانت البيانات لا تزال تُحمل أو فاسدة، عرض loading
  if (!Array.isArray(rawProducts)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-olive-600"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من تسجيل الخروج؟"
          : "Are you sure you want to logout?",
      )
    ) {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("adminEmail");
      navigate("/login");
    }
  };

  const handleAddProduct = () => {
    try {
      if (newProduct.name.en && newProduct.name.ar && newProduct.price > 0) {
        addProduct(newProduct);
        setNewProduct({
          name: { en: "", ar: "" },
          description: { en: "", ar: "" },
          price: 0,
          image: "",
          category: "dairy",
          weight: "",
          origin: "",
          store: "irth-biladi",
        });
        setShowAddProduct(false);
        setEditingProduct(null); // إنهاء وضع التعديل
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(language === "ar" ? "خطأ في إضافة المنتج" : "Error adding product");
    }
  };

  const handleUpdateProduct = () => {
    if (
      editingProduct &&
      editingProduct.name?.en &&
      editingProduct.name?.ar &&
      editingProduct.price > 0
    ) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
      setShowAddProduct(false); // إخفاء نموذج الإضافة أيضاً
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من ح��ف هذا المنتج؟"
          : "Are you sure you want to delete this product?",
      )
    ) {
      deleteProduct(id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === "ar" ? "ar-SA" : "en-US",
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      pending: language === "ar" ? "قيد الانتظار" : "Pending",
      processing: language === "ar" ? "قيد ��لتجهيز" : "Processing",
      shipped: language === "ar" ? "تم الشحن" : "Shipped",
      delivered: language === "ar" ? "تم التسليم" : "Delivered",
      cancelled: language === "ar" ? "ملغي" : "Cancelled",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Shield className="w-8 h-8 text-red-600 mr-3" />
                {language === "ar" ? "لوحة تحكم الإدارة" : "Admin Dashboard"}
              </h1>
              <p className="text-gray-600 mt-2">
                {language === "ar"
                  ? "إدارة المنتجات والطلبات والعملاء"
                  : "Manage products, orders, and customers"}
              </p>
            </div>

            {/* Admin Info & Logout */}
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="text-right rtl:text-left">
                <p className="text-sm font-medium text-gray-900">
                  {language === "ar" ? "مرحباً أدمن" : "Welcome Admin"}
                </p>
                <p className="text-xs text-gray-500">admin@irthbiladi.com</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {language === "ar" ? "خروج" : "Logout"}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 rtl:space-x-reverse border-b">
            {[
              {
                key: "overview",
                label: language === "ar" ? "نظرة عامة" : "Overview",
                icon: BarChart3,
              },
              {
                key: "products",
                label: language === "ar" ? "المنتجات" : "Products",
                icon: Package,
              },
              {
                key: "orders",
                label: language === "ar" ? "الطلبات" : "Orders",
                icon: ShoppingCart,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 rtl:space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? "border-olive-600 text-olive-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {language === "ar" ? "إجمالي المنتجات" : "Total Products"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalProducts}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {language === "ar" ? "إجمالي الطلبات" : "Total Orders"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.totalOrders}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {language === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-olive-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-olive-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {language === "ar"
                        ? "طلبات ��يد ا��انتظار"
                        : "Pending Orders"}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats.pendingOrders}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {language === "ar" ? "أحدث الطلبات" : "Recent Orders"}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th
                        className={`py-3 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "رقم الطلب" : "Order ID"}
                      </th>
                      <th
                        className={`py-3 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "العميل" : "Customer"}
                      </th>
                      <th
                        className={`py-3 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "المبلغ" : "Amount"}
                      </th>
                      <th
                        className={`py-3 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "الحالة" : "Status"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="py-4 text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {language === "ar" ? "إدارة المنتجات" : "Product Management"}
              </h2>
              <div className="flex gap-2">
                {editingProduct && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {language === "ar" ? "وضع التعديل" : "Edit Mode"}
                  </span>
                )}
                <Button
                  onClick={() => {
                    setShowAddProduct(true);
                    setEditingProduct(null); // إنهاء وضع التعديل
                  }}
                  className="bg-olive-600 hover:bg-olive-700"
                  disabled={editingProduct !== null}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "ar" ? "إضافة منتج" : "Add Product"}
                </Button>
              </div>
            </div>

            {/* Edit Product Form */}
            {editingProduct && editingProduct.id && editingProduct.store && (
              <div className="bg-white rounded-2xl shadow-soft p-6 border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === "ar" ? "تعديل المنتج" : "Edit Product"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}
                    </Label>
                    <Input
                      value={editingProduct?.name?.en || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          name: { ...editingProduct!.name, en: e.target.value },
                        })
                      }
                      placeholder="Product name in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}
                    </Label>
                    <Input
                      value={editingProduct?.name?.ar || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          name: { ...editingProduct!.name, ar: e.target.value },
                        })
                      }
                      placeholder="اسم المنتج بالعربية"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (إنجليزي)"
                        : "Description (English)"}
                    </Label>
                    <Input
                      value={editingProduct?.description?.en || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          description: {
                            ...editingProduct!.description,
                            en: e.target.value,
                          },
                        })
                      }
                      placeholder="Product description in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (عربي)"
                        : "Description (Arabic)"}
                    </Label>
                    <Input
                      value={editingProduct?.description?.ar || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          description: {
                            ...editingProduct!.description,
                            ar: e.target.value,
                          },
                        })
                      }
                      placeholder="وصف المنتج بالعربية"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "ال���عر" : "Price"}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct?.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "الفئة" : "Category"}</Label>
                    <select
                      value={editingProduct?.category || "dairy"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          category: e.target.value as Product["category"],
                        })
                      }
                      className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    >
                      <option value="dairy">
                        {language === "ar" ? "منتجات الألبان" : "Dairy"}
                      </option>
                      <option value="spices">
                        {language === "ar" ? "التوابل" : "Spices"}
                      </option>
                      <option value="oils">
                        {language === "ar" ? "الزيوت" : "Oils"}
                      </option>
                      <option value="beverages">
                        {language === "ar" ? "المشروبات" : "Beverages"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "رابط الص��رة" : "Image URL"}
                    </Label>
                    <Input
                      value={editingProduct?.image || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "الوزن" : "Weight"}</Label>
                    <Input
                      value={editingProduct.weight || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          weight: e.target.value,
                        })
                      }
                      placeholder="500g"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "المنشأ" : "Origin"}</Label>
                    <Input
                      value={editingProduct.origin || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          origin: e.target.value,
                        })
                      }
                      placeholder="Lebanon"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleUpdateProduct}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {language === "ar" ? "حفظ التعديلات" : "Save Changes"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingProduct(null)}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}

            {/* Add Product Form */}
            {showAddProduct && !editingProduct && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {language === "ar" ? "إضافة منتج ��ديد" : "Add New Product"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}
                    </Label>
                    <Input
                      value={newProduct.name.en}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          name: { ...newProduct.name, en: e.target.value },
                        })
                      }
                      placeholder="Product name in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "الاسم (عرب��)" : "Name (Arabic)"}
                    </Label>
                    <Input
                      value={newProduct.name.ar}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          name: { ...newProduct.name, ar: e.target.value },
                        })
                      }
                      placeholder="اسم المنتج بالعربية"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (إنجليزي)"
                        : "Description (English)"}
                    </Label>
                    <Input
                      value={newProduct.description.en}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: {
                            ...newProduct.description,
                            en: e.target.value,
                          },
                        })
                      }
                      placeholder="Product description in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (عربي)"
                        : "Description (Arabic)"}
                    </Label>
                    <Input
                      value={newProduct.description.ar}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: {
                            ...newProduct.description,
                            ar: e.target.value,
                          },
                        })
                      }
                      placeholder="وصف المنتج بالعربية"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "السعر" : "Price"}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "الفئة" : "Category"}</Label>
                    <select
                      value={newProduct.category}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value as Product["category"],
                        })
                      }
                      className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    >
                      <option value="dairy">
                        {language === "ar" ? "منتجات الألبان" : "Dairy"}
                      </option>
                      <option value="spices">
                        {language === "ar" ? "التوابل" : "Spices"}
                      </option>
                      <option value="oils">
                        {language === "ar" ? "الزيوت" : "Oils"}
                      </option>
                      <option value="beverages">
                        {language === "ar" ? "المشروبات" : "Beverages"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <Label>{language === "ar" ? "المتجر" : "Store"}</Label>
                    <select
                      value={newProduct.store}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          store: e.target.value as Product["store"],
                        })
                      }
                      className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    >
                      <option value="irth-biladi">
                        {language === "ar" ? "إرث بلادي" : "Irth Biladi"}
                      </option>
                      <option value="cilka">Cilka</option>
                    </select>
                  </div>
                  <div>
                    <Label>{language === "ar" ? "المتجر" : "Store"}</Label>
                    <select
                      value={editingProduct.store || "irth-biladi"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct!,
                          store: e.target.value as Product["store"],
                        })
                      }
                      className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    >
                      <option value="irth-biladi">
                        {language === "ar" ? "إرث بلادي" : "Irth Biladi"}
                      </option>
                      <option value="cilka">Cilka</option>
                    </select>
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "رابط الصورة" : "Image URL"}
                    </Label>
                    <Input
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "الوزن" : "Weight"}</Label>
                    <Input
                      value={newProduct.weight}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, weight: e.target.value })
                      }
                      placeholder="500g"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "المنشأ" : "Origin"}</Label>
                    <Input
                      value={newProduct.origin}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, origin: e.target.value })
                      }
                      placeholder="Lebanon"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAddProduct}
                    className="bg-olive-600 hover:bg-olive-700"
                  >
                    {language === "ar" ? "حفظ" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddProduct(false)}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "المنتج" : "Product"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "الفئة" : "Category"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "المتجر" : "Store"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "السعر" : "Price"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products
                      .filter(
                        (product) =>
                          product &&
                          product.id &&
                          product.name &&
                          product.name.en &&
                          product.name.ar &&
                          product.store &&
                          typeof product.price === "number",
                      )
                      .map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-100"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name?.[language] || "Product"}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name?.[language] ||
                                    "Unknown Product"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.weight || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                            {product.category || "unknown"}
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                product?.store === "irth-biladi"
                                  ? "bg-olive-100 text-olive-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {product?.store === "irth-biladi"
                                ? language === "ar"
                                  ? "إرث بلادي"
                                  : "Irth Biladi"
                                : "Cilka"}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">
                            ${(product.price || 0).toFixed(2)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2 rtl:space-x-reverse">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === "ar" ? "إدارة الطلبات" : "Order Management"}
            </h2>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "رقم الطلب" : "Order ID"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "العميل" : "Customer"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "التاريخ" : "Date"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "المبلغ" : "Amount"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "الحالة" : "Status"}
                      </th>
                      <th
                        className={`py-4 px-6 text-sm font-medium text-gray-600 ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {language === "ar" ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          #{order.id.slice(-6)}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.customerName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as any)
                            }
                            className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                          >
                            <option value="pending">
                              {getStatusText("pending")}
                            </option>
                            <option value="processing">
                              {getStatusText("processing")}
                            </option>
                            <option value="shipped">
                              {getStatusText("shipped")}
                            </option>
                            <option value="delivered">
                              {getStatusText("delivered")}
                            </option>
                            <option value="cancelled">
                              {getStatusText("cancelled")}
                            </option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
