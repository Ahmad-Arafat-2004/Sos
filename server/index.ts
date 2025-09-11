import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { testDatabase } from "./routes/test-db";
import { quickLogin } from "./routes/quick-login";
import { setupDatabase } from "./routes/setup-db";
import { seedAdmin } from "./routes/seed-admin";
import { seedProducts } from "./routes/seed-products";

// Import all route handlers
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./routes/products";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./routes/categories";

import {
  register,
  login,
  getProfile,
  updateProfile,
  refreshToken,
  logout,
} from "./routes/auth";

import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "./routes/orders";

import {
  getDashboardStats,
  getRecentActivity,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "./routes/admin";

// Import middleware
import { authenticate, requireAdmin, optionalAuth } from "./middleware/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Basic API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/test-db", testDatabase);
  app.post("/api/quick-login", quickLogin);
  app.post("/api/setup-db", setupDatabase);
  app.get("/api/setup-admin", seedAdmin);
  // Seed products and categories for dev
  app.get("/api/seed-products", seedProducts);
  app.get("/api/inspect-products", (req, res) => import('./routes/inspect').then(m => m.inspectProducts(req, res)));
  app.post("/api/debug/delete-first-product", (req, res) => import('./routes/debug-delete').then(m => m.debugDeleteFirstProduct(req, res)));
  app.post("/api/debug/run-tests", (req, res) => import('./routes/debug-run-tests').then(m => m.debugRunTests(req, res)));

  // Auth routes (public)
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/refresh", refreshToken);
  app.post("/api/auth/logout", logout);

  // Protected auth routes
  app.get("/api/auth/profile", authenticate, getProfile);
  app.put("/api/auth/profile", authenticate, updateProfile);

  // Products routes (public for reading, protected for writing)
  app.get("/api/products", optionalAuth, getProducts);
  app.get("/api/products/:id", optionalAuth, getProductById);
  app.post("/api/products", authenticate, requireAdmin, createProduct);
  app.put("/api/products/:id", authenticate, requireAdmin, updateProduct);
  app.delete("/api/products/:id", authenticate, requireAdmin, deleteProduct);

  // Categories routes (public for reading, protected for writing)
  app.get("/api/categories", optionalAuth, getCategories);
  app.post("/api/categories", authenticate, requireAdmin, createCategory);
  app.put("/api/categories/:id", authenticate, requireAdmin, updateCategory);
  app.delete("/api/categories/:id", authenticate, requireAdmin, deleteCategory);

  // Orders routes (protected)
  app.post("/api/orders", authenticate, createOrder);
  app.get("/api/orders", authenticate, getUserOrders);
  app.get("/api/orders/:id", authenticate, getOrderById);

  // Contact form endpoint (public)
  app.post("/api/contact", (req, res) => import('./routes/contact').then(m => m.handleContact(req, res)));

  // Admin-only order routes
  app.get("/api/admin/orders", authenticate, requireAdmin, getAllOrders);
  app.put(
    "/api/admin/orders/:id/status",
    authenticate,
    requireAdmin,
    updateOrderStatus,
  );

  // Admin routes (admin-only)
  app.get("/api/admin/stats", authenticate, requireAdmin, getDashboardStats);
  app.get("/api/admin/activity", authenticate, requireAdmin, getRecentActivity);
  app.get("/api/admin/users", authenticate, requireAdmin, getAllUsers);
  app.put(
    "/api/admin/users/:id/role",
    authenticate,
    requireAdmin,
    updateUserRole,
  );
  app.delete("/api/admin/users/:id", authenticate, requireAdmin, deleteUser);

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error("Server error:", err);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    },
  );

  // 404 handler for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
    });
  });

  return app;
}
