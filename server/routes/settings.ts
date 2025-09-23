import { Application, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { authenticate, requireAdmin } from "../middleware/auth";

export default function registerSettingsRoutes(app: Application) {
  // Get delivery fee (public)
  app.get(
    "/api/settings/delivery_fee",
    async (_req: Request, res: Response) => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "delivery_fee")
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "Row not found" in some setups; treat as missing
          console.error("settings.get.error", error);
          return res
            .status(500)
            .json({ success: false, error: "Failed to fetch settings" });
        }

        const value = data?.value ?? null;
        const amount = value && typeof value === "object" ? value.amount : null;

        return res.json({ success: true, data: { delivery_fee: amount ?? 0 } });
      } catch (err) {
        console.error("settings.get.exception", err);
        return res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    },
  );

  // Update delivery fee (admin only)
  app.put(
    "/api/settings/delivery_fee",
    authenticate,
    requireAdmin,
    async (req: Request, res: Response) => {
      try {
        const { amount } = req.body as { amount?: number };
        if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid amount" });
        }

        // Upsert into settings table
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
        return res
          .status(500)
          .json({ success: false, error: "Internal server error" });
      }
    },
  );
}
