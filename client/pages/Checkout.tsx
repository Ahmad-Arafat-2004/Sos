import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';

const Checkout: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/cart" 
          className="inline-flex items-center gap-2 text-olive-600 hover:text-olive-700 transition-colors mb-4"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {language === 'ar' ? 'العودة للسلة' : 'Back to Cart'}
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {language === 'ar' ? 'إتمام الطلب' : 'Checkout'}
        </h1>
      </div>

      {/* Coming Soon Content */}
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-soft p-12">
          <div className="w-24 h-24 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-12 h-12 text-olive-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'صفحة الدفع قريباً' : 'Checkout Coming Soon'}
          </h2>
          
          <p className="text-gray-600 mb-8">
            {language === 'ar' 
              ? 'نعمل حالياً على تطوير نظام دفع آمن ومتطور لإتمام طلباتكم بسهولة'
              : 'We\'re currently developing a secure and advanced payment system to complete your orders with ease'
            }
          </p>

          {/* Order Summary */}
          <div className="bg-olive-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-olive-800 mb-3">
              {language === 'ar' ? 'ملخص طلبك' : 'Your Order Summary'}
            </h3>
            <div className="flex justify-between items-center text-olive-700">
              <span>{language === 'ar' ? 'العناصر' : 'Items'}: {totalItems}</span>
              <span className="font-bold">{totalPrice.toFixed(2)} {language === 'ar' ? 'د.أ' : 'JD'}</span>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {language === 'ar' ? 'دفع آمن' : 'Secure Payment'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'تشفير SSL' : 'SSL Encryption'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {language === 'ar' ? 'شحن سريع' : 'Fast Shipping'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? '2-3 أيام' : '2-3 Days'}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">
                {language === 'ar' ? 'طرق دفع متعددة' : 'Multiple Payment'}
              </h4>
              <p className="text-sm text-gray-600">
                {language === 'ar' ? 'فيزا، ماستركارد' : 'Visa, Mastercard'}
              </p>
            </div>
          </div>

          <Link to="/cart">
            <Button size="lg" className="bg-olive-600 hover:bg-olive-700">
              {language === 'ar' ? 'العودة للسلة' : 'Back to Cart'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
