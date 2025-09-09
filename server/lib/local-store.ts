import fs from "fs";
import path from "path";
import { Product, Category } from "../../shared/types";

interface StoreSchema {
  products: Product[];
  categories: Category[];
}

const STORE_FILE = path.resolve(process.cwd(), "server/lib/local-store.json");

function seedData(): StoreSchema {
  const now = new Date().toISOString();
  const categories: Category[] = [
    {
      id: "dairy",
      name: { en: "Dairy Products", ar: "منتجات الألبان" },
      description: { en: "Milks and cheese", ar: "حليب وأجبان" },
      slug: "dairy",
      created_at: now,
      updated_at: now,
    },
    {
      id: "spices",
      name: { en: "Spices & Herbs", ar: "البهارات والأعشاب" },
      description: { en: "Traditional spices", ar: "بهارات تقليدية" },
      slug: "spices",
      created_at: now,
      updated_at: now,
    },
    {
      id: "oils",
      name: { en: "Premium Oils", ar: "الزيوت الفاخرة" },
      description: { en: "Quality oils", ar: "زيوت عالية الجودة" },
      slug: "oils",
      created_at: now,
      updated_at: now,
    },
  ];

  const products: Product[] = [
    {
      id: "olive-oil-1",
      name: { en: "Extra Virgin Olive Oil", ar: "زيت زيتون بكر ممتاز" },
      description: {
        en: "Cold-pressed premium olive oil",
        ar: "زيت زيتون بكر ممتاز معصور على البارد",
      },
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=300&fit=crop",
      category: "oils",
      weight: "500ml",
      origin: "Jordan",
      store: "irth-biladi",
      created_at: now,
      updated_at: now,
    },
    {
      id: "zaatar-1",
      name: { en: "Premium Za'atar Blend", ar: "خلطة زعتر فاخرة" },
      description: {
        en: "Wild thyme, sumac, sesame",
        ar: "زعتر بري، سماق، سمسم",
      },
      price: 8.99,
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      category: "spices",
      weight: "200g",
      origin: "Levant",
      store: "cilka",
      created_at: now,
      updated_at: now,
    },
  ];

  return { products, categories };
}

function ensureFile(): void {
  if (!fs.existsSync(STORE_FILE)) {
    fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
    fs.writeFileSync(STORE_FILE, JSON.stringify(seedData(), null, 2), "utf8");
  }
}

function read(): StoreSchema {
  ensureFile();
  const raw = fs.readFileSync(STORE_FILE, "utf8");
  try {
    return JSON.parse(raw) as StoreSchema;
  } catch {
    const s = seedData();
    fs.writeFileSync(STORE_FILE, JSON.stringify(s, null, 2));
    return s;
  }
}

function write(data: StoreSchema): void {
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf8");
}

export const localStore = {
  getProducts(): Product[] {
    return read().products;
  },
  getCategories(): Category[] {
    return read().categories;
  },
  addProduct(p: Omit<Product, "id" | "created_at" | "updated_at">): Product {
    const db = read();
    const now = new Date().toISOString();
    const id = `p_${Math.random().toString(36).slice(2, 10)}`;
    const prod: Product = { ...p, id, created_at: now, updated_at: now };
    db.products.unshift(prod);
    write(db);
    return prod;
  },
  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const db = read();
    const idx = db.products.findIndex((pr) => pr.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString();
    db.products[idx] = {
      ...db.products[idx],
      ...updates,
      updated_at: now,
    } as Product;
    write(db);
    return db.products[idx];
  },
  deleteProduct(id: string): boolean {
    const db = read();
    const len = db.products.length;
    db.products = db.products.filter((p) => p.id !== id);
    write(db);
    return db.products.length < len;
  },
  addCategory(c: Omit<Category, "id" | "created_at" | "updated_at">): Category {
    const db = read();
    const now = new Date().toISOString();
    const id = `c_${Math.random().toString(36).slice(2, 10)}`;
    const cat: Category = {
      ...c,
      id,
      created_at: now,
      updated_at: now,
    } as Category;
    db.categories.push(cat);
    write(db);
    return cat;
  },
  updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const db = read();
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return undefined;
    const now = new Date().toISOString();
    db.categories[idx] = {
      ...db.categories[idx],
      ...updates,
      updated_at: now,
    } as Category;
    write(db);
    return db.categories[idx];
  },
  deleteCategory(id: string): boolean {
    const db = read();
    const len = db.categories.length;
    db.categories = db.categories.filter((c) => c.id !== id);
    write(db);
    return db.categories.length < len;
  },
};
