import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const AdminLogin: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('admin@irthbiladi.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError(language === 'ar' ? 'خطأ في البيانات' : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-olive-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-soft-lg max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-olive-800 font-arabic">
            {language === 'ar' ? 'دخول الأدمن' : 'Admin Login'}
          </h1>
          <p className="text-olive-600 mt-2 font-arabic">
            {language === 'ar' ? 'يرجى تسجيل الدخول للوصول إلى لوحة الإدارة' : 'Please login to access the admin dashboard'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="font-arabic">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 font-arabic"
              placeholder="admin@irthbiladi.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="font-arabic">
              {language === 'ar' ? 'كلمة المرور' : 'Password'}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 font-arabic"
              placeholder="admin123"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-arabic">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-olive-600 hover:bg-olive-700 text-white font-arabic"
          >
            {isLoading 
              ? (language === 'ar' ? 'جارٍ تسجيل الدخول...' : 'Logging in...') 
              : (language === 'ar' ? 'تسجيل ا��دخول' : 'Login')
            }
          </Button>
        </form>

        <div className="mt-6 p-4 bg-olive-50 rounded-lg">
          <p className="text-sm text-olive-700 font-arabic">
            <strong>{language === 'ar' ? 'معلومات التجربة:' : 'Demo Credentials:'}</strong>
          </p>
          <p className="text-sm text-olive-600 font-arabic mt-1">
            Email: admin@irthbiladi.com
          </p>
          <p className="text-sm text-olive-600 font-arabic">
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
};
