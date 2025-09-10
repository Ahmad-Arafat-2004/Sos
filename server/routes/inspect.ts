import { Request, Response } from 'express';
import { supabase, shouldSkipSupabase } from '../lib/supabase';

export const inspectProducts = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) return res.status(400).json({ success: false, error: 'Supabase not configured' });

    const { data, error } = await supabase.from('products').select('*').limit(1);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    if (!data || data.length === 0) return res.json({ success: true, columns: [] });

    const row = data[0];
    return res.json({ success: true, columns: Object.keys(row), sample: row });
  } catch (e) {
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
};
