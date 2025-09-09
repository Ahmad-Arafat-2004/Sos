import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Store } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useStore } from '../contexts/StoreContext';
import { Button } from '../components/ui/button';

const StoreSelection: React.FC = () => {
  const { language, isRTL } = useLanguage();
  const { setSelectedStore } = useStore();
  const navigate = useNavigate();

  const handleStoreSelection = (store: 'irth-biladi' | 'cilka') => {
    setSelectedStore(store);
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 to-olive-100 pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Store className="w-12 h-12 text-olive-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {language === 'ar' ? 'اختر المتجر' : 'Choose Your Store'}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'اختر المتجر الذي تريد التسوق منه لتصفح منتجاته المميزة'
              : 'Choose the store you want to shop from to browse its featured products'
            }
          </p>
        </div>

        {/* Store Options */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* إرث بلادي */}
            <div 
              className="group relative bg-white rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleStoreSelection('irth-biladi')}
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <img
                                      src="https://cdn.builder.io/api/v1/image/assets%2Ff2598ec770cc4f1e987b3ea464917627%2Fac0e2902ff1f49f88ca6bae765759e28?format=webp&width=800"
                    alt={language === 'ar' ? 'إرث بلادي' : 'Irth Biladi'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {language === 'ar' ? 'إرث بلادي' : 'Irth Biladi'}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {language === 'ar' 
                    ? 'مشروع أردني محلي يقدم أجود المنتجات التراثية الأصيلة من البيئة المحلية'
                    : 'A local Jordanian project offering the finest authentic heritage products from the local environment'
                  }
                </p>

                <div className="space-y-3 mb-6 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-olive-600 rounded-full"></span>
                    {language === 'ar' ? 'منتجات تراثية أصيلة' : 'Authentic Heritage Products'}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-olive-600 rounded-full"></span>
                    {language === 'ar' ? 'جودة عالية مضمونة' : 'Guaranteed High Quality'}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-olive-600 rounded-full"></span>
                    {language === 'ar' ? 'منتجات محلية' : 'Local Products'}
                  </div>
                </div>

                <Button 
                  className="w-full bg-olive-600 hover:bg-olive-700 group-hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                </Button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-olive-100 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-olive-200 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-300"></div>
            </div>

            {/* Cilka */}
            <div 
              className="group relative bg-white rounded-3xl shadow-soft hover:shadow-soft-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => handleStoreSelection('cilka')}
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <img
                                      src="photo\8.png"
                    alt="Cilka Store"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Cilka
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {language === 'ar' 
                    ? 'متجر عصري يقدم تشكيلة واسعة من المنتجات المتنوعة والحديثة'
                    : 'A modern store offering a wide variety of diverse and contemporary products'
                  }
                </p>

                <div className="space-y-3 mb-6 text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {language === 'ar' ? 'تشكيلة واسعة ومتنوعة' : 'Wide & Diverse Selection'}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {language === 'ar' ? 'منتجات حديثة' : 'Modern Products'}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {language === 'ar' ? 'خدمة ممتازة' : 'Excellent Service'}
                  </div>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 group-hover:scale-105 transition-all duration-300"
                  size="lg"
                >
                  {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                </Button>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-blue-100 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-blue-200 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-300"></div>
            </div>

          </div>
        </div>

        {/* Info */}
        <div className="text-center mt-16">
          <p className="text-gray-500">
            {language === 'ar' 
              ? 'يمكنك تغيير المتجر في أي وقت من إعدادات الحساب'
              : 'You can change your store selection anytime from account settings'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoreSelection;
