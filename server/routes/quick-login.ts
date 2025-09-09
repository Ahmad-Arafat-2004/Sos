import { Request, Response } from 'express';
import { supabase, shouldSkipSupabase } from '../lib/supabase';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const quickLogin = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) {
      return res.json({
        success: false,
        error: 'Supabase not configured'
      });
    }

    const { email, password } = req.body;

    // للتطوير: أي email/password يعمل
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required'
      });
    }

    // البحث عن المستخدم
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !userData) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    // إنشاء token
    const token = jwt.sign({ userId: userData.id }, JWT_SECRET, { expiresIn: '7d' });

    // إرجاع المستخدم مع token
    return res.json({
      success: true,
      data: {
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          created_at: userData.created_at,
          updated_at: userData.updated_at
        },
        token: token
      },
      message: 'Login successful'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
