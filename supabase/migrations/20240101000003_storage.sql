-- MR.BRANDS - Supabase Storage for Product Images
-- Run this in the Supabase SQL Editor or via migration

-- 1. Create bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'products',
  'products',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

-- 2. Public read access
create policy "Product images are public"
on storage.objects for select
using (bucket_id = 'products');

-- 3. Authenticated users can upload
create policy "Authenticated users can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'products'
  and auth.role() = 'authenticated'
);

-- 4. Users can update/delete their own uploads
create policy "Authenticated users can update their images"
on storage.objects for update
using (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Authenticated users can delete their images"
on storage.objects for delete
using (bucket_id = 'products' and auth.role() = 'authenticated');
