import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';

const NotFound: React.FC = () => {
  const { language, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-olive-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-32 h-32 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl font-bold text-olive-600">404</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {language === 'ar' 
              ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
              : 'Sorry, the page you are looking for does not exist or has been moved.'
            }
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full bg-olive-600 hover:bg-olive-700">
              <Home className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
          
          <Button
            variant="outline"
            className="w-full border-olive-600 text-olive-600 hover:bg-olive-50"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {language === 'ar' ? 'العودة للخلف' : 'Go Back'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
