import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';

const AdminHint: React.FC = () => {
  const [showHint, setShowHint] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.shiftKey && event.ctrlKey && event.key === 'A') {
        event.preventDefault();
        window.location.href = '/login';
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      {/* Floating Admin Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setShowHint(true)}
          className="w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 shadow-lg"
          title={language === 'ar' ? 'لوحة التحكم' : 'Admin Access'}
        >
          <Shield className="w-5 h-5" />
        </Button>
      </div>

      {/* Admin Access Modal */}
      {showHint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-olive-600" />
                {language === 'ar' ? 'الوصول للإدارة' : 'Admin Access'}
              </h3>
              <button
                onClick={() => setShowHint(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-olive-50 border border-olive-200 rounded-lg p-4">
                <h4 className="font-medium text-olive-800 mb-2">
                  {language === 'ar' ? 'طرق الوصول:' : 'Access Methods:'}
                </h4>
                <ul className="space-y-2 text-sm text-olive-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-olive-600 rounded-full mr-2"></span>
                    {language === 'ar'
                      ? 'اضغط: Shift + Ctrl + A'
                      : 'Press: Shift + Ctrl + A'
                    }
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-olive-600 rounded-full mr-2"></span>
                    {language === 'ar'
                      ? 'أو سجل دخول بحساب الأدمن'
                      : 'Or login with admin credentials'
                    }
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">
                  {language === 'ar' ? 'مميزات لوحة التحكم:' : 'Dashboard Features:'}
                </h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• {language === 'ar' ? 'إضافة/تعديل/حذف المنتجات' : 'Add/Edit/Delete Products'}</li>
                  <li>• {language === 'ar' ? 'إدارة الطلبات' : 'Manage Orders'}</li>
                  <li>• {language === 'ar' ? 'مشاهدة الإحصائيات' : 'View Statistics'}</li>
                  <li>• {language === 'ar' ? 'متابعة العملاء' : 'Track Customers'}</li>
                </ul>
              </div>
              
              <div className="flex gap-2">
                <a
                  href="/login"
                  className="flex-1 bg-olive-600 hover:bg-olive-700 text-white text-center py-2 px-4 rounded-lg font-medium"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </a>
                <Button
                  variant="outline"
                  onClick={() => setShowHint(false)}
                  className="px-4"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHint;
