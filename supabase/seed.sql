-- MR.BRANDS - Seed Data (Real Products)
-- Run after schema.sql

-- 0. Create storage bucket for product images
select storage.create_bucket('productos', 'public');

-- 1. Clear existing data
delete from order_items;
delete from orders;
delete from product_variants;
delete from products;
delete from categories;

-- 2. Categories
insert into categories (name, slug) values
  ('TODAS', 'todas'),
  ('SLIM-FIT', 'slim-fit'),
  ('PANTALONES', 'pantalones'),
  ('HOODIES CREWNECKS', 'hoodies-crewnecks'),
  ('FRANELAS BoxyFit', 'franelas-boxyfit'),
  ('FRANELAS OVERSIZE', 'franelas-oversize'),
  ('BERMUDAS', 'bermudas'),
  ('SHORTS', 'shorts'),
  ('GORRAS', 'gorras'),
  ('FIRTS ONE', 'firts-one')
on conflict (slug) do nothing;

-- 3. Products - PANTALONES
with cat as (select id, slug from categories)
insert into products (name, slug, description, price, category_id, images, featured) values
  ('Baggy Brown Carpediem', 'baggy-brown-carpediem', 'Baggy color marrón. Corte holgado y cómodo.', 60.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Baggy Carpediem', 'baggy-carpediem', 'Baggy color azul. Estilo urbano Carpediem.', 60.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Baggy Jeam Carpediem Camuflado', 'baggy-jeam-carpediem-camuflado', 'Baggy jean camuflado Carpediem. Estilo militar.', 70.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Baggy REBUSS', 'baggy-rebuss-gris', 'Baggy REBUSS color gris. Corte amplio y moderno.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Baggy REBUSS (Azul Claro)', 'baggy-rebuss-azul-claro', 'Baggy REBUSS en azul claro. Fresco y versátil.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('BAGGY REBUSS (NEGRO)', 'baggy-rebuss-negro', 'Baggy REBUSS color negro. Clásico e indispensable.', 60.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Baggy Track Pant Black', 'baggy-track-pant-black', 'Track pant baggy color negro. Estilo deportivo.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('BootCut Carpediem', 'bootcut-carpediem', 'Bootcut Carpediem color negro. Corte acampanado.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Corte Recto Carpediem', 'corte-recto-carpediem', 'Pantalón corte recto Carpediem color azul.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Corte Recto REBUSS', 'corte-recto-rebuss', 'Corte recto REBUSS con acabado degradado azul.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Flared REBUSS', 'flared-rebuss-gris', 'Flared REBUSS color gris. Corte acampanado moderno.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Flared REBUSS (Negro)', 'flared-rebuss-negro', 'Flared REBUSS color negro. Estilo bold.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Mono FirtsOne', 'mono-firtsone', 'Mono FirtsOne color negro. Cómodo y práctico.', 40.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Baggy Bordado Carpediem', 'pant-baggy-bordado-carpediem', 'Pant baggy bordado Carpediem color azul. Detalles bordados exclusivos.', 60.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Pant Burning', 'pant-burning-azul', 'Pant Burning color azul. Estilo llamativo.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Burning (Azul Oscuro)', 'pant-burning-azul-oscuro', 'Pant Burning en azul oscuro.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Burning (Azul Pre-Lavado)', 'pant-burning-azul-pre-lavado', 'Pant Burning azul con acabado pre-lavado.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Burning (Negro)', 'pant-burning-negro', 'Pant Burning color negro.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Burning (Negro con Detalles)', 'pant-burning-negro-detalles', 'Pant Burning negro con detalles especiales.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Burning (Negro Pre-Lavado)', 'pant-burning-negro-pre-lavado', 'Pant Burning negro con acabado pre-lavado.', 60.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant Carpediem', 'pant-carpediem', 'Pant Carpediem color gris. Diseño clásico de la marca.', 60.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Pant Old Money Bari', 'pant-old-money-bari', 'Pant Old Money Bari color negro. Estilo elegante y sofisticado.', 45.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Pant Real Tree Camuflado Carpediem', 'pant-real-tree-camuflado-carpediem', 'Pant con estampado Real Tree camuflado Carpediem.', 50.00, (select id from cat where slug='pantalones'), '{}', false),
  ('Pant SuperBaggy', 'pant-superbaggy', 'Pant SuperBaggy color negro. Corte ultra holgado.', 60.00, (select id from cat where slug='pantalones'), '{}', true),
  ('Pantalon Super Baggy', 'pantalon-super-baggy', 'Pantalón super baggy color azul. Comodidad extrema.', 55.00, (select id from cat where slug='pantalones'), '{}', false)
on conflict (slug) do nothing;

-- 4. Products - SLIM-FIT
with cat as (select id, slug from categories)
insert into products (name, slug, description, price, category_id, images, featured) values
  ('Baby Tee Bari (Beige)', 'baby-tee-bari-beige', 'Baby Tee Bari color beige. Corte slim fit.', 25.00, (select id from cat where slug='slim-fit'), '{}', true),
  ('Baby Tee Bari (Blanca)', 'baby-tee-bari-blanca', 'Baby Tee Bari color blanco. Clásico y fresco.', 25.00, (select id from cat where slug='slim-fit'), '{}', true),
  ('Baby Tee Bari (Negra)', 'baby-tee-bari-negra', 'Baby Tee Bari color negro. Esencial en cualquier look.', 25.00, (select id from cat where slug='slim-fit'), '{}', true),
  ('Cold Culture Baby Tee (Blanco)', 'cold-culture-baby-tee-blanco', 'Cold Culture Baby Tee color blanco.', 22.00, (select id from cat where slug='slim-fit'), '{}', false),
  ('Cold Culture Baby Tee (Negro)', 'cold-culture-baby-tee-negro', 'Cold Culture Baby Tee color negro.', 22.00, (select id from cat where slug='slim-fit'), '{}', false),
  ('Slim Fit Unicolor Carpediem (Blanco)', 'slim-fit-unicolor-carpediem-blanco', 'Slim Fit unicolor Carpediem color blanco.', 24.00, (select id from cat where slug='slim-fit'), '{}', false),
  ('Slim Fit Unicolor Carpediem (Negro)', 'slim-fit-unicolor-carpediem-negro', 'Slim Fit unicolor Carpediem color negro.', 24.00, (select id from cat where slug='slim-fit'), '{}', false)
on conflict (slug) do nothing;

-- 5. Variants
-- Helper: for each product, insert color + sizes
do $$
declare
  v_id uuid;
  v_slug text;
  v_color text;
  v_sizes text[];
  v_all_sizes text[] := array['28','30','32','34','36'];
  v_l_xl text[] := array['L','XL'];
  v_34_36 text[] := array['34','36'];
  v_color_map text[][];
begin
  -- ===== PANTALONES =====

  -- Baggy Brown Carpediem - Marron - 28-36
  select id into v_id from products where slug = 'baggy-brown-carpediem';
  for i in 1..array_length(v_all_sizes, 1) loop
    insert into product_variants (product_id, size, color, stock, sku)
    values (v_id, v_all_sizes[i], 'Marron', floor(random() * 20 + 3)::int, 'baggy-brown-carpediem-marron-' || v_all_sizes[i]);
  end loop;

  -- Baggy Carpediem - Azul - 34,36
  select id into v_id from products where slug = 'baggy-carpediem';
  for i in 1..array_length(v_34_36, 1) loop
    insert into product_variants (product_id, size, color, stock, sku)
    values (v_id, v_34_36[i], 'Azul', floor(random() * 20 + 3)::int, 'baggy-carpediem-azul-' || v_34_36[i]);
  end loop;

  -- Baggy Jeam Carpediem Camuflado - Camuflado - 28-36
  select id into v_id from products where slug = 'baggy-jeam-carpediem-camuflado';
  for i in 1..array_length(v_all_sizes, 1) loop
    insert into product_variants (product_id, size, color, stock, sku)
    values (v_id, v_all_sizes[i], 'Camuflado', floor(random() * 20 + 3)::int, 'baggy-jeam-carpediem-camuflado-' || v_all_sizes[i]);
  end loop;

  -- Remaining PANTALONES: define (slug, color) pairs
  v_color_map := array[
    ['baggy-rebuss-gris', 'Gris'],
    ['baggy-rebuss-azul-claro', 'Azul Claro'],
    ['baggy-rebuss-negro', 'Negro'],
    ['baggy-track-pant-black', 'Negro'],
    ['bootcut-carpediem', 'Negro'],
    ['corte-recto-carpediem', 'Azul'],
    ['corte-recto-rebuss', 'Azul Degradado'],
    ['flared-rebuss-gris', 'Gris'],
    ['flared-rebuss-negro', 'Negro'],
    ['mono-firtsone', 'Negro'],
    ['pant-baggy-bordado-carpediem', 'Azul'],
    ['pant-burning-azul', 'Azul'],
    ['pant-burning-azul-oscuro', 'Azul Oscuro'],
    ['pant-burning-azul-pre-lavado', 'Azul Pre-Lavado'],
    ['pant-burning-negro', 'Negro'],
    ['pant-burning-negro-detalles', 'Negro con Detalles'],
    ['pant-burning-negro-pre-lavado', 'Negro Pre-Lavado'],
    ['pant-carpediem', 'Gris'],
    ['pant-old-money-bari', 'Negro'],
    ['pant-real-tree-camuflado-carpediem', 'Camuflajeado'],
    ['pant-superbaggy', 'Negro'],
    ['pantalon-super-baggy', 'Azul']
  ];

  for i in 1..array_length(v_color_map, 1) loop
    v_slug := v_color_map[i][1];
    v_color := v_color_map[i][2];
    select id into v_id from products where slug = v_slug;
    for j in 1..array_length(v_all_sizes, 1) loop
      insert into product_variants (product_id, size, color, stock, sku)
      values (v_id, v_all_sizes[j], v_color, floor(random() * 20 + 3)::int,
              v_slug || '-' || lower(regexp_replace(v_color, '[^a-zA-Z0-9]', '', 'g')) || '-' || v_all_sizes[j]);
    end loop;
  end loop;

  -- ===== SLIM-FIT (sizes: L, XL) =====
  v_color_map := array[
    ['baby-tee-bari-beige', 'Beige'],
    ['baby-tee-bari-blanca', 'Blanca'],
    ['baby-tee-bari-negra', 'Negra'],
    ['cold-culture-baby-tee-blanco', 'Blanco'],
    ['cold-culture-baby-tee-negro', 'Negro'],
    ['slim-fit-unicolor-carpediem-blanco', 'Blanco'],
    ['slim-fit-unicolor-carpediem-negro', 'Negro']
  ];

  for i in 1..array_length(v_color_map, 1) loop
    v_slug := v_color_map[i][1];
    v_color := v_color_map[i][2];
    select id into v_id from products where slug = v_slug;
    for j in 1..array_length(v_l_xl, 1) loop
      insert into product_variants (product_id, size, color, stock, sku)
      values (v_id, v_l_xl[j], v_color, floor(random() * 20 + 3)::int,
              v_slug || '-' || lower(regexp_replace(v_color, '[^a-zA-Z0-9]', '', 'g')) || '-' || v_l_xl[j]);
    end loop;
  end loop;
end;
$$;
