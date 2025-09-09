import { Product } from '../contexts/CartContext';

export const products: Product[] = [
  // Dairy Products
  {
    id: 'labneh-1',
    name: {
      en: 'Traditional Labneh',
      ar: 'لبنة تراثية'
    },
    description: {
      en: 'Creamy, thick strained yogurt made from fresh goat milk. Perfect for breakfast with olive oil and za\'atar.',
      ar: 'لبنة كثيفة كريمية مصنوعة من حليب الماعز الطازج. مثالية للإفطار مع زيت الزيتون والزعتر.'
    },
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
    category: 'dairy',
    weight: '500g',
    store: 'irth-biladi'
  },
  {
    id: 'cheese-1',
    name: {
      en: 'Akkawi Cheese',
      ar: 'جبن عكاوي'
    },
    description: {
      en: 'Traditional white cheese with a mild, slightly salty flavor. Perfect for pastries and breakfast.',
      ar: 'جبن أبيض تراثي بطعم خفيف ومالح قليلاً. مثالي للمعجنات والإفطار.'
    },
    price: 15.50,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=300&fit=crop',
    category: 'dairy',
    weight: '400g',
    store: 'cilka'
  },
  {
    id: 'cheese-2',
    name: {
      en: 'Halloumi Cheese',
      ar: 'جبن حلوم'
    },
    description: {
      en: 'Semi-hard cheese perfect for grilling. Made from goat and sheep milk with a unique texture.',
      ar: 'جبن نصف صلب مثالي للشوي. مصنوع من حليب الماعز والغنم بقوام فريد.'
    },
    price: 18.75,
    image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?w=400&h=300&fit=crop',
    category: 'dairy',
    weight: '300g',
    store: 'irth-biladi'
  },

  // Spices & Herbs
  {
    id: 'zaatar-1',
    name: {
      en: 'Premium Za\'atar Blend',
      ar: 'خلطة زعتر فاخرة'
    },
    description: {
      en: 'Aromatic blend of wild thyme, sumac, sesame seeds, and salt. Perfect with olive oil and bread.',
      ar: 'خلطة عطرة من الزعتر البري والسماق وبذور السمسم والملح. مثالية مع زيت الزيتون والخبز.'
    },
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'spices',
    weight: '200g',
    store: 'cilka'
  },
  {
    id: 'sumac-1',
    name: {
      en: 'Ground Sumac',
      ar: 'سماق مطحون'
    },
    description: {
      en: 'Tangy, lemony spice that adds a beautiful red color and sour taste to dishes.',
      ar: 'توابل منعشة بطعم ليموني تضيف لوناً أحمر جميلاً وطعماً حامضاً للأطباق.'
    },
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1596040033229-a292b8ded585?w=400&h=300&fit=crop',
    category: 'spices',
    weight: '150g',
    store: 'irth-biladi'
  },
  {
    id: 'baharat-1',
    name: {
      en: 'Seven Spice Blend (Baharat)',
      ar: 'بهارات سبعة'
    },
    description: {
      en: 'Traditional Middle Eastern spice blend with black pepper, allspice, cinnamon, cloves, and more.',
      ar: 'خلطة البهارات الشرق أوسطية التراثية مع الفلفل الأسود والبهار الحلو والقرفة والقرنفل وأكثر.'
    },
    price: 9.25,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'spices',
    weight: '100g',
    store: 'cilka'
  },

  // Premium Oils
  {
    id: 'olive-oil-1',
    name: {
      en: 'Extra Virgin Olive Oil',
      ar: 'زيت زيتون بكر ممتاز'
    },
    description: {
      en: 'Cold-pressed from the finest olives, with a rich, fruity flavor and golden green color.',
      ar: 'معصور على البارد من أجود أنواع الزيتون، بطعم غني ومثمر ولون ذهبي أخضر.'
    },
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
    category: 'oils',
    weight: '500ml',
    store: 'irth-biladi'
  },
  {
    id: 'sesame-oil-1',
    name: {
      en: 'Pure Sesame Oil',
      ar: 'زيت سمسم نق��'
    },
    description: {
      en: 'Traditional tahini oil extracted from roasted sesame seeds. Perfect for Middle Eastern cuisine.',
      ar: 'زي�� طحينة تراثي مستخرج من بذور السمسم المحمصة. مثالي للمطبخ الشرق أوسطي.'
    },
    price: 16.75,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop',
    category: 'oils',
    weight: '250ml',
    store: 'cilka'
  },

  // Traditional Beverages
  {
    id: 'tea-1',
    name: {
      en: 'Sage Tea',
      ar: 'شاي الميرمية'
    },
    description: {
      en: 'Aromatic sage leaves for traditional Middle Eastern tea. Known for its health benefits and soothing properties.',
      ar: 'أوراق الميرمية العطرة للشاي الشرق أوسطي التراثي. معروفة بفوائدها الصحية وخصائصها المهدئة.'
    },
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    category: 'beverages',
    weight: '100g',
    store: 'irth-biladi'
  },
  {
    id: 'tea-2',
    name: {
      en: 'Chamomile Tea',
      ar: 'شاي البابونج'
    },
    description: {
      en: 'Premium dried chamomile flowers for a calming, caffeine-free herbal tea.',
      ar: 'زهور البابونج المجففة الفاخرة لشاي عشبي مهدئ وخالي من الكافيين.'
    },
    price: 6.25,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
    category: 'beverages',
    weight: '80g',
    store: 'cilka'
  },
  {
    id: 'coffee-1',
    name: {
      en: 'Arabic Coffee (Qahwa)',
      ar: 'قهوة عربية'
    },
    description: {
      en: 'Traditional Arabic coffee blend with cardamom. Light roast with a unique aromatic flavor.',
      ar: 'خلطة القهوة العربية التراثية مع الهيل. تحميص خفيف بطعم عطري فريد.'
    },
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    category: 'beverages',
    weight: '300g',
    store: 'irth-biladi'
  }
];

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getFeaturedProducts = () => {
  return products.slice(0, 6);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};
