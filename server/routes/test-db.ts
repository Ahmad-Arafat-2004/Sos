import { Request, Response } from 'express';
import { supabase, shouldSkipSupabase } from '../lib/supabase';

export const testDatabase = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) {
      return res.json({
        success: false,
        error: 'Supabase not configured',
        configured: false
      });
    }

    // اختبار الاتصال
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      return res.json({
        success: false,
        error: 'Tables not created yet. Please run the SQL schema first.',
        details: error.message,
        configured: true,
        needsSchema: true
      });
    }

    return res.json({
      success: true,
      message: 'Database connected successfully!',
      configured: true,
      needsSchema: false,
      data: data
    });

  } catch (error) {
    return res.json({
      success: false,
      error: 'Connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      configured: true
    });
  }
};
