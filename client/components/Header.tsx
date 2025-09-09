import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Globe,
  User,
  Heart,
  Settings,
  LogOut,
  Package,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useFavorites } from "../contexts/FavoritesContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "../lib/utils";

const Header: React.FC = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { totalItems, totalPrice } = useCart();
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Admin shortcut: Shift+Ctrl+A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey && e.key === "A") {
        // التحقق من حالة تسجيل دخول المدير
        const adminLoggedIn = localStorage.getItem("adminLoggedIn");
        if (adminLoggedIn === "true") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/admin/login";
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const navItems = [
    { key: "home", href: "/" },
    { key: "products", href: "/store-selection" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ];

  return (
    <header
      dir="ltr"
      className={cn("bg-white shadow-soft sticky top-0 z-50", "font-english")}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Ff2598ec770cc4f1e987b3ea464917627%2Fac0e2902ff1f49f88ca6bae765759e28?format=webp&width=800"
                alt="Irth Biladi Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span
              className="text-xl font-bold text-olive-800"
              style={{ margin: "-2px 0 0 8px" }}
            >
              {language === "ar" ? "إرث بلادي" : "Irth Biladi"}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 ml-16">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className="text-gray-700 hover:text-olive-600 transition-colors duration-200 font-medium"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Language Switcher */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center space-x-1 rtl:space-x-reverse"
            >
              <Globe className="w-4 h-4" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </Button>

            {/* User Actions */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt={user.name} />
                        <AvatarFallback className="bg-olive-100 text-olive-600">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56"
                    align={isRTL ? "start" : "end"}
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        <span>
                          {language === "ar" ? "الملف الشخصي" : "Profile"}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        <span>
                          {language === "ar" ? "طلباتي" : "My Orders"}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                      <span>{language === "ar" ? "خروج" : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-olive-600"
                  >
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="bg-olive-600 hover:bg-olive-700">
                    {t("nav.signup")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Favorites - Only show if user is logged in */}
            {user && (
              <Link to="/favorites" className="relative">
                <Button variant="outline" size="sm" className="relative p-2">
                  <Heart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -end-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="relative p-2">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -end-2 bg-olive-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
              {totalItems > 0 && (
                <div className="hidden sm:block absolute top-full mt-1 end-0 bg-white border rounded-lg shadow-lg p-2 whitespace-nowrap">
                  <span className="text-sm text-gray-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-olive-600 hover:bg-olive-50 rounded-md transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`nav.${item.key}`)}
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="w-full justify-start px-3 py-2 text-gray-700 hover:text-olive-600"
              >
                <Globe className="w-4 h-4 me-2" />
                {language === "en" ? "العربية" : "English"}
              </Button>

              {/* Mobile User Actions */}
              {user ? (
                <div className="px-3 py-2 border-t space-y-2">
                  <div className="flex items-center space-x-3 rtl:space-x-reverse p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-olive-100 text-olive-600">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                      {language === "ar" ? "الملف الشخصي" : "Profile"}
                    </Button>
                  </Link>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                      {language === "ar" ? "طلباتي" : "My Orders"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-600 hover:text-olive-600"
                  >
                    <LogOut className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                    {language === "ar" ? "خروج" : "Logout"}
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t space-y-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-olive-600 hover:bg-olive-700">
                      {t("nav.signup")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
