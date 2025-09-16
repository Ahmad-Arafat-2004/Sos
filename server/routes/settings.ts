import { Request, Response } from "express";
import { settingsService } from "../services/settingsService";
import { authenticate, requireAdmin } from "../middleware/auth";

export const getSetting = async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const value = await settingsService.getSetting(key);
    return res.json({ success: true, data: value });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Failed to fetch setting" });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const key = req.params.key;
    const value = req.body.value;
    const ok = await settingsService.setSetting(key, value);
    if (!ok) return res.status(400).json({ success: false, error: "Failed to update setting" });
    return res.json({ success: true, data: value });
  } catch (e) {
    return res.status(500).json({ success: false, error: "Failed to update setting" });
  }
};

// Mount helpers (to be used in server/index.ts)
export default function mountSettings(app: any) {
  app.get("/api/settings/:key", getSetting);
  app.put("/api/settings/:key", authenticate, requireAdmin, updateSetting);
}
