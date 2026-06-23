-- ============================================================
-- MIGRACIÓN CONSOLIDADA: Tablas y columnas faltantes
 -- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. AGREGAR tracking_token A orders (MIGRACIÓN FALTANTE #4)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token uuid DEFAULT gen_random_uuid() NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);

-- 2. AGREGAR 'processing' AL CHECK DE STATUS EN orders
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled'));

-- 3. AGREGAR role A profiles (MIGRACIÓN FALTANTE #7)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin'));

-- 4. AGREGAR avg_rating Y review_count A products (MIGRACIÓN FALTANTE #5)
ALTER TABLE products ADD COLUMN IF NOT EXISTS avg_rating numeric(2,1) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- 5. CREAR TABLA reviews (MIGRACIÓN FALTANTE #5)
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);

-- 6. CREAR TABLA coupons (MIGRACIÓN FALTANTE #6)
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric(10,2) NOT NULL CHECK (discount_value > 0),
  min_purchase numeric(10,2) DEFAULT 0,
  max_uses integer DEFAULT NULL,
  used_count integer DEFAULT 0,
  active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. CREAR FUNCIÓN decrement_stock (MIGRACIÓN FALTANTE #8)
CREATE OR REPLACE FUNCTION decrement_stock(variant_id uuid, qty int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE product_variants
  SET stock = GREATEST(0, stock - qty)
  WHERE id = variant_id;
END;
$$;

-- 8. CREAR FUNCIÓN increment_coupon_usage (MIGRACIÓN FALTANTE #6)
CREATE OR REPLACE FUNCTION increment_coupon_usage(coupon_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE coupons SET used_count = used_count + 1 WHERE id = coupon_id;
END;
$$;

-- 9. CREAR TABLA rate_limits (MIGRACIÓN FALTANTE rate_limits)
CREATE TABLE IF NOT EXISTS rate_limits (
  key text PRIMARY KEY,
  count integer DEFAULT 1,
  reset_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits(reset_at);

CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.rate_limits WHERE reset_at < now();
END;
$$;

-- 10. RLS PARA REVIEWS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are public for viewing"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 11. RLS PARA COUPONS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons are public for viewing"
  ON coupons FOR SELECT
  USING (true);

CREATE POLICY "Coupons are manageable by admin"
  ON coupons FOR ALL
  USING (auth.role() = 'authenticated');

-- 12. ADMIN RLS FIX (MIGRACIÓN FALTANTE #9)
-- Reemplaza auth.role() = 'authenticated' por chequeo real de rol admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "Categories are manageable by admin" ON categories;
CREATE POLICY "Categories are manageable by admin"
  ON categories FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Products are manageable by admin" ON products;
CREATE POLICY "Products are manageable by admin"
  ON products FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Variants are manageable by admin" ON product_variants;
CREATE POLICY "Variants are manageable by admin"
  ON product_variants FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage all orders" ON orders;
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can manage order items" ON order_items;
CREATE POLICY "Admins can manage order items"
  ON order_items FOR ALL
  USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 13. PERMITIR SVG EN BUCKET products (MIGRACIÓN FALTANTE allow_svg)
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
WHERE id = 'products';

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT '✅ Migración completada exitosamente' AS resultado;
