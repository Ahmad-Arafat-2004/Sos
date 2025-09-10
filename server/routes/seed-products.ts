import { Request, Response } from 'express';
import { supabase, shouldSkipSupabase } from '../lib/supabase';

export const seedProducts = async (req: Request, res: Response) => {
  try {
    if (shouldSkipSupabase()) {
      return res.status(400).json({ success: false, error: 'Supabase not configured' });
    }

    // Define categories to ensure
    const categories = [
      {
        slug: 'coffee-tea',
        name_en: 'Coffee & Tea',
        name_ar: 'قهوة وشاي',
        description_en: 'Various coffees and teas',
        description_ar: 'أنواع القهوة والشاي'
      },
      {
        slug: 'dairy-cheese',
        name_en: 'Dairy & Cheese',
        name_ar: 'ألبان وأجبان',
        description_en: 'Dairy products and cheeses',
        description_ar: 'منتجات الألبان والأجبان'
      }
    ];

    // Upsert categories
    for (const c of categories) {
      const { data: cat, error: catErr } = await supabase
        .from('categories')
        .upsert({ slug: c.slug, name_en: c.name_en, name_ar: c.name_ar, description_en: c.description_en, description_ar: c.description_ar }, { onConflict: 'slug' })
        .select()
        .single();

      if (catErr) {
        console.error('Category upsert error', c.slug, catErr);
        return res.status(400).json({ success: false, error: catErr.message });
      }
    }

    // Fetch categories map
    const { data: catsData, error: catsFetchErr } = await supabase.from('categories').select('*');
    if (catsFetchErr) return res.status(400).json({ success: false, error: catsFetchErr.message });

    const catsBySlug: Record<string, any> = {};
    (catsData || []).forEach((row: any) => (catsBySlug[row.slug] = row));

    // Define products to insert
    const products = [
      {
        name_en: 'Turath Coffee Blend',
        name_ar: 'خليط قهوة تراث',
        description_en: 'A rich, aromatic coffee blend sourced locally.',
        description_ar: 'خليط قهوة غني وعطري من مصادر محلية.',
        price: 12.5,
        category_slug: 'coffee-tea',
        inventory: 100,
        images: JSON.stringify([]),
        slug: 'turath-coffee-blend',
        store: 'irth-biladi'
      },
      {
        name_en: 'Local Labneh',
        name_ar: 'لبنة محلية',
        description_en: 'Creamy labneh made from fresh milk.',
        description_ar: 'لبنة كريمية مصنوعة من حليب طازج.',
        price: 6.0,
        category_slug: 'dairy-cheese',
        inventory: 50,
        images: JSON.stringify([]),
        slug: 'local-labneh',
        store: 'irth-biladi'
      }
    ];

    // Upsert products
    for (const p of products) {
      const category = catsBySlug[p.category_slug];
      if (!category) {
        return res.status(400).json({ success: false, error: `Missing category ${p.category_slug}` });
      }

      const insertObj = {
        name_en: p.name_en,
        name_ar: p.name_ar,
        description_en: p.description_en,
        description_ar: p.description_ar,
        price: p.price,
        category_id: category.id,
        inventory: p.inventory,
        slug: p.slug,
        store: p.store
      };

      const { data: prod, error: prodErr } = await supabase
        .from('products')
        .upsert(insertObj, { onConflict: 'slug' })
        .select()
        .single();

      if (prodErr) {
        console.error('Product upsert error', p.slug, prodErr);
        return res.status(400).json({ success: false, error: prodErr.message });
      }
    }

    return res.json({ success: true, message: 'Seed complete' });
  } catch (error) {
    console.error('Seed products error', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
