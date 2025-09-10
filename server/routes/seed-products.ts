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

    // Insert products (resilient to schema differences)
    for (const p of products) {
      const category = catsBySlug[p.category_slug];
      if (!category) {
        return res.status(400).json({ success: false, error: `Missing category ${p.category_slug}` });
      }

      // Build insert object with fields we expect are present
      const insertObj: any = {
        name_en: p.name_en,
        name_ar: p.name_ar,
        description_en: p.description_en,
        description_ar: p.description_ar,
        price: p.price,
        category_id: category.id,
        store: p.store,
      };

      // Try to avoid using slug/upsert which may not exist in schema cache
      try {
        // Check if product with same name_en already exists
        const { data: existing, error: checkErr } = await supabase
          .from('products')
          .select('id')
          .eq('name_en', p.name_en)
          .limit(1)
          .single();

        if (checkErr && checkErr.code !== 'PGRST116') {
          // If error other than not found, warn and continue
          console.warn('Product existence check error', checkErr.message);
        }

        if (!existing) {
          const { data: prod, error: prodErr } = await supabase
            .from('products')
            .insert(insertObj)
            .select()
            .single();

          if (prodErr) {
            console.error('Product insert error', p.name_en, prodErr);
            return res.status(400).json({ success: false, error: prodErr.message });
          }
        }
      } catch (e) {
        console.error('Product seed error', e);
        return res.status(500).json({ success: false, error: 'Failed seeding products' });
      }
    }

    return res.json({ success: true, message: 'Seed complete' });
  } catch (error) {
    console.error('Seed products error', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
