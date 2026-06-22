-- MR.BRANDS - Supabase Schema
-- Run this in the Supabase SQL Editor

-- 1. CATEGORIES
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  image text,
  created_at timestamptz default now()
);

alter table categories enable row level security;

create policy "Categories are public for viewing"
  on categories for select
  using (true);

create policy "Categories are manageable by admin"
  on categories for all
  using (auth.role() = 'authenticated');

-- 2. PRODUCTS
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  price decimal(10,2) not null,
  category_id uuid references categories(id) on delete set null,
  images text[] default '{}',
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Products are public for viewing"
  on products for select
  using (active = true);

create policy "Products are manageable by admin"
  on products for all
  using (auth.role() = 'authenticated');

-- 3. PRODUCT VARIANTS
create table if not exists product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  size text not null,
  color text not null,
  stock integer default 0,
  sku text unique,
  created_at timestamptz default now()
);

alter table product_variants enable row level security;

create policy "Variants are public for viewing"
  on product_variants for select
  using (true);

create policy "Variants are manageable by admin"
  on product_variants for all
  using (auth.role() = 'authenticated');

-- 4. PROFILES (linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar text,
  phone text,
  address text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- 5. ORDERS
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total decimal(10,2) not null,
  status text default 'pending' check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Admins can manage all orders"
  on orders for all
  using (auth.role() = 'authenticated');

-- 6. ORDER ITEMS
create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  variant_id uuid references product_variants(id) on delete set null,
  variant_label text,
  quantity integer not null,
  price decimal(10,2) not null
);

alter table order_items enable row level security;

create policy "Order items visible to order owner"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or auth.role() = 'authenticated')
    )
  );

create policy "Admins can manage order items"
  on order_items for all
  using (auth.role() = 'authenticated');

-- 7. AUTO-CREATE PROFILE ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 8. INDEXES
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(active);
create index if not exists idx_products_featured on products(featured);
create index if not exists idx_variants_product on product_variants(product_id);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_orders_status on orders(status);
