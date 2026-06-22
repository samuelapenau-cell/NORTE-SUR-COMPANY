-- Allow SVG uploads to products bucket
update storage.buckets
set allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
where id = 'products';
