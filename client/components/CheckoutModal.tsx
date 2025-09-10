import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { apiClient } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  product: any;
  quantity: number;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderSaved?: () => void;
  clearCart: () => void;
  recipientPhone?: string; // optional override for WhatsApp recipient
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onOrderSaved,
  clearCart,
  recipientPhone,
}) => {
  const { user } = useAuth();
  const [name, setName] = useState<string>(user?.name || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [street, setStreet] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const buildWhatsAppRecipient = (raw: string) => {
    if (!raw) return '';
    // If starts with + remove plus
    let v = raw.trim();
    if (v.startsWith('+')) v = v.slice(1);
    // If starts with 0, assume local Jordan number and replace with 962
    if (v.startsWith('0')) v = `962${v.slice(1)}`;
    return v;
  };

  const buildMessage = () => {
    const lines: string[] = [];
    lines.push('طلب جديد');
    lines.push(`الاسم: ${name}`);
    if (phone) lines.push(`الهاتف: ${phone}`);
    lines.push(`المجموع: ${total.toFixed(2)} JD`);
    lines.push('المنتجات:');
    items.forEach((it) => {
      const title = typeof it.product.name === 'string' ? it.product.name : (it.product.name?.en || it.product.name?.ar || '');
      lines.push(`- ${title} x ${it.quantity} = ${(it.product.price * it.quantity).toFixed(2)} JD`);
    });
    if (street || city || country) {
      lines.push('العنوان:');
      lines.push(`${street} ${city} ${country}`.trim());
    }
    return encodeURIComponent(lines.join('\n'));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Open WhatsApp with prefilled message
      const recipient = buildWhatsAppRecipient(recipientPhone || '0796427591');
      const text = buildMessage();
      if (recipient) {
        const waUrl = `https://wa.me/${recipient}?text=${text}`;
        window.open(waUrl, '_blank');
      } else {
        // fallback: open WhatsApp web without recipient
        const waUrl = `https://web.whatsapp.com/send?text=${text}`;
        window.open(waUrl, '_blank');
      }

      // Save order to the backend AFTER opening WhatsApp
      const orderPayload = {
        customer_name: name || user?.name || 'Guest',
        customer_email: user?.email || '',
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
        setError(res.error || 'Failed to save order');
      } else {
        // Clear cart and notify parent
        clearCart();
        onOrderSaved && onOrderSaved();
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">إتمام الطلب</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>الاسم</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>الهاتف</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div>
            <Label>الشارع / العنوان</Label>
            <Input value={street} onChange={(e) => setStreet(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>المدينة</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>البلد</Label>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">الغاء</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'جارٍ...' : 'ارسال عبر واتساب وحفظ الطلب'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
