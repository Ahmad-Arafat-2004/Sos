import { Request, Response } from 'express';
import { supabase, shouldSkipSupabase } from '../lib/supabase';

export const debugRunTests = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) return res.status(400).json({ success: false, error: 'Supabase not configured' });

    const results: any[] = [];

    // Ensure categories
    const categories = [
      { slug: 'coffee-tea', name_en: 'Coffee & Tea', name_ar: 'قهوة وشاي' },
      { slug: 'dairy-cheese', name_en: 'Dairy & Cheese', name_ar: 'ألبان وأجبان' }
    ];

    for (const c of categories) {
      const { data: cat, error: catErr } = await supabase
        .from('categories')
        .upsert({ slug: c.slug, name_en: c.name_en, name_ar: c.name_ar }, { onConflict: 'slug' })
        .select()
        .single();

      results.push({ action: 'ensure_category', slug: c.slug, ok: !catErr, error: catErr ? catErr.message : undefined, data: cat });
    }

    // Create a test product
    const { data: catsData } = await supabase.from('categories').select('*');
    const coffeeCat = (catsData || []).find((r: any) => r.slug === 'coffee-tea');
    if (!coffeeCat) return res.status(500).json({ success: false, error: 'Category missing after upsert' });

    const productInsert: any = {
      name_en: 'Debug Runner Product',
      name_ar: 'منتج تصحيح',
      description_en: 'Debug description EN',
      description_ar: 'وصف التصحيح',
      price: 9.99,
      category_id: coffeeCat.id,
      image: null,
      store: 'irth-biladi'
    };

    // If slug column exists, include it
    try {
      const { data: sampleRow } = await supabase.from('products').select('slug').limit(1).single();
      if (sampleRow && Object.prototype.hasOwnProperty.call(sampleRow, 'slug')) {
        productInsert.slug = `debug-run-product-${Date.now()}`;
      }
    } catch (e) {
      // ignore if column doesn't exist
    }

    const { data: createdProd, error: createErr } = await supabase
      .from('products')
      .insert(productInsert)
      .select()
      .single();

    results.push({ action: 'create_product', ok: !createErr, error: createErr ? createErr.message : undefined, data: createdProd });

    if (createErr || !createdProd) return res.status(500).json({ success: false, error: 'Failed to create debug product', details: createErr ? createErr.message : null, results });

    // Update product
    const newPrice = (createdProd.price || 0) + 1.01;
    const { data: updatedProd, error: updateErr } = await supabase
      .from('products')
      .update({ price: newPrice, description_en: 'Updated by debug', description_ar: 'تم التحديث بواسطة debug' })
      .eq('id', createdProd.id)
      .select()
      .single();

    results.push({ action: 'update_product', ok: !updateErr, error: updateErr ? updateErr.message : undefined, data: updatedProd });

    // Verify update
    const { data: verify, error: verifyErr } = await supabase
      .from('products')
      .select('*')
      .eq('id', createdProd.id)
      .single();

    results.push({ action: 'verify_product', ok: !verifyErr && verify && verify.price === newPrice, error: verifyErr ? verifyErr.message : undefined, data: verify });

    // Delete product
    const { error: delErr } = await supabase.from('products').delete().eq('id', createdProd.id);
    results.push({ action: 'delete_product', ok: !delErr, error: delErr ? delErr.message : undefined });

    // Category update test
    // Pick dairy-cheese
    const dairy = (catsData || []).find((r: any) => r.slug === 'dairy-cheese');
    if (dairy) {
      const { data: updatedCat, error: updCatErr } = await supabase
        .from('categories')
        .update({ description_en: 'Updated category by debug' })
        .eq('id', dairy.id)
        .select()
        .single();

      results.push({ action: 'update_category', ok: !updCatErr, error: updCatErr ? updCatErr.message : undefined, data: updatedCat });
    }

    return res.json({ success: true, message: 'Debug run completed', results });
  } catch (e) {
    console.error('debugRunTests.error', e);
    return res.status(500).json({ success: false, error: 'Internal error', details: e instanceof Error ? e.message : String(e) });
  }
};
