import { Request, Response } from "express";
import { supabase, shouldSkipSupabase } from "../lib/supabase";

export const debugDeleteFirstProduct = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) {
      return res
        .status(400)
        .json({ success: false, error: "Supabase not configured" });
    }

    // fetch first product
    const { data: first, error: fetchErr } = await supabase
      .from("products")
      .select("id, name_en")
      .limit(1)
      .single();
    if (fetchErr) {
      return res.status(400).json({ success: false, error: fetchErr.message });
    }

    if (!first || !first.id) {
      return res.json({ success: true, message: "No product found to delete" });
    }

    const { error: delErr } = await supabase
      .from("products")
      .delete()
      .eq("id", first.id);
    if (delErr) {
      return res.status(400).json({ success: false, error: delErr.message });
    }

    return res.json({
      success: true,
      message: "Deleted product",
      id: first.id,
      name: first.name_en,
    });
  } catch (e) {
    console.error("debugDeleteFirstProduct error", e);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
