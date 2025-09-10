import { Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth';

const botPayloadSchema = z.object({
  customer_name: z.string().min(1),
  customer_email: z.string().optional(),
  shipping_address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  items: z.array(z.object({
    product_id: z.string().min(1),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1),
  total: z.number().positive().optional(),
});

export const sendToBot = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const validation = botPayloadSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation failed', details: validation.error.errors });
    }

    const webhook = process.env.BOT_WEBHOOK_URL;
    if (!webhook) {
      return res.status(400).json({ success: false, error: 'Bot webhook not configured (BOT_WEBHOOK_URL missing)' });
    }

    // Forward the payload to the bot webhook
    const resp = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validation.data,
        user_id: req.user.id,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return res.status(502).json({ success: false, error: 'Failed to send to bot', details: text || resp.statusText });
    }

    const data = await resp.json().catch(() => null);

    return res.json({ success: true, data });
  } catch (error: any) {
    console.error('bot.send.error', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
