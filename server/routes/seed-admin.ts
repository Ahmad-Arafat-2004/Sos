import { Request, Response } from "express";
import { supabase, shouldSkipSupabase } from "../lib/supabase";

export const seedAdmin = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) {
      return res
        .status(400)
        .json({ success: false, error: "Supabase not configured" });
    }

    const email = (req.query.email as string) || "admin@irthbiladi.com";
    const password = (req.query.password as string) || "admin123";
    const name = (req.query.name as string) || "Administrator";

    // Check if auth user exists
    const list = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    const existing = ((list.data?.users as any[]) || []).find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase(),
    );

    let userId = existing?.id;

    if (!existing) {
      const created = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name },
      });
      if (created.error || !created.data.user) {
        return res.status(400).json({
          success: false,
          error: created.error?.message || "Failed to create auth user",
        });
      }
      userId = created.data.user.id;
    } else {
      // Ensure password and email confirmed
      await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { name },
      });
    }

    if (!userId) {
      return res
        .status(500)
        .json({ success: false, error: "Could not resolve admin user id" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .upsert({ id: userId, email, name, role: "admin" }, { onConflict: "id" })
      .select()
      .single();

    if (profileError) {
      return res
        .status(400)
        .json({ success: false, error: profileError.message });
    }

    return res.json({
      success: true,
      message: "Admin user ensured",
      data: { id: userId, email, name, role: "admin", profile },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
