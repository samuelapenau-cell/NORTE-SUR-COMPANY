-- Fix admin RLS policies: use real admin role check, not auth.role()
-- The old policies used auth.role() = 'authenticated' which allows ANY logged-in user

-- Helper function to check if a user is admin
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- Drop old insecure policies on categories
drop policy if exists "Categories are manageable by admin" on categories;
create policy "Categories are manageable by admin"
  on categories for all
  using (public.is_admin());

-- Drop old insecure policies on products
drop policy if exists "Products are manageable by admin" on products;
create policy "Products are manageable by admin"
  on products for all
  using (public.is_admin());

-- Drop old insecure policies on product_variants
drop policy if exists "Variants are manageable by admin" on product_variants;
create policy "Variants are manageable by admin"
  on product_variants for all
  using (public.is_admin());

-- Drop old insecure policies on orders
drop policy if exists "Admins can manage all orders" on orders;
create policy "Admins can manage all orders"
  on orders for all
  using (public.is_admin());

-- Drop old insecure policies on order_items
drop policy if exists "Admins can manage order items" on order_items;
create policy "Admins can manage order items"
  on order_items for all
  using (public.is_admin());

-- Index for admin lookups
create index if not exists idx_profiles_role on profiles(role);

-- Index for tracking_token lookups (used in order tracking)
create index if not exists idx_orders_tracking_token on orders(tracking_token);
