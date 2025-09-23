import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  date: Date;
  status: string;
  total: number;
  items: OrderItem[];
  shippingAddress?: string;
  paymentMethod?: string;
}

interface Props {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

const OrderDetailsModal: React.FC<Props> = ({
  order,
  isOpen,
  onClose,
  language = "en",
}) => {
  if (!isOpen || !order) return null;

  const isAR = language === "ar";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 p-6 overflow-auto max-h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-2">
          {isAR ? "تفاصيل الطلب" : "Order Details"}
        </h3>
        <div className="text-sm text-gray-600 mb-4">
          {isAR ? "رقم الطلب" : "Order ID"}: {order.id}
        </div>

        <div className="space-y-3">
          {order.items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {it.image ? (
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-12 h-12 object-cover rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded" />
              )}
              <div className="flex-1">
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">
                  {isAR ? "الكمية" : "Quantity"}: {it.quantity}
                </div>
              </div>
              <div className="font-medium">{it.price.toFixed(2)} JD</div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">
              {isAR ? "عنوان الشحن" : "Shipping Address"}
            </div>
            <div>{order.shippingAddress || "-"}</div>
          </div>
          <div>
            <div className="text-gray-600">
              {isAR ? "طريقة الدفع" : "Payment Method"}
            </div>
            <div>{order.paymentMethod || "-"}</div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            {isAR ? "الحالة" : "Status"}: {order.status}
          </div>
          <div className="text-xl font-bold text-olive-600">
            {order.total.toFixed(2)} JD
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            {isAR ? "إغلاق" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
