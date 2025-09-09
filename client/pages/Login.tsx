import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Login: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        if (formData.email.toLowerCase() === "admin@irthbiladi.com") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      setError(
        language === "ar"
          ? "حدث خطأ. حاول مرة أخرى."
          : "An error occurred. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 to-olive-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center text-olive-600 hover:text-olive-700 mb-8 group"
        >
          <ArrowLeft
            className={`w-4 h-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"} group-hover:${isRTL ? "translate-x-1" : "-translate-x-1"} transition-transform`}
          />
          <span>{language === "ar" ? "العودة للرئيسية" : "Back to Home"}</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-soft-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-olive-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {language === "ar" ? "ط" : "T"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("auth.login")}
            </h1>
            <p className="text-gray-600">
              {language === "ar"
                ? "أهلاً بك مرة أخرى في طعام التراث"
                : "Welcome back to Turath Foods"}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t("auth.email")}
              </Label>
              <div className="relative">
                <Mail
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? "right-3" : "left-3"}`}
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-12 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} border-gray-200 focus:border-olive-400 focus:ring-olive-400`}
                  placeholder={
                    language === "ar"
                      ? "أدخل بريدك الإلكتروني"
                      : "Enter your email"
                  }
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? "right-3" : "left-3"}`}
                />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-12 ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} border-gray-200 focus:border-olive-400 focus:ring-olive-400`}
                  placeholder={
                    language === "ar"
                      ? "أدخل كلمة المرور"
                      : "Enter your password"
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? "left-3" : "right-3"}`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className={`${isRTL ? "text-left" : "text-right"}`}>
              <button
                type="button"
                className="text-olive-600 hover:text-olive-700 text-sm font-medium"
              >
                {t("auth.forgotPassword")}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-olive-600 hover:bg-olive-700 text-white font-medium text-lg rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {t("general.loading")}
                </div>
              ) : (
                t("auth.login")
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {language === "ar" ? "أو" : "or"}
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t("auth.noAccount")}{" "}
                <Link
                  to="/signup"
                  className="text-olive-600 hover:text-olive-700 font-medium"
                >
                  {t("auth.signup")}
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="w-8 h-8 bg-olive-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-olive-600 text-sm">🔒</span>
            </div>
            <p className="text-xs text-gray-600">
              {language === "ar" ? "آمن ومحمي" : "Secure"}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="w-8 h-8 bg-olive-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-olive-600 text-sm">⚡</span>
            </div>
            <p className="text-xs text-gray-600">
              {language === "ar" ? "سريع" : "Fast"}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="w-8 h-8 bg-olive-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-olive-600 text-sm">✨</span>
            </div>
            <p className="text-xs text-gray-600">
              {language === "ar" ? "سهل" : "Easy"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
