import React, { useState } from "react";
import { X } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { apiClient } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

interface CartItem {
  product: any;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  clearCart: () => void;
  recipientPhone?: string;
  onOrderSaved?: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  total,
  clearCart,
  recipientPhone,
  onOrderSaved,
}) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isAR = language === "ar";

  const [name, setName] = useState<string>(user?.name || "");
  const [phone, setPhone] = useState<string>(user?.phone || "");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  React.useEffect(() => {
    let mounted = true;
    apiClient.settings.get('delivery_fee').then(res => {
      if (!mounted) return;
      if (res.success) {
        const val = res.data;
        if (typeof val === 'number') setDeliveryFee(val);
        else if (val && typeof val === 'object' && val.amount) setDeliveryFee(parseFloat(String(val.amount)) || 0);
        else if (!isNaN(Number(val))) setDeliveryFee(Number(val));
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (!isOpen) return null;

  const t = (en: string, ar: string) => (isAR ? ar : en);

  const buildWhatsAppRecipient = (raw: string) => {
    if (!raw) return "";
    let v = raw.trim();
    if (v.startsWith("+")) v = v.slice(1);
    if (v.startsWith("0")) v = `962${v.slice(1)}`; // assume Jordan local
    return v;
  };

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push(t("New order", "طلب جديد"));
    lines.push(`${t("Name", "الاسم")}: ${name}`);
    if (phone) lines.push(`${t("Phone", "الهاتف")}: ${phone}`);
    lines.push(`${t("Total", "المجموع")}: ${total.toFixed(2)} JD`);
    lines.push(t("Items", "المنتجات") + ":");
    items.forEach((it) => {
      const title =
        typeof it.product.name === "string"
          ? it.product.name
          : it.product.name?.en || it.product.name?.ar || "";
      lines.push(
        `- ${title} x ${it.quantity} = ${(it.product.price * it.quantity).toFixed(2)} JD`,
      );
    });
    if (street || city || country) {
      lines.push(t("Address", "العنوان") + ":");
      lines.push(`${street} ${city} ${country}`.trim());
    }
    return encodeURIComponent(lines.join("\n"));
  };

  const validate = () => {
    if (!name || !name.trim()) {
      setError(t("Name is required", "الاسم مطلوب"));
      return false;
    }
    if (!street || !street.trim()) {
      setError(t("Street address is required", "الشارع مطلوب"));
      return false;
    }
    if (!city || !city.trim()) {
      setError(t("City is required", "المدينة مطلوبة"));
      return false;
    }
    if (!country || !country.trim()) {
      setError(t("Country is required", "البلد مطلوب"));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!validate()) return;

    setLoading(true);

    try {
      // Open WhatsApp
      const recipient = buildWhatsAppRecipient(recipientPhone || "");
      const text = buildMessage();
      if (recipient) {
        const waUrl = `https://wa.me/${recipient}?text=${text}`;
        window.open(waUrl, "_blank");
      } else {
        const waUrl = `https://web.whatsapp.com/send?text=${text}`;
        window.open(waUrl, "_blank");
      }

      // Save order
      const orderPayload = {
        customer_name: name || user?.name || "Guest",
        customer_email: user?.email || "",
        shipping_address: {
          street,
          city,
          country,
          phone,
        },
        items: items.map((it) => ({
          product_id: it.product.id,
          quantity: it.quantity,
          price: it.product.price,
        })),
      };

      const res = await apiClient.orders.create(orderPayload);
      if (!res.success) {
        setError(res.error || t("Failed to save order", "فشل حفظ الطلب"));
      } else {
        clearCart();
        onOrderSaved && onOrderSaved();
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || t("Unknown error", "خطأ غير معروف"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {t("Checkout", "إتمام الطلب")}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>{t("Name", "الاسم")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>{t("Phone", "الهاتف")}</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <Label>{t("Street / Address", "الشارع / العنوان")}</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("City", "المدينة")}</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>{t("Country", "البلد")}</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t("Cancel", "الغاء")}
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading
                ? isAR
                  ? "جارٍ..."
                  : "Processing..."
                : t(
                    "Send via WhatsApp and Save Order",
                    "ارسال عبر واتساب وحفظ الطلب",
                  )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
