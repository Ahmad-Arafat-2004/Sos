import { supabase } from "../lib/supabase";

export class SettingsService {
  async getSetting(key: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", key)
        .single();
      if (error) {
        // if not found return null
        return null;
      }
      return data?.value ?? null;
    } catch (e) {
      return null;
    }
  }

  async setSetting(key: string, value: any): Promise<boolean> {
    try {
      const upsert = await supabase
        .from("settings")
        .upsert({ key, value }, { onConflict: "key" });
      if (upsert.error) return false;
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const settingsService = new SettingsService();
