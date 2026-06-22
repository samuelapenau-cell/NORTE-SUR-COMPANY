-- MR.BRANDS - Full-Text Search for Products
-- Run after schema.sql

-- 1. Add tsvector column
alter table products
  add column if not exists search_vector tsvector
  generated always as (
    to_tsvector('spanish', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) stored;

-- 2. GIN index for performance
create index if not exists idx_products_search on products using gin(search_vector);

-- 3. Function for ranked search
create or replace function search_products(search_query text, max_results int default 20)
returns setof products
language sql
stable
as $$
  select *
  from products
  where search_vector @@ plainto_tsquery('spanish', search_query)
    and active = true
  order by ts_rank(search_vector, plainto_tsquery('spanish', search_query)) desc
  limit max_results;
$$;
