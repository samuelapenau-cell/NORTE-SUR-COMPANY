-- ============================================================
-- FIX: RLS policies for orders / order_items INSERT
-- Ejecutar en el SQL Editor de Supabase
-- ============================================================

-- 1. Permitir INSERT en orders para usuarios autenticados y anónimos (guest checkout)
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- 2. Permitir INSERT en order_items para el dueño de la orden
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND (
        orders.user_id = auth.uid() OR
        (orders.user_id IS NULL AND auth.uid() IS NULL)
      )
    )
  );

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
SELECT '✅ Policies de órdenes agregadas correctamente' AS resultado;
