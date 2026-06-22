-- Function to atomically decrement stock (run in Supabase SQL Editor)
create or replace function decrement_stock(variant_id uuid, qty int)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update product_variants
  set stock = greatest(0, stock - qty)
  where id = variant_id;
end;
$$;
