-- MR.BRANDS - Seed Data
-- Run after schema.sql

-- Categories
insert into categories (name, slug, image) values
  ('Ropa', 'ropa', null),
  ('Calzado', 'calzado', null),
  ('Accesorios', 'accesorios', null)
on conflict (slug) do nothing;

-- Sample Products (Ropa)
with cat as (select id, slug from categories)
insert into products (name, slug, description, price, category_id, images, featured) values
  ('Camiseta Flow Classic', 'camiseta-flow-classic', 'Camiseta oversize algodón peinado 240gsm. Corte relaxed, costuras reforzadas.', 24.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'], true),
  ('Hoodie MR.BRANDS Signature', 'hoodie-mrbrands-signature', 'Hoodie premium 420gsm con capucha forrada, bolsillo canguro y bordado frontal.', 54.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'], true),
  ('Jogger Cargo Street', 'jogger-cargo-street', 'Jogger cargo elasticado en cintura y tobillo. 6 bolsillos funcionales.', 39.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1593032458800-490c37ecf9bb?w=600'], false),
  ('Chaqueta Bomber Flow', 'chaqueta-bomber-flow', 'Chaqueta bomber acolchada con interior térmico. Cierre frontal y cuello alto.', 69.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600'], true),
  ('Jean Relaxed Fit', 'jean-relaxed-fit', 'Jean corte relaxed fit. Denim elástico 12oz. Costuras resistentes.', 44.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1542272454315-70322d6e5c38?w=600'], false),
  ('Camisa Oversize Flannel', 'camisa-oversize-flannel', 'Camisa flannel oversize. Tela suave 100% poliéster. Ideal para capas.', 34.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'], false),
  ('Short Deportivo Flow', 'short-deportivo-flow', 'Short deportivo con bolsillos laterales. Tela dry-fit 130gsm.', 19.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600'], false),
  ('Varsity Jacket MR.BRANDS', 'varsity-jacket-mrbrands', 'Chaqueta varsity edición limitada. Mangas piel sintética, cuerpo lana.', 89.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'], true),
  ('Polo Lacoste Style', 'polo-lacoste-style', 'Polo cuello clásico con bordado pequeño frontal. Algodón piqué 200gsm.', 29.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1594930328603-4b46c6f6d2a1?w=600'], false),
  ('Sweater Cuello Redondo', 'sweater-cuello-redondo', 'Sweater cuello redondo. Algodón 100% peinado. Corte clásico.', 42.99, (select id from cat where slug='ropa'), array['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'], false)
on conflict (slug) do nothing;

-- Sample Products (Calzado)
with cat as (select id, slug from categories)
insert into products (name, slug, description, price, category_id, images, featured) values
  ('Zapato Urbano MR-01', 'zapato-urbano-mr01', 'Zapato urbano en cuero sintético. Suela antideslizante, plantilla acolchada.', 59.99, (select id from cat where slug='calzado'), array['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600'], true),
  ('Chola Clasica Flow', 'chola-clasica-flow', 'Sandalia chola clásica. Tira ancha, suela de goma 3cm.', 14.99, (select id from cat where slug='calzado'), array['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600'], false),
  ('Bota Tactica High', 'bota-tactica-high', 'Bota alta urbana con cordones metálicos. Suela Vibra, forro textil.', 74.99, (select id from cat where slug='calzado'), array['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600'], true),
  ('Zapatilla Deportiva Flow Run', 'zapatilla-deportiva-flow-run', 'Zapatilla deportiva ligera con mediasuela reactiva. Ideal para uso diario.', 49.99, (select id from cat where slug='calzado'), array['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'], false),
  ('Mocasin Suede', 'mocasin-suede', 'Mocasín en gamuza sintética. Suela fina, estilo clásico.', 39.99, (select id from cat where slug='calzado'), array['https://images.unsplash.com/photo-1614251055834-2a2bb2f3b30d?w=600'], false)
on conflict (slug) do nothing;

-- Sample Products (Accesorios)
with cat as (select id, slug from categories)
insert into products (name, slug, description, price, category_id, images, featured) values
  ('Gorra Snapback MR', 'gorra-snapback-mr', 'Gorra snapback ajustable. Bordado frontal 3D. Visera plana.', 19.99, (select id from cat where slug='accesorios'), array['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'], true),
  ('Mochila Urbana 30L', 'mochila-urbana-30l', 'Mochila 30L con compartimento para laptop 15". Cierre doble cremallera.', 44.99, (select id from cat where slug='accesorios'), array['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], false),
  ('Collar Cadena Plateada', 'collar-cadena-plateada', 'Cadena plateada 50cm. Aleación zinc libre de níquel.', 12.99, (select id from cat where slug='accesorios'), array['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'], true),
  ('Reloj Digital Retro', 'reloj-digital-retro', 'Reloj digital con correa de silicona. Resistente al agua, luz LED.', 29.99, (select id from cat where slug='accesorios'), array['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600'], false),
  ('Cinturon Cuero Negro', 'cinturon-cuero-negro', 'Cinturón cuero sintético 3.5cm. Hebilla metálica dorada.', 22.99, (select id from cat where slug='accesorios'), array['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'], false),
  ('Llavero MR.BRANDS', 'llavero-mrbrands', 'Llavero metálico con logo grabado. Empaque de regalo.', 6.99, (select id from cat where slug='accesorios'), array['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600'], false)
on conflict (slug) do nothing;

-- Variants for each product
do $$
declare
  p record;
  color text;
  size text;
  color_list text[] := array['Negro', 'Blanco', 'Gris'];
  size_list text[] := array['S', 'M', 'L', 'XL'];
begin
  for p in select id, slug from products loop
    foreach color in array color_list loop
      foreach size in array size_list loop
        insert into product_variants (product_id, size, color, stock, sku)
        values (p.id, size, color, floor(random() * 50 + 5)::int, p.slug || '-' || lower(color) || '-' || lower(size));
      end loop;
    end loop;
  end loop;
end;
$$;
