-- Add tracking_token to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token uuid DEFAULT gen_random_uuid() NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_tracking_token ON orders(tracking_token);
