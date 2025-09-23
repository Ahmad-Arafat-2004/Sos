import { Request, Response } from "express";
import { supabase, shouldSkipSupabase } from "../lib/supabase";

export const setupDatabase = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) {
      return res.json({
        success: false,
        error: "Supabase not configured",
      });
    }

    // إنشاء مستخدم أدمن مباشرة (بدون مصادقة Supabase Auth)
    // Use a valid UUID for the admin user id so it matches DB uuid column
    const { randomUUID } = await import("crypto");
    const adminUser = {
      id: randomUUID(),
      email: "admin@irthbiladi.com",
      name: "مدير النظام",
      role: "admin",
    };

    // Try to insert admin user, but skip if an account with the same email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", adminUser.email)
      .single();

    let userData: any = null;

    if (existingUser) {
      userData = existingUser;
    } else {
      const { data: createdUser, error: userError } = await supabase
        .from("users")
        .insert(adminUser)
        .select()
        .single();

      if (userError) {
        console.error("User creation error:", userError);
        return res.json({
          success: false,
          error: "Failed to create admin user",
          details: userError.message,
          needsSchema: true,
        });
      }

      userData = createdUser;
    }

    // اختبار إنشاء فئة
    const testCategory = {
      name_en: "Test Category",
      name_ar: "فئة تجريبية",
      description_en: "Test category description",
      description_ar: "وصف فئة تجريبية",
      slug: "test-category",
    };

    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .upsert(testCategory)
      .select()
      .single();

    if (categoryError) {
      console.error("Category creation error:", categoryError);
      return res.json({
        success: false,
        error: "Failed to create test category",
        details: categoryError.message,
        user_created: true,
      });
    }

    return res.json({
      success: true,
      message: "Database setup complete!",
      data: {
        user: userData,
        category: categoryData,
      },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return res.json({
      success: false,
      error: "Setup failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
