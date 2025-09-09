-- Supabase schema: tables, indexes, triggers
create extension if not exists pgcrypto;

-- USERS (profile)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CATEGORIES
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PRODUCTS
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_ar text not null,
  description_en text not null,
  description_ar text not null,
  price numeric(10,2) not null,
  image text,
  category_id uuid not null references public.categories(id),
  weight text,
  origin text,
  store text not null check (store in ('irth-biladi','cilka')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ORDERS
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  total numeric(12,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ORDER ITEMS
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_orders_user on public.orders(user_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Attach triggers
create or replace trigger trg_users_updated_at before update on public.users
for each row execute function public.set_updated_at();

create or replace trigger trg_categories_updated_at before update on public.categories
for each row execute function public.set_updated_at();

create or replace trigger trg_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

create or replace trigger trg_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

-- Enable RLS (policies in separate file)
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
