import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  Eye,
} from "lucide-react";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: Date;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real user orders from API (only show orders placed by the logged-in user)
  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const { apiClient } = await import("../services/api");
        const result = await apiClient.orders.getUserOrders();
        if (!mounted) return;
        if (!result.success) {
          setError(result.error || "Failed to fetch orders");
          setOrders([]);
        } else if (result.data) {
          // Map API orders to local Order shape
          const mapped = result.data.map((o: any) => ({
            id: o.id,
            date: new Date(o.created_at || o.date || Date.now()),
            status: o.status || "pending",
            total: Number(o.total) || 0,
            items: (o.items || o.order_items || []).map((it: any) => ({
              id: it.id || it.product_id || `${o.id}-${Math.random()}`,
              name:
                it.product?.name?.[language] ||
                it.name ||
                it.product?.name_en ||
                (it.product && (it.product.name_en || it.product.name_ar)) ||
                "Product",
              quantity: Number(it.quantity) || 1,
              price: Number(it.price) || 0,
              image:
                it.product?.image ||
                (it.product && it.product.image) ||
                it.image ||
                "",
            })),
            shippingAddress:
              typeof o.shipping_address === "string"
                ? o.shipping_address
                : o.shipping_address?.street
                  ? `${o.shipping_address.street}, ${o.shipping_address.city}`
                  : o.shipping_address?.city
                    ? `${o.shipping_address.city}`
                    : "",
            paymentMethod:
              o.payment_method ||
              o.paymentMethod ||
              o.payment_method_type ||
              "",
          }));

          setOrders(mapped);
        } else {
          setOrders([]);
        }
      } catch (err: any) {
        console.error("Failed to load user orders", err);
        setError(err?.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOrders();
    return () => {
      mounted = false;
    };
  }, [user, language]);

  const handleDownloadAll = () => {
    const blob = new Blob([JSON.stringify(orders, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_${user?.id || "me"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "ar"
              ? "يجب تسجيل الدخول أولاً"
              : "Please login first"}
          </h1>
          <Button onClick={() => (window.location.href = "/login")}>
            {language === "ar" ? "تسجيل الدخول" : "Login"}
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order["status"]) => {
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

  const getStatusText = (status: Order["status"]) => {
    if (language === "ar") {
      switch (status) {
        case "pending":
          return "في الانتظار";
        case "processing":
          return "قيد المعالجة";
        case "shipped":
          return "تم الشحن";
        case "delivered":
          return "تم التسليم";
        case "cancelled":
          return "ملغي";
        default:
          return status;
      }
    } else {
      switch (status) {
        case "pending":
          return "Pending";
        case "processing":
          return "Processing";
        case "shipped":
          return "Shipped";
        case "delivered":
          return "Delivered";
        case "cancelled":
          return "Cancelled";
        default:
          return status;
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === "ar" ? "تا��يخ الطلبات" : "Order History"}
          </h1>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadAll}
          >
            <Download className="w-4 h-4" />
            {language === "ar" ? "تحميل الكل" : "Download All"}
          </Button>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            {language === "ar" ? "جارٍ التحميل..." : "Loading orders..."}
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === "ar"
                  ? "لا توجد طلبات سابقة"
                  : "No previous orders"}
              </h3>
              <p className="text-gray-500">
                {language === "ar"
                  ? "ستظهر طلباتك هنا بعد إجراء أول عملية شراء"
                  : "Your orders will appear here after your first purchase"}
              </p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = "/products")}
              >
                {language === "ar" ? "تسوق الآن" : "Shop Now"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {language === "ar"
                          ? `طلب رقم ${order.id}`
                          : `Order ${order.id}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <Calendar className="w-4 h-4" />
                        {format(order.date, "dd MMMM yyyy", {
                          locale: language === "ar" ? ar : undefined,
                        })}
                      </CardDescription>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="text-left rtl:text-right">
                      <div className="text-2xl font-bold text-olive-600">
                        {order.total.toFixed(2)} {language === "ar" ? "د.أ" : "JD"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length}{" "}
                        {language === "ar" ? "عنصر" : "items"}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              {language === "ar" ? "الكمية:" : "Quantity:"}{" "}
                              {item.quantity}
                            </p>
                          </div>
                          <div className="text-right rtl:text-left font-medium">
                            {item.price.toFixed(2)} {language === "ar" ? "د.أ" : "JD"}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {language === "ar"
                            ? "عنوان الشحن:"
                            : "Shipping Address:"}
                        </span>
                        <span>{order.shippingAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {language === "ar"
                            ? "طريقة الدفع:"
                            : "Payment Method:"}
                        </span>
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        {language === "ar" ? "عرض التفاصيل" : "View Details"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        {language === "ar"
                          ? "تحميل الفاتورة"
                          : "Download Invoice"}
                      </Button>
                      {order.status === "delivered" && (
                        <Button size="sm" className="flex items-center gap-1">
                          {language === "ar" ? "إعادة الطلب" : "Reorder"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order details modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        language={language}
      />
    </div>
  );
};

export default OrderHistory;
