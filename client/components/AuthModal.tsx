import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const { t, isRTL } = useLanguage();
  const { login, signup, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!formData.name.trim()) {
        setError('Name is required');
        return;
      }
    }

    try {
      let success = false;
      if (activeTab === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        success = await signup(formData.email, formData.password, formData.name);
      }

      if (success) {
        onClose();
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-soft-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeTab === 'login' ? t('auth.login') : t('auth.signup')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-olive-600 border-b-2 border-olive-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('auth.login')}
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'signup'
                ? 'text-olive-600 border-b-2 border-olive-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('auth.signup')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`${isRTL ? 'pr-10' : 'pl-10'}`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'login' && (
            <div className="text-end">
              <button
                type="button"
                className="text-sm text-olive-600 hover:text-olive-700"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-olive-600 hover:bg-olive-700"
            disabled={isLoading}
          >
            {isLoading ? t('general.loading') : (activeTab === 'login' ? t('auth.login') : t('auth.signup'))}
          </Button>

          <div className="text-center text-sm text-gray-600">
            {activeTab === 'login' ? (
              <>
                {t('auth.noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-olive-600 hover:text-olive-700 font-medium"
                >
                  {t('auth.signup')}
                </button>
              </>
            ) : (
              <>
                {t('auth.hasAccount')}{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-olive-600 hover:text-olive-700 font-medium"
                >
                  {t('auth.login')}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
