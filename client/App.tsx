import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { AdminProvider } from "./contexts/AdminContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { StoreProvider } from "./contexts/StoreContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AppWithNotification } from "./components/AppWithNotification";
import Header from "./components/Header";
import { LoadingProvider } from './contexts/LoadingContext';
import TopProgressBar from './components/TopProgressBar';
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import StoreSelection from "./pages/StoreSelection";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AdminGuard from "./components/AdminGuard";
import NotFound from "./pages/NotFound";

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-screen bg-olive-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">
        This page is coming soon. Continue prompting to have me build out this
        section.
      </p>
      <div className="bg-white rounded-lg p-6 shadow-soft">
        <p className="text-sm text-gray-500">
          Available pages: Homepage (completed), Products, Categories, Cart,
          Checkout, About, Contact
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <NotificationProvider>
      <AppWithNotification>
        <LanguageProvider>
          <StoreProvider>
            <AuthProvider>
              <CartProvider>
                <FavoritesProvider>
                  <AdminProvider>
                    <BrowserRouter>
                      <LoadingProvider>
                        <TopProgressBar />
                        <Routes>
                          {/* Auth pages without header */}
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<SignUp />} />

                          {/* Admin routes without header */}
                          <Route
                            path="/admin"
                            element={
                              <AdminGuard>
                                <AdminDashboard />
                              </AdminGuard>
                            }
                          />
                          <Route
                            path="/Admin"
                            element={
                              <AdminGuard>
                                <AdminDashboard />
                              </AdminGuard>
                            }
                          />

                          {/* Regular pages with header */}
                          <Route
                            path="*"
                            element={
                              <div className="min-h-screen bg-background">
                                <Header />
                                <main>
                                  <Routes>
                                    <Route path="/" element={<Index />} />
                                    <Route
                                      path="/store-selection"
                                      element={<StoreSelection />}
                                    />
                                    <Route
                                      path="/products"
                                      element={<Products />}
                                    />
                                    <Route
                                      path="/favorites"
                                      element={<Favorites />}
                                    />
                                    <Route path="/cart" element={<Cart />} />
                                    <Route
                                      path="/checkout"
                                      element={<Checkout />}
                                    />
                                    <Route
                                      path="/profile"
                                      element={<Profile />}
                                    />
                                    <Route
                                      path="/orders"
                                      element={<OrderHistory />}
                                    />
                                    <Route path="/about" element={<About />} />
                                    <Route
                                      path="/contact"
                                      element={<Contact />}
                                    />
                                    <Route path="*" element={<NotFound />} />
                                  </Routes>
                                </main>
                              </div>
                            }
                          />
                        </Routes>
                      </LoadingProvider>
                    </BrowserRouter>
                  </AdminProvider>
                </FavoritesProvider>
              </CartProvider>
            </AuthProvider>
          </StoreProvider>
        </LanguageProvider>
      </AppWithNotification>
    </NotificationProvider>
  );
}

export default App;
