import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const SignUp: React.FC = () => {
  const { t, language, isRTL } = useLanguage();
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(
        language === "ar"
          ? "كلمات المرور غير متطابقة"
          : "Passwords do not match",
      );
      return;
    }

    if (formData.password.length < 6) {
      setError(
        language === "ar"
          ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
          : "Password must be at least 6 characters",
      );
      return;
    }

    if (!formData.name.trim()) {
      setError(language === "ar" ? "الاسم مطلوب" : "Name is required");
      return;
    }

    try {
      const result = await signup(
        formData.email,
        formData.password,
        formData.name,
      );
      if (result.success) {
        navigate("/");
      } else {
        // Show specific server message when user already exists
        if (
          result.error &&
          result.error.toLowerCase().includes("user already exists")
        ) {
          setError(
            language === "ar" ? "هذا المستخدم موجود" : "User already exists",
          );
        } else {
          setError(
            result.error ||
              (language === "ar"
                ? "فشل إنشاء الحساب. حاول مرة أخرى."
                : "Failed to create account. Please try again."),
          );
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

        {/* Sign Up Card */}
        <div className="bg-white rounded-3xl shadow-soft-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-olive-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">
                {language === "ar" ? "ط" : "I"}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("auth.signup")}
            </h1>
            <p className="text-gray-600">
              {language === "ar"
                ? "انضم إلى عائلة طعام التراث اليوم"
                : "Join the Irth Biladi family today"}
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">
                {language === "ar" ? "الاسم الكامل" : "Full Name"}
              </Label>
              <div className="relative">
                <User
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? "right-3" : "left-3"}`}
                />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`h-12 ${isRTL ? "pr-12 pl-4" : "pl-12 pr-4"} border-gray-200 focus:border-olive-400 focus:ring-olive-400`}
                  placeholder={
                    language === "ar"
                      ? "أدخل اسمك الكامل"
                      : "Enter your full name"
                  }
                  required
                />
              </div>
            </div>

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
                      ? "أدخل كلمة مرور قوية"
                      : "Enter a strong password"
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
              <p className="text-xs text-gray-500">
                {language === "ar"
                  ? "6 أحرف على الأقل"
                  : "At least 6 characters"}
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                {t("auth.confirmPassword")}
              </Label>
              <div className="relative">
                <Lock
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${isRTL ? "right-3" : "left-3"}`}
                />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`h-12 ${isRTL ? "pr-12 pl-12" : "pl-12 pr-12"} border-gray-200 focus:border-olive-400 focus:ring-olive-400`}
                  placeholder={
                    language === "ar"
                      ? "أعد كتابة كلمة المرور"
                      : "Confirm your password"
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? "left-3" : "right-3"}`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 rtl:space-x-reverse">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-olive-600 border-gray-300 rounded focus:ring-olive-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                {language === "ar" ? (
                  <>
                    أوافق على{" "}
                    <span className="text-olive-600 hover:underline cursor-pointer">
                      الشروط والأحكام
                    </span>{" "}
                    و{" "}
                    <span className="text-olive-600 hover:underline cursor-pointer">
                      سياسة الخصوصية
                    </span>
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <span className="text-olive-600 hover:underline cursor-pointer">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-olive-600 hover:underline cursor-pointer">
                      Privacy Policy
                    </span>
                  </>
                )}
              </label>
            </div>

            {/* Sign Up Button */}
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
                t("auth.signup")
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t("auth.hasAccount")}{" "}
                <Link
                  to="/login"
                  className="text-olive-600 hover:text-olive-700 font-medium"
                >
                  {t("auth.login")}
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {language === "ar" ? "مزايا الانضمام إلينا" : "Join Our Community"}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-olive-100 rounded-lg flex items-center justify-center">
                <span className="text-olive-600">🎁</span>
              </div>
              <span className="text-sm text-gray-700">
                {language === "ar"
                  ? "خصومات حصرية للأعضاء"
                  : "Exclusive member discounts"}
              </span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-olive-100 rounded-lg flex items-center justify-center">
                <span className="text-olive-600">🚚</span>
              </div>
              <span className="text-sm text-gray-700">
                {language === "ar"
                  ? "توصيل مجاني للطلبات الكبيرة"
                  : "Free delivery on large orders"}
              </span>
            </div>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-8 h-8 bg-olive-100 rounded-lg flex items-center justify-center">
                <span className="text-olive-600">⭐</span>
              </div>
              <span className="text-sm text-gray-700">
                {language === "ar"
                  ? "نقاط مكافآت على كل عملية شراء"
                  : "Loyalty points on every purchase"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
