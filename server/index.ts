import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
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
import { supabase } from "./lib/supabase";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  // Increase body parser limits to allow data URLs for image uploads
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb", parameterLimit: 100000 }));

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
  app.get("/api/inspect-products", (req, res) =>
    import("./routes/inspect").then((m) => m.inspectProducts(req, res)),
  );

  // Settings routes (lazy import)
  import("./routes/settings").then((m) => m.default(app)).catch(() => {});
  app.post("/api/debug/delete-first-product", (req, res) =>
    import("./routes/debug-delete").then((m) =>
      m.debugDeleteFirstProduct(req, res),
    ),
  );
  app.post("/api/debug/run-tests", (req, res) =>
    import("./routes/debug-run-tests").then((m) => m.debugRunTests(req, res)),
  );

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

  // Settings endpoints for delivery fee
  app.get("/api/settings/delivery_fee", async (_req, res) => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "delivery_fee")
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("settings.get.error", error);
        return res.status(500).json({ success: false, error: "Failed to fetch settings" });
      }

      const value = data?.value ?? null;
      const amount = value && typeof value === "object" ? value.amount : null;

      return res.json({ success: true, data: { delivery_fee: amount ?? 0 } });
    } catch (err) {
      console.error("settings.get.exception", err);
      return res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  app.put(
    "/api/settings/delivery_fee",
    authenticate,
    requireAdmin,
    async (req, res) => {
      try {
        const { amount } = req.body as { amount?: number };
        if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
          return res.status(400).json({ success: false, error: "Invalid amount" });
        }

        const payload = { key: "delivery_fee", value: { amount } };

        const { data, error } = await supabase
          .from("settings")
          .upsert(payload, { onConflict: "key" })
          .select()
          .single();

        if (error) {
          console.error("settings.update.error", error);
          return res.status(500).json({ success: false, error: error.message });
        }

        return res.json({ success: true, data: { delivery_fee: amount } });
      } catch (err) {
        console.error("settings.update.exception", err);
        return res.status(500).json({ success: false, error: "Internal server error" });
      }
    },
  );

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
  app.post("/api/contact", (req, res) =>
    import("./routes/contact").then((m) => m.handleContact(req, res)),
  );

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
