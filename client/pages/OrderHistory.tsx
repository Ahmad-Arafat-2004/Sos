import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Package, Calendar, MapPin, CreditCard, Download, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          date: new Date('2024-01-15'),
          status: 'delivered',
          total: 120.50,
          items: [
            {
              id: '1',
              name: language === 'ar' ? 'زيت زيتون فلسطيني' : 'Palestinian Olive Oil',
              quantity: 2,
              price: 45.25,
              image: 'https://via.placeholder.com/60'
            },
            {
              id: '2',
              name: language === 'ar' ? 'صابون زيت الزيتون' : 'Olive Oil Soap',
              quantity: 3,
              price: 30.00,
              image: 'https://via.placeholder.com/60'
            }
          ],
          shippingAddress: language === 'ar' ? 'رام الله، فلسطين' : 'Ramallah, Palestine',
          paymentMethod: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'
        },
        {
          id: 'ORD-002',
          date: new Date('2024-01-10'),
          status: 'shipped',
          total: 75.00,
          items: [
            {
              id: '3',
              name: language === 'ar' ? 'تطريز فلسطيني تقليدي' : 'Traditional Palestinian Embroidery',
              quantity: 1,
              price: 75.00,
              image: 'https://via.placeholder.com/60'
            }
          ],
          shippingAddress: language === 'ar' ? 'غزة، فلسطين' : 'Gaza, Palestine',
          paymentMethod: language === 'ar' ? 'الدفع عند التسليم' : 'Cash on Delivery'
        },
        {
          id: 'ORD-003',
          date: new Date('2024-01-05'),
          status: 'processing',
          total: 200.00,
          items: [
            {
              id: '4',
              name: language === 'ar' ? 'مجوهرات فضة تراثية' : 'Heritage Silver Jewelry',
              quantity: 1,
              price: 200.00,
              image: 'https://via.placeholder.com/60'
            }
          ],
          shippingAddress: language === 'ar' ? 'ا��قدس، فلسطين' : 'Jerusalem, Palestine',
          paymentMethod: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'
        }
      ];
      setOrders(mockOrders);
    }
  }, [user, language]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first'}
          </h1>
          <Button onClick={() => window.location.href = '/login'}>
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    if (language === 'ar') {
      switch (status) {
        case 'pending': return 'في الانتظار';
        case 'processing': return 'قيد المعالجة';
        case 'shipped': return 'تم الشحن';
        case 'delivered': return 'تم التسليم';
        case 'cancelled': return 'ملغي';
        default: return status;
      }
    } else {
      switch (status) {
        case 'pending': return 'Pending';
        case 'processing': return 'Processing';
        case 'shipped': return 'Shipped';
        case 'delivered': return 'Delivered';
        case 'cancelled': return 'Cancelled';
        default: return status;
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'ar' ? 'تاريخ الطلبات' : 'Order History'}
          </h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {language === 'ar' ? 'تحميل الكل' : 'Download All'}
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {language === 'ar' ? 'لا توجد طلبات سابقة' : 'No previous orders'}
              </h3>
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'ستظهر طلباتك هنا بعد إجراء أول عملية شراء' 
                  : 'Your orders will appear here after your first purchase'
                }
              </p>
              <Button className="mt-4" onClick={() => window.location.href = '/products'}>
                {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        {language === 'ar' ? `طلب رقم ${order.id}` : `Order ${order.id}`}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <Calendar className="w-4 h-4" />
                        {format(order.date, 'dd MMMM yyyy', {
                          locale: language === 'ar' ? ar : undefined
                        })}
                      </CardDescription>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="text-left rtl:text-right">
                      <div className="text-2xl font-bold text-olive-600">
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.length} {language === 'ar' ? 'عنصر' : 'items'}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-gray-500">
                              {language === 'ar' ? 'الكمية:' : 'Quantity:'} {item.quantity}
                            </p>
                          </div>
                          <div className="text-right rtl:text-left font-medium">
                            ${item.price.toFixed(2)}
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
                          {language === 'ar' ? 'عنوان الشحن:' : 'Shipping Address:'}
                        </span>
                        <span>{order.shippingAddress}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}
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
                        {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        {language === 'ar' ? 'تحميل الفاتورة' : 'Download Invoice'}
                      </Button>
                      {order.status === 'delivered' && (
                        <Button 
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          {language === 'ar' ? 'إعادة الطلب' : 'Reorder'}
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
    </div>
  );
};

export default OrderHistory;
