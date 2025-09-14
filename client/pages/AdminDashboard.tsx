import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Tags,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAdmin, Category } from "../contexts/AdminContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Product } from "../contexts/CartContext";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { useNotification } from "../contexts/NotificationContext";

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  // دوال مساعدة للإشعارات
  const showSuccess = (message: string) => showNotification(message, "success");
  const showError = (message: string) => showNotification(message, "error");
  const {
    products = [],
    categories = [],
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories"
  >("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);


  // حالات نوافذ التأكيد
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmText: "",
    cancelText: "",
    onConfirm: () => {},
    isDestructive: false,
  });

  // نموذج المنتج الجديد
  const [newProduct, setNewProduct] = useState({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    price: 0,
    image: "",
    category: "" as Product["category"],
    weight: "",
    store: "irth-biladi" as Product["store"],
  });

  // When categories load, default the newProduct.category to first category id
  React.useEffect(() => {
    if (!newProduct.category && categories && categories.length > 0) {
      setNewProduct((prev) => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  // نموذج الفئة الجديدة
  const [newCategory, setNewCategory] = useState({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    slug: "",
  });

  // خروج الأدمن
  const handleLogout = () => {
    setConfirmDialog({
      isOpen: true,
      title: language === "ar" ? "تسجيل الخروج" : "Logout",
      description:
        language === "ar"
          ? "هل أنت متأكد م�� تسجيل الخروج؟"
          : "Are you sure you want to logout?",
      confirmText: language === "ar" ? "تسجيل الخر��ج" : "Logout",
      cancelText: language === "ar" ? "إلغاء" : "Cancel",
      onConfirm: () => {
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminEmail");
        navigate("/login");
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      isDestructive: false,
    });
  };

  // إضافة منتج جديد
  const handleAddProduct = async () => {
    try {
      if (!newProduct.name.en) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال الاسم بالإنجليزية"
            : "Please enter name in English",
        );
        return;
      }
      if (!newProduct.name.ar) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال الاسم بالعربية"
            : "Please enter name in Arabic",
        );
        return;
      }
      // Require descriptions in both languages
      if (!newProduct.description || !newProduct.description.en) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال الوصف بال��نجليزية"
            : "Please enter description in English",
        );
        try {
          addDescEnRef.current?.focus();
        } catch (e) {}
        return;
      }
      if (!newProduct.description || !newProduct.description.ar) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال الوصف بالعربية"
            : "Please enter description in Arabic",
        );
        try {
          addDescArRef.current?.focus();
        } catch (e) {}
        return;
      }
      if (newProduct.price <= 0) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال سعر أكبر من 0"
            : "Please enter a price greater than 0",
        );
        return;
      }

      if (!newProduct.category) {
        showNotification(
          language === "ar"
            ? "الرجاء اختيار الفئة"
            : "Please select a category",
        );
        return;
      }

      const created = await addProduct(newProduct);
      if (!created) {
        // addProduct already shows error notification (now includes validation details)
        return;
      }

      // ��عادة تعيين النموذج فقط عند النجاح
      setNewProduct({
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        price: 0,
        image: "",
        category: categories && categories.length > 0 ? categories[0].id : "",
        weight: "",
        store: "irth-biladi",
      });
      setShowAddProduct(false);
    } catch (error) {
      console.error("Error adding product:", error);
      showNotification(
        language === "ar" ? "خطأ في إضافة المنتج" : "Error adding product",
      );
    }
  };

  // تحديث منتج
  const handleUpdateProduct = async () => {
    try {
      if (editingProduct && editingProduct.id) {
        // Validate descriptions before update
        if (!editingProduct.description || !editingProduct.description.en) {
          showNotification(
            language === "ar"
              ? "الرجاء إدخال الوصف بالإنجليزية"
              : "Please enter description in English",
          );
          try {
            editDescEnRef.current?.focus();
          } catch (e) {}
          return;
        }
        if (!editingProduct.description || !editingProduct.description.ar) {
          showNotification(
            language === "ar"
              ? "الرجاء إدخال الوصف بالعربية"
              : "Please enter description in Arabic",
          );
          try {
            editDescArRef.current?.focus();
          } catch (e) {}
          return;
        }

        if (!editingProduct.category) {
          showNotification(
            language === "ar"
              ? "الرجاء اختيار الفئة"
              : "Please select a category",
          );
          return;
        }

        const updated = await updateProduct(editingProduct.id, editingProduct);
        if (!updated) {
          // updateProduct will show error notification
          return;
        }
        setEditingProduct(null);
        // success notification already shown in context
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showNotification("خطأ في تحديث المنتج");
    }
  };

  // حذف منتج
  const handleDeleteProduct = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: language === "ar" ? "حذف المنتج" : "Delete Product",
      description:
        language === "ar"
          ? "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete this product? This action cannot be undone.",
      confirmText: language === "ar" ? "حذف المنتج" : "Delete Product",
      cancelText: language === "ar" ? "إلغاء" : "Cancel",
      onConfirm: async () => {
        try {
          await deleteProduct(id);
          // deleteProduct in context handles notifications
        } catch (error) {
          console.error("Error deleting product:", error);
          showNotification("خطأ في حذف المنتج");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      isDestructive: true,
    });
  };

  // إضافة فئة جديدة
  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.en) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال ا��م الفئة بالإنجليزية"
            : "Please enter category name in English",
        );
        return;
      }
      if (!newCategory.name.ar) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال اسم الفئة بالعربية"
            : "Please enter category name in Arabic",
        );
        return;
      }
      if (!newCategory.slug) {
        showNotification(
          language === "ar"
            ? "الرجاء إدخال الرمز المختصر"
            : "Please enter category slug",
        );
        return;
      }

      // slug must be lowercase letters, numbers and hyphens
      const slugRegex = /^[a-z0-9-]+$/;
      if (!slugRegex.test(newCategory.slug)) {
        showNotification(
          language === "ar"
            ? "الرمز المختصر يجب أن يحتوي أحرف صغيرة، أرقام وشرطات فقط"
            : "Slug must contain only lowercase letters, numbers and hyphens",
        );
        return;
      }

      const created = await addCategory(newCategory);
      if (!created) {
        return;
      }

      // Reset only on success
      setNewCategory({
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        slug: "",
      });
      setShowAddCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showNotification(
        language === "ar"
          ? `خطأ في إضافة الفئة: ${errorMessage}`
          : `Error adding category: ${errorMessage}`,
      );
    }
  };

  // تحديث فئة
  const handleUpdateCategory = async () => {
    try {
      if (editingCategory && editingCategory.id) {
        const updated = await updateCategory(
          editingCategory.id,
          editingCategory as any,
        );
        if (!updated) return; // updateCategory will show error
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      showNotification(
        language === "ar"
          ? `خطأ في تحديث الفئة: ${errorMessage}`
          : `Error updating category: ${errorMessage}`,
      );
    }
  };

  // حذف فئة
  const handleDeleteCategory = async (id: string) => {
    if (
      confirm(
        language === "ar"
          ? "هل أنت متأكد من حذف هذه ال��ئة؟"
          : "Are you sure you want to delete this category?",
      )
    ) {
      try {
        await deleteCategory(id);
        showNotification(
          language === "ar"
            ? "تم حذف الفئ�� بنجاح!"
            : "Category deleted successfully!",
        );
      } catch (error) {
        console.error("Error deleting category:", error);
        showNotification("خطأ في ��ذف الفئة");
      }
    }
  };

  // حذف فئة مع نافذة تأكيد مخصصة
  const handleDeleteCategoryCustom = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: language === "ar" ? "حذف الفئة" : "Delete Category",
      description:
        language === "ar"
          ? "هل أنت متأكد من حذف هذه الفئة؟ لا يمكن التراجع عن هذا الإجراء."
          : "Are you sure you want to delete this category? This action cannot be undone.",
      confirmText: language === "ar" ? "حذف الفئة" : "Delete Category",
      cancelText: language === "ar" ? "إلغاء" : "Cancel",
      onConfirm: async () => {
        try {
          await deleteCategory(id);
          showNotification(
            language === "ar"
              ? "ت�� حذف الفئة بنجاح!"
              : "Category deleted successfully!",
          );
        } catch (error) {
          console.error("Error deleting category:", error);
          showNotification("خطأ في حذف الف��ة");
        }
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      },
      isDestructive: true,
    });
  };

  // فلترة المنتجات للتأكد من س��امتها
  const safeProducts = Array.isArray(products)
    ? products.filter(
        (p) =>
          p &&
          typeof p === "object" &&
          p.id &&
          p.name &&
          typeof p.name === "object" &&
          p.name.en &&
          p.name.ar,
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {language === "ar" ? "لوحة التحكم" : "Admin Dashboard"}
            </h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              {language === "ar" ? "خروج" : "Logout"}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            style={{ marginLeft: "14px" }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {language === "ar" ? "نظرة عامة" : "Overview"}
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            style={{ marginLeft: "17px" }}
          >
            <Package className="w-4 h-4 mr-2" />
            {language === "ar" ? "المنتجات" : "Products"}
          </Button>
          <Button
            variant={activeTab === "categories" ? "default" : "outline"}
            onClick={() => setActiveTab("categories")}
          >
            <Tags className="w-4 h-4 mr-2" />
            {language === "ar" ? "الفئات" : "Categories"}
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                {language === "ar" ? "إجمالي المنتجات" : "Total Products"}
              </h3>
              <p className="text-3xl font-bold text-olive-600">
                {safeProducts.length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                {language === "ar"
                  ? "منتجات إرث بلادي"
                  : "Irth Biladi Products"}
              </h3>
              <p className="text-3xl font-bold text-olive-600">
                {safeProducts.filter((p) => p.store === "irth-biladi").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">
                {language === "ar" ? "منتجات Cilka" : "Cilka Products"}
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {safeProducts.filter((p) => p.store === "cilka").length}
              </p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Add Product Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {language === "ar" ? "إدارة المنتجات" : "Manage Products"}
              </h2>
              <Button onClick={() => setShowAddProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {language === "ar" ? "إضافة منت��" : "Add Product"}
              </Button>
            </div>

            {/* Edit Product Form */}
            {editingProduct && editingProduct.id && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {language === "ar" ? "تعديل المنتج" : "Edit Product"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الاسم (إن��ليزي)"
                        : "Name (English)"}{" "}
                      *
                    </Label>
                    <Input
                      value={editingProduct.name?.en || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: { ...editingProduct.name, en: e.target.value },
                        })
                      }
                      placeholder="Product name in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "الاسم (عربي)" : "Name (Arabic)"} *
                    </Label>
                    <Input
                      value={editingProduct.name?.ar || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          name: { ...editingProduct.name, ar: e.target.value },
                        })
                      }
                      placeholder="اسم ا��منتج بالعربية"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (إنجليز��)"
                        : "Description (English)"}{" "}
                      *
                    </Label>
                    <Input
                      ref={editDescEnRef}
                      value={editingProduct.description?.en || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: {
                            ...editingProduct.description,
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
                        : "Description (Arabic)"}{" "}
                      *
                    </Label>
                    <Input
                      ref={editDescArRef}
                      value={editingProduct.description?.ar || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          description: {
                            ...editingProduct.description,
                            ar: e.target.value,
                          },
                        })
                      }
                      placeholder="وصف المنتج بالعربية"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "السعر" : "Price"} *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "الفئة" : "Category"}</Label>
                    <select
                      value={editingProduct.category || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    >
                      <option value="">--</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name[language]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>{language === "ar" ? "المتجر" : "Store"}</Label>
                    <select
                      value={editingProduct.store || "irth-biladi"}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          store: e.target.value as any,
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
                      value={editingProduct.image || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
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
                          ...editingProduct,
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
                          ...editingProduct,
                          origin: e.target.value,
                        })
                      }
                      placeholder="Country"
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
            {showAddProduct && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {language === "ar" ? "إضافة منتج جديد" : "Add New Product"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar"
                        ? "��لاسم (إنجليزي)"
                        : "Name (English)"}{" "}
                      *
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
                      className={!newProduct.name.en ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "الاسم (عربي)" : "Name (Arabic)"} *
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
                      className={!newProduct.name.ar ? "border-red-300" : ""}
                    />
                  </div>

                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (إنجليزي)"
                        : "Description (English)"}
                    </Label>
                    <Input
                      ref={addDescEnRef}
                      value={newProduct.description?.en || ""}
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
                      ref={addDescArRef}
                      value={newProduct.description?.ar || ""}
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
                    <Label>{language === "ar" ? "السعر" : "Price"} *</Label>
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
                      className={newProduct.price <= 0 ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <Label>{language === "ar" ? "ال��ئة" : "Category"}</Label>
                    <select
                      value={newProduct.category || ""}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          category: e.target.value as Product["category"],
                        })
                      }
                      className="w-full h-10 px-3 border border-gray-200 rounded-md"
                    >
                      <option value="">-- Select Category --</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name[language]}
                        </option>
                      ))}
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
                    <Label>
                      {language === "ar" ? "رابط الصورة" : "Image URL"}
                    </Label>
                    <Input
                      value={newProduct.image}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => {
                      console.log("Save button clicked");
                      console.log("Product data:", newProduct);
                      handleAddProduct();
                    }}
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "قائمة المنتجات" : "Products List"}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "المنتج" : "Product"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "الفئة" : "Category"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "المتجر" : "Store"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "السعر" : "Price"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {safeProducts.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name?.[language] || "Product"}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name?.[language] || "Unknown Product"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 capitalize">
                          {categories.find((c) => c.id === product.category)
                            ?.name?.[language] ||
                            product.category ||
                            "unknown"}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              product.store === "irth-biladi"
                                ? "bg-olive-100 text-olive-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {product.store === "irth-biladi"
                              ? language === "ar"
                                ? "إرث بلادي"
                                : "Irth Biladi"
                              : "Cilka"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {(product.price || 0).toFixed(2)}{" "}
                          {language === "ar" ? "د.أ" : "JD"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
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
                {safeProducts.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    {language === "ar" ? "لا توجد منتجات" : "No products found"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            {/* Add Category Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {language === "ar" ? "إدارة الفئات" : "Manage Categories"}
              </h2>
              <Button onClick={() => setShowAddCategory(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {language === "ar" ? "إضافة فئة" : "Add Category"}
              </Button>
            </div>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {language === "ar" ? "إضافة فئة جديدة" : "Add New Category"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar"
                        ? "اسم الفئة (إنجليزي)"
                        : "Category Name (English)"}{" "}
                      *
                    </Label>
                    <Input
                      value={newCategory.name.en}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          name: { ...newCategory.name, en: e.target.value },
                        })
                      }
                      placeholder="Category name in English"
                      className={!newCategory.name.en ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "اسم الفئة (عربي)"
                        : "Category Name (Arabic)"}{" "}
                      *
                    </Label>
                    <Input
                      value={newCategory.name.ar}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          name: { ...newCategory.name, ar: e.target.value },
                        })
                      }
                      placeholder="اسم الفئة بالعربية"
                      className={!newCategory.name.ar ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "الرمز المختصر" : "Slug"} *
                    </Label>
                    <Input
                      value={newCategory.slug}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        })
                      }
                      placeholder="category-slug"
                      className={!newCategory.slug ? "border-red-300" : ""}
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (إنجليزي)"
                        : "Description (English)"}
                    </Label>
                    <Input
                      value={newCategory.description?.en || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: {
                            ...newCategory.description,
                            en: e.target.value,
                            ar: newCategory.description?.ar || "",
                          },
                        })
                      }
                      placeholder="Category description in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (عربي)"
                        : "Description (Arabic)"}
                    </Label>
                    <Input
                      value={newCategory.description?.ar || ""}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: {
                            en: newCategory.description?.en || "",
                            ar: e.target.value,
                          },
                        })
                      }
                      placeholder="��صف الفئة بالعربية"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleAddCategory}
                    className="bg-olive-600 hover:bg-olive-700"
                  >
                    {language === "ar" ? "حفظ" : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCategory(false)}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}

            {/* Edit Category Form */}
            {editingCategory && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  {language === "ar" ? "تعديل الفئة" : "Edit Category"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      {language === "ar"
                        ? "اسم الفئة (إنجليزي)"
                        : "Category Name (English)"}{" "}
                      *
                    </Label>
                    <Input
                      value={editingCategory.name.en}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: { ...editingCategory.name, en: e.target.value },
                        })
                      }
                      placeholder="Category name in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "اسم الفئة (عربي)"
                        : "Category Name (Arabic)"}{" "}
                      *
                    </Label>
                    <Input
                      value={editingCategory.name.ar}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: { ...editingCategory.name, ar: e.target.value },
                        })
                      }
                      placeholder="اسم الفئة بالعربية"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar" ? "الرمز المختصر" : "Slug"} *
                    </Label>
                    <Input
                      value={editingCategory.slug}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        })
                      }
                      placeholder="category-slug"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (إنجليزي)"
                        : "Description (English)"}
                    </Label>
                    <Input
                      value={editingCategory.description?.en || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description: {
                            ...editingCategory.description,
                            en: e.target.value,
                            ar: editingCategory.description?.ar || "",
                          },
                        })
                      }
                      placeholder="Category description in English"
                    />
                  </div>
                  <div>
                    <Label>
                      {language === "ar"
                        ? "الوصف (عربي)"
                        : "Description (Arabic)"}
                    </Label>
                    <Input
                      value={editingCategory.description?.ar || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          description: {
                            en: editingCategory.description?.en || "",
                            ar: e.target.value,
                          },
                        })
                      }
                      placeholder="وصف الفئة بالعربية"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleUpdateCategory}
                    className="bg-olive-600 hover:bg-olive-700"
                  >
                    {language === "ar" ? "تحديث" : "Update"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditingCategory(null)}
                  >
                    {language === "ar" ? "إلغاء" : "Cancel"}
                  </Button>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  {language === "ar" ? "قائمة الفئات" : "Categories List"}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "اسم الفئة" : "Category Name"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "الرمز المختصر" : "Slug"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "الوصف" : "Description"}
                      </th>
                      <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                        {language === "ar" ? "الإجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b border-gray-100"
                      >
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-900">
                            {category.name[language]}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {category.slug}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {category.description?.[language] || "-"}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCategory(category)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCategoryCustom(category.id)
                              }
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
                {categories.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    {language === "ar" ? "لا توجد فئات" : "No categories found"}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* نافذة التأكيد المخصصة */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        isDestructive={confirmDialog.isDestructive}
      />
    </div>
  );
};

export default AdminDashboard;
