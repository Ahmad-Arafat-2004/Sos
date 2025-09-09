import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    
    // Homepage
    'hero.title': 'Authentic Middle Eastern Flavors',
    'hero.subtitle': 'Premium traditional foods delivered fresh to your door',
    'hero.cta': 'Shop Now',
    'featured.title': 'Featured Products',
    'categories.title': 'Shop by Category',
    'categories.dairy': 'Dairy Products',
    'categories.spices': 'Spices & Herbs',
    'categories.oils': 'Premium Oils',
    'categories.beverages': 'Traditional Beverages',
    
    // Products
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.price': 'Price',
    'product.description': 'Description',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.remove': 'Remove',
    'cart.quantity': 'Quantity',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // General
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.success': 'Success!',
    'general.close': 'Close',
    'general.cancel': 'Cancel',
    'general.confirm': 'Confirm',
    'general.save': 'Save',
    'general.edit': 'Edit',
    'general.delete': 'Delete',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.cart': 'السلة',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    
    // Homepage
    'hero.title': 'نكهات شرق أوسطية أصيلة',
    'hero.subtitle': 'أطعمة تراثية فاخرة تُسلّم طازجة إلى باب منزلك',
    'hero.cta': 'تسوق الآن',
    'featured.title': 'المنتجات المميزة',
    'categories.title': 'تسوق حسب الفئة',
    'categories.dairy': 'منتجات الألبان',
    'categories.spices': 'البهارات والأعشاب',
    'categories.oils': 'الزيوت الفاخرة',
    'categories.beverages': 'المشروبات التراثية',
    
    // Products
    'product.addToCart': 'أضف للسلة',
    'product.buyNow': 'اشتر الآن',
    'product.price': 'السعر',
    'product.description': 'الوصف',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلة التسوق فارغة',
    'cart.total': 'المجموع',
    'cart.checkout': 'إتمام الطلب',
    'cart.remove': 'إزالة',
    'cart.quantity': 'الكمية',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.signup': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.hasAccount': 'لديك حساب بالفعل؟',
    
    // General
    'general.loading': 'جاري التحميل...',
    'general.error': 'حدث خطأ',
    'general.success': 'نجح!',
    'general.close': 'إغلاق',
    'general.cancel': 'إلغاء',
    'general.confirm': 'تأكيد',
    'general.save': 'حفظ',
    'general.edit': 'تحرير',
    'general.delete': 'حذف',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
