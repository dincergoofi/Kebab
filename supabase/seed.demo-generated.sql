-- Generated from src/data/demoExperience.js.
-- Run after migrations. Safe to rerun for the same restaurant slug.

begin;

insert into public.restaurants (
  slug, name, city, country_code, default_language, address, phone, hours, custom_link,
  tagline_tr, tagline_es, tagline_en, logo_image_url, cover_image_url, hero_video_url,
  social_links, theme, google_place_id, google_review_url, whatsapp_number,
  is_feedback_enabled, is_game_enabled, promo_enabled, promo_threshold
) values (
  'real-kebab-istanbul', 'Kebab Real Istanbul', 'San Fernando', 'ES', 'es',
  'C. Real, 204, 11100 San Fernando, Cadiz, Spain', '+34 612 58 28 37', 'Mar-Jue 13:00-16:00 · 20:00-00:00 · Vie-Sab hasta 00:30 · Dom hasta 00:00 · Lun cerrado', 'https://www.realistanbul.es',
  'San Fernando''da gercek Istanbul lezzeti.', 'El autentico sabor de Estambul en San Fernando.', 'Authentic Istanbul flavor in San Fernando.',
  '/brand/real-istanbul-logo-luxe.png', '/brand/real-istanbul-hero-kebab.png', null,
  '[{"label":"Instagram","url":"https://www.instagram.com/realistanbul.es"}]'::jsonb, '{"primary":"#c9151b","accent":"#f5c542","fresh":"#138a50"}'::jsonb, null, 'https://www.google.com/search?sa=X&sca_esv=1264130d37fc9ab6&sxsrf=ANbL-n7ewADy5m7bXPooo47dGDNtU5yIgQ:1777739716501&q=Kebab+Real+Istambul+Yorumlar&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxK2NDE3sjQzMTQyMje1MDczMjAw3sDI-IpRxjs1KTFJISg1MUfBs7gkMTepNEchMr-oNDcnsWgRK15pAEyif5FYAAAA&rldimm=9472964122758762003&tbm=lcl&hl=tr-TR&ved=2ahUKEwjrk7jChJuUAxVaB9sEHWgZJuUQ9fQKegQIUBAG&biw=1536&bih=730&dpr=1.25#lkt=LocalPoiReviews', '34612582837',
  true, true, false, 90
)
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  address = excluded.address,
  phone = excluded.phone,
  hours = excluded.hours,
  custom_link = excluded.custom_link,
  tagline_tr = excluded.tagline_tr,
  tagline_es = excluded.tagline_es,
  tagline_en = excluded.tagline_en,
  logo_image_url = excluded.logo_image_url,
  cover_image_url = excluded.cover_image_url,
  social_links = excluded.social_links,
  theme = excluded.theme,
  google_place_id = excluded.google_place_id,
  google_review_url = excluded.google_review_url,
  whatsapp_number = excluded.whatsapp_number,
  is_feedback_enabled = excluded.is_feedback_enabled,
  is_game_enabled = excluded.is_game_enabled,
  promo_enabled = excluded.promo_enabled,
  promo_threshold = excluded.promo_threshold;

-- Table count generated with --tables=12.
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.restaurant_tables (restaurant_id, code, label)
select restaurant.id, 'masa-' || table_no, 'Mesa ' || table_no
from restaurant, generate_series(1, 12) as table_no
on conflict (restaurant_id, code) do update set label = excluded.label;

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.categories (id, restaurant_id, name_tr, name_es, name_en, order_index, is_active)
select gen_random_uuid(), restaurant.id, 'Ana Lezzetler', 'Principales', 'Mains', 10, true
from restaurant
where not exists (
  select 1 from public.categories c
  where c.restaurant_id = restaurant.id
    and c.name_es = 'Principales'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.categories c set
  name_tr = 'Ana Lezzetler',
  name_en = 'Mains',
  order_index = 10,
  is_active = true
from restaurant
where c.restaurant_id = restaurant.id
  and c.name_es = 'Principales';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.categories (id, restaurant_id, name_tr, name_es, name_en, order_index, is_active)
select gen_random_uuid(), restaurant.id, 'Yan Lezzetler', 'Complementos', 'Sides', 20, true
from restaurant
where not exists (
  select 1 from public.categories c
  where c.restaurant_id = restaurant.id
    and c.name_es = 'Complementos'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.categories c set
  name_tr = 'Yan Lezzetler',
  name_en = 'Sides',
  order_index = 20,
  is_active = true
from restaurant
where c.restaurant_id = restaurant.id
  and c.name_es = 'Complementos';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.categories (id, restaurant_id, name_tr, name_es, name_en, order_index, is_active)
select gen_random_uuid(), restaurant.id, 'Ozel Lezzetler', 'Especiales', 'Specials', 30, true
from restaurant
where not exists (
  select 1 from public.categories c
  where c.restaurant_id = restaurant.id
    and c.name_es = 'Especiales'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.categories c set
  name_tr = 'Ozel Lezzetler',
  name_en = 'Specials',
  order_index = 30,
  is_active = true
from restaurant
where c.restaurant_id = restaurant.id
  and c.name_es = 'Especiales';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.categories (id, restaurant_id, name_tr, name_es, name_en, order_index, is_active)
select gen_random_uuid(), restaurant.id, 'Tatlilar', 'Postres', 'Desserts', 40, true
from restaurant
where not exists (
  select 1 from public.categories c
  where c.restaurant_id = restaurant.id
    and c.name_es = 'Postres'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.categories c set
  name_tr = 'Tatlilar',
  name_en = 'Desserts',
  order_index = 40,
  is_active = true
from restaurant
where c.restaurant_id = restaurant.id
  and c.name_es = 'Postres';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.categories (id, restaurant_id, name_tr, name_es, name_en, order_index, is_active)
select gen_random_uuid(), restaurant.id, 'Icecekler', 'Bebidas', 'Drinks', 50, true
from restaurant
where not exists (
  select 1 from public.categories c
  where c.restaurant_id = restaurant.id
    and c.name_es = 'Bebidas'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.categories c set
  name_tr = 'Icecekler',
  name_en = 'Drinks',
  order_index = 50,
  is_active = true
from restaurant
where c.restaurant_id = restaurant.id
  and c.name_es = 'Bebidas';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.restaurant_links (restaurant_id, kind, label, url, order_index, is_active)
select restaurant.id, 'phone', 'Telefono', 'tel:+34612582837', 10, true
from restaurant
where not exists (
  select 1 from public.restaurant_links l
  where l.restaurant_id = restaurant.id
    and l.kind = 'phone'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.restaurant_links l set
  label = 'Telefono',
  url = 'tel:+34612582837',
  order_index = 10,
  is_active = true
from restaurant
where l.restaurant_id = restaurant.id
  and l.kind = 'phone';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.restaurant_links (restaurant_id, kind, label, url, order_index, is_active)
select restaurant.id, 'whatsapp', 'WhatsApp', 'https://wa.me/34612582837?text=Hola%2C%20quiero%20hacer%20un%20pedido.', 20, true
from restaurant
where not exists (
  select 1 from public.restaurant_links l
  where l.restaurant_id = restaurant.id
    and l.kind = 'whatsapp'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.restaurant_links l set
  label = 'WhatsApp',
  url = 'https://wa.me/34612582837?text=Hola%2C%20quiero%20hacer%20un%20pedido.',
  order_index = 20,
  is_active = true
from restaurant
where l.restaurant_id = restaurant.id
  and l.kind = 'whatsapp';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.restaurant_links (restaurant_id, kind, label, url, order_index, is_active)
select restaurant.id, 'maps', 'Google Maps', 'https://www.google.com/maps/search/?api=1&query=Kebab%20Real%20Istanbul%2C%20C.%20Real%20204%2C%2011100%20San%20Fernando%2C%20Cadiz%2C%20Spain', 30, true
from restaurant
where not exists (
  select 1 from public.restaurant_links l
  where l.restaurant_id = restaurant.id
    and l.kind = 'maps'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.restaurant_links l set
  label = 'Google Maps',
  url = 'https://www.google.com/maps/search/?api=1&query=Kebab%20Real%20Istanbul%2C%20C.%20Real%20204%2C%2011100%20San%20Fernando%2C%20Cadiz%2C%20Spain',
  order_index = 30,
  is_active = true
from restaurant
where l.restaurant_id = restaurant.id
  and l.kind = 'maps';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.restaurant_links (restaurant_id, kind, label, url, order_index, is_active)
select restaurant.id, 'website', 'Web', 'https://www.realistanbul.es', 35, true
from restaurant
where not exists (
  select 1 from public.restaurant_links l
  where l.restaurant_id = restaurant.id
    and l.kind = 'website'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.restaurant_links l set
  label = 'Web',
  url = 'https://www.realistanbul.es',
  order_index = 35,
  is_active = true
from restaurant
where l.restaurant_id = restaurant.id
  and l.kind = 'website';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
insert into public.restaurant_links (restaurant_id, kind, label, url, order_index, is_active)
select restaurant.id, 'reviews', 'Google Reviews', 'https://www.google.com/search?sa=X&sca_esv=1264130d37fc9ab6&sxsrf=ANbL-n7ewADy5m7bXPooo47dGDNtU5yIgQ:1777739716501&q=Kebab+Real+Istambul+Yorumlar&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxK2NDE3sjQzMTQyMje1MDczMjAw3sDI-IpRxjs1KTFJISg1MUfBs7gkMTepNEchMr-oNDcnsWgRK15pAEyif5FYAAAA&rldimm=9472964122758762003&tbm=lcl&hl=tr-TR&ved=2ahUKEwjrk7jChJuUAxVaB9sEHWgZJuUQ9fQKegQIUBAG&biw=1536&bih=730&dpr=1.25#lkt=LocalPoiReviews', 40, true
from restaurant
where not exists (
  select 1 from public.restaurant_links l
  where l.restaurant_id = restaurant.id
    and l.kind = 'reviews'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul')
update public.restaurant_links l set
  label = 'Google Reviews',
  url = 'https://www.google.com/search?sa=X&sca_esv=1264130d37fc9ab6&sxsrf=ANbL-n7ewADy5m7bXPooo47dGDNtU5yIgQ:1777739716501&q=Kebab+Real+Istambul+Yorumlar&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxK2NDE3sjQzMTQyMje1MDczMjAw3sDI-IpRxjs1KTFJISg1MUfBs7gkMTepNEchMr-oNDcnsWgRK15pAEyif5FYAAAA&rldimm=9472964122758762003&tbm=lcl&hl=tr-TR&ved=2ahUKEwjrk7jChJuUAxVaB9sEHWgZJuUQ9fQKegQIUBAG&biw=1536&bih=730&dpr=1.25#lkt=LocalPoiReviews',
  order_index = 40,
  is_active = true
from restaurant
where l.restaurant_id = restaurant.id
  and l.kind = 'reviews';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Pilavli Et', 'Carne con arroz', 'Beef with rice',
  'Doner eti aromali pirinc pilavi ve taze salata ile.', 'Carne kebab con arroz aromatico y ensalada fresca.', 'Kebab meat with aromatic rice and fresh salad.',
  8.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["et doner","pirinc","salata"],"es":["carne kebab","arroz","ensalada"],"en":["kebab meat","rice","salad"]}'::jsonb, '[]'::jsonb, 760, 1,
  'En Sevilen', 'Mas pedido', 'Most ordered', true, false, 92, 10, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Carne con arroz'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Pilavli Et',
  name_en = 'Beef with rice',
  description_tr = 'Doner eti aromali pirinc pilavi ve taze salata ile.',
  description_es = 'Carne kebab con arroz aromatico y ensalada fresca.',
  description_en = 'Kebab meat with aromatic rice and fresh salad.',
  price = 8.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["et doner","pirinc","salata"],"es":["carne kebab","arroz","ensalada"],"en":["kebab meat","rice","salad"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 760,
  spice_level = 1,
  badge_tr = 'En Sevilen',
  badge_es = 'Mas pedido',
  badge_en = 'Most ordered',
  is_signature = true,
  is_anchor = false,
  sales_priority = 92,
  order_index = 10,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Carne con arroz';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Etli Patates', 'Patatas con carne', 'Fries with meat',
  'Citir patates uzerinde kebap eti ve sos.', 'Patatas crujientes con carne kebab y salsa.', 'Crispy fries with kebab meat and sauce.',
  7.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["et doner","patates","sos"],"es":["carne kebab","patatas","salsa"],"en":["kebab meat","fries","sauce"]}'::jsonb, '["gluten"]'::jsonb, 820, 1,
  null, null, null, false, false, 82, 20, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Patatas con carne'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Etli Patates',
  name_en = 'Fries with meat',
  description_tr = 'Citir patates uzerinde kebap eti ve sos.',
  description_es = 'Patatas crujientes con carne kebab y salsa.',
  description_en = 'Crispy fries with kebab meat and sauce.',
  price = 7.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["et doner","patates","sos"],"es":["carne kebab","patatas","salsa"],"en":["kebab meat","fries","sauce"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 820,
  spice_level = 1,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 82,
  order_index = 20,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Patatas con carne';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kebap Tabagi + Patates', 'Plato kebab + patatas', 'Kebab plate + fries',
  'Doyurucu tabakta kebap eti patates salata ve sos.', 'Plato completo con carne kebab patatas ensalada y salsa.', 'Full plate with kebab meat fries salad and sauce.',
  8.90, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["et doner","patates","salata"],"es":["carne kebab","patatas","ensalada"],"en":["kebab meat","fries","salad"]}'::jsonb, '["gluten"]'::jsonb, 850, 1,
  'Sefin Secimi', 'Eleccion del chef', 'Chef''s Choice', true, false, 96, 30, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Plato kebab + patatas'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kebap Tabagi + Patates',
  name_en = 'Kebab plate + fries',
  description_tr = 'Doyurucu tabakta kebap eti patates salata ve sos.',
  description_es = 'Plato completo con carne kebab patatas ensalada y salsa.',
  description_en = 'Full plate with kebab meat fries salad and sauce.',
  price = 8.90,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["et doner","patates","salata"],"es":["carne kebab","patatas","ensalada"],"en":["kebab meat","fries","salad"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 850,
  spice_level = 1,
  badge_tr = 'Sefin Secimi',
  badge_es = 'Eleccion del chef',
  badge_en = 'Chef''s Choice',
  is_signature = true,
  is_anchor = false,
  sales_priority = 96,
  order_index = 30,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Plato kebab + patatas';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kebap Tabagi + Pilav', 'Plato kebab + arroz', 'Kebab plate + rice',
  'Klasik tabakta kebap eti pilav salata ve soslar.', 'Plato clasico con carne kebab arroz ensalada y salsas.', 'Classic plate with kebab meat rice salad and sauces.',
  8.90, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["et doner","pirinc","salata"],"es":["carne kebab","arroz","ensalada"],"en":["kebab meat","rice","salad"]}'::jsonb, '[]'::jsonb, 790, 1,
  null, null, null, false, false, 88, 40, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Plato kebab + arroz'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kebap Tabagi + Pilav',
  name_en = 'Kebab plate + rice',
  description_tr = 'Klasik tabakta kebap eti pilav salata ve soslar.',
  description_es = 'Plato clasico con carne kebab arroz ensalada y salsas.',
  description_en = 'Classic plate with kebab meat rice salad and sauces.',
  price = 8.90,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["et doner","pirinc","salata"],"es":["carne kebab","arroz","ensalada"],"en":["kebab meat","rice","salad"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 790,
  spice_level = 1,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 88,
  order_index = 40,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Plato kebab + arroz';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kebap Tabagi', 'Plato kebab', 'Kebab plate',
  'Bol kebap eti salata ve ev soslari ile.', 'Racion de carne kebab con ensalada y salsas de la casa.', 'Generous kebab meat with salad and house sauces.',
  7.90, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["et doner","salata","sos"],"es":["carne kebab","ensalada","salsa"],"en":["kebab meat","salad","sauce"]}'::jsonb, '[]'::jsonb, 640, 1,
  null, null, null, false, false, 78, 50, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Plato kebab'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kebap Tabagi',
  name_en = 'Kebab plate',
  description_tr = 'Bol kebap eti salata ve ev soslari ile.',
  description_es = 'Racion de carne kebab con ensalada y salsas de la casa.',
  description_en = 'Generous kebab meat with salad and house sauces.',
  price = 7.90,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["et doner","salata","sos"],"es":["carne kebab","ensalada","salsa"],"en":["kebab meat","salad","sauce"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 640,
  spice_level = 1,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 78,
  order_index = 50,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Plato kebab';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Ekmek Arasi Kebap', 'Kebab pan', 'Kebab sandwich',
  'Kizarmis ekmek icinde kebap eti yesillik ve sos.', 'Pan tostado con carne kebab verduras y salsa.', 'Toasted bread with kebab meat greens and sauce.',
  5.50, 'EUR', '/brand/dish-kebab-pan.png', '{"tr":["ekmek","et doner","salata"],"es":["pan","carne kebab","ensalada"],"en":["bread","kebab meat","salad"]}'::jsonb, '["gluten"]'::jsonb, 560, 1,
  null, null, null, false, false, 74, 60, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Kebab pan'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Ekmek Arasi Kebap',
  name_en = 'Kebab sandwich',
  description_tr = 'Kizarmis ekmek icinde kebap eti yesillik ve sos.',
  description_es = 'Pan tostado con carne kebab verduras y salsa.',
  description_en = 'Toasted bread with kebab meat greens and sauce.',
  price = 5.50,
  currency = 'EUR',
  image_url = '/brand/dish-kebab-pan.png',
  ingredients = '{"tr":["ekmek","et doner","salata"],"es":["pan","carne kebab","ensalada"],"en":["bread","kebab meat","salad"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 560,
  spice_level = 1,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 74,
  order_index = 60,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Kebab pan';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kebap Durum', 'Kebab rollo', 'Kebab wrap',
  'Lavas icinde kebap eti yesillik ve sos.', 'Rollo con carne kebab verduras y salsa.', 'Wrap with kebab meat greens and sauce.',
  6.00, 'EUR', '/brand/dish-kebab-rollo.png', '{"tr":["et doner","yesillik","sos"],"es":["carne kebab","verduras","salsa"],"en":["kebab meat","greens","sauce"]}'::jsonb, '["gluten"]'::jsonb, 650, 1,
  'En Sevilen', 'Mas pedido', 'Most ordered', true, false, 94, 70, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Kebab rollo'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kebap Durum',
  name_en = 'Kebab wrap',
  description_tr = 'Lavas icinde kebap eti yesillik ve sos.',
  description_es = 'Rollo con carne kebab verduras y salsa.',
  description_en = 'Wrap with kebab meat greens and sauce.',
  price = 6.00,
  currency = 'EUR',
  image_url = '/brand/dish-kebab-rollo.png',
  ingredients = '{"tr":["et doner","yesillik","sos"],"es":["carne kebab","verduras","salsa"],"en":["kebab meat","greens","sauce"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 650,
  spice_level = 1,
  badge_tr = 'En Sevilen',
  badge_es = 'Mas pedido',
  badge_en = 'Most ordered',
  is_signature = true,
  is_anchor = false,
  sales_priority = 94,
  order_index = 70,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Kebab rollo';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Lahmacun', 'Lahmacun', 'Lahmacun',
  'Ince hamur uzerinde baharatli kiyma ve limon.', 'Masa fina con carne especiada y limon fresco.', 'Thin dough with spiced minced meat and lemon.',
  6.50, 'EUR', '/brand/dish-pizza-kebab.png', '{"tr":["hamur","kiyma","limon"],"es":["masa","carne picada","limon"],"en":["dough","minced meat","lemon"]}'::jsonb, '["gluten"]'::jsonb, 620, 2,
  null, null, null, false, false, 80, 80, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Lahmacun'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Lahmacun',
  name_en = 'Lahmacun',
  description_tr = 'Ince hamur uzerinde baharatli kiyma ve limon.',
  description_es = 'Masa fina con carne especiada y limon fresco.',
  description_en = 'Thin dough with spiced minced meat and lemon.',
  price = 6.50,
  currency = 'EUR',
  image_url = '/brand/dish-pizza-kebab.png',
  ingredients = '{"tr":["hamur","kiyma","limon"],"es":["masa","carne picada","limon"],"en":["dough","minced meat","lemon"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 620,
  spice_level = 2,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 80,
  order_index = 80,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Lahmacun';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Lahmacun Menu', 'Lahmacun menu', 'Lahmacun menu',
  'Lahmacun patates sos ve icecek ile.', 'Lahmacun con patatas salsa y bebida.', 'Lahmacun with fries sauce and drink.',
  8.90, 'EUR', '/brand/dish-lahmacun.png', '{"tr":["lahmacun","patates","icecek"],"es":["lahmacun","patatas","bebida"],"en":["lahmacun","fries","drink"]}'::jsonb, '["gluten"]'::jsonb, 940, 2,
  null, null, null, false, true, 86, 90, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Lahmacun menu'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Lahmacun Menu',
  name_en = 'Lahmacun menu',
  description_tr = 'Lahmacun patates sos ve icecek ile.',
  description_es = 'Lahmacun con patatas salsa y bebida.',
  description_en = 'Lahmacun with fries sauce and drink.',
  price = 8.90,
  currency = 'EUR',
  image_url = '/brand/dish-lahmacun.png',
  ingredients = '{"tr":["lahmacun","patates","icecek"],"es":["lahmacun","patatas","bebida"],"en":["lahmacun","fries","drink"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 940,
  spice_level = 2,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = true,
  sales_priority = 86,
  order_index = 90,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Lahmacun menu';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Ekmek Arasi Kebap Menu', 'Kebab pan menu', 'Kebab sandwich menu',
  'Ekmek arasi kebap patates ve icecek ile.', 'Kebab en pan con patatas y bebida.', 'Kebab sandwich with fries and drink.',
  7.90, 'EUR', '/brand/dish-kebab-pan.png', '{"tr":["ekmek","et doner","patates","icecek"],"es":["pan","carne kebab","patatas","bebida"],"en":["bread","kebab meat","fries","drink"]}'::jsonb, '["gluten"]'::jsonb, 850, 1,
  null, null, null, false, false, 83, 100, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Kebab pan menu'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Ekmek Arasi Kebap Menu',
  name_en = 'Kebab sandwich menu',
  description_tr = 'Ekmek arasi kebap patates ve icecek ile.',
  description_es = 'Kebab en pan con patatas y bebida.',
  description_en = 'Kebab sandwich with fries and drink.',
  price = 7.90,
  currency = 'EUR',
  image_url = '/brand/dish-kebab-pan.png',
  ingredients = '{"tr":["ekmek","et doner","patates","icecek"],"es":["pan","carne kebab","patatas","bebida"],"en":["bread","kebab meat","fries","drink"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 850,
  spice_level = 1,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 83,
  order_index = 100,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Kebab pan menu';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kebap Durum Menu', 'Kebab rollo menu', 'Kebab wrap menu',
  'Kebap durum patates ve icecek ile.', 'Rollo kebab con patatas y bebida.', 'Kebab wrap with fries and drink.',
  8.50, 'EUR', '/brand/dish-kebab-rollo.png', '{"tr":["durum","patates","icecek"],"es":["rollo","patatas","bebida"],"en":["wrap","fries","drink"]}'::jsonb, '["gluten"]'::jsonb, 930, 1,
  'Sefin Secimi', 'Eleccion del chef', 'Chef''s Choice', true, false, 98, 110, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Kebab rollo menu'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Principales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kebap Durum Menu',
  name_en = 'Kebab wrap menu',
  description_tr = 'Kebap durum patates ve icecek ile.',
  description_es = 'Rollo kebab con patatas y bebida.',
  description_en = 'Kebab wrap with fries and drink.',
  price = 8.50,
  currency = 'EUR',
  image_url = '/brand/dish-kebab-rollo.png',
  ingredients = '{"tr":["durum","patates","icecek"],"es":["rollo","patatas","bebida"],"en":["wrap","fries","drink"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 930,
  spice_level = 1,
  badge_tr = 'Sefin Secimi',
  badge_es = 'Eleccion del chef',
  badge_en = 'Chef''s Choice',
  is_signature = true,
  is_anchor = false,
  sales_priority = 98,
  order_index = 110,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Kebab rollo menu';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Tavuk Burger Menu', 'Hamburguesa pollo menu', 'Chicken burger menu',
  'Tavuk burger patates ve icecek ile.', 'Hamburguesa de pollo con patatas y bebida.', 'Chicken burger with fries and drink.',
  7.50, 'EUR', '/brand/dish-kebab-pan.png', '{"tr":["pilic","ekmek","patates"],"es":["pollo","pan","patatas"],"en":["chicken","bread","fries"]}'::jsonb, '["gluten","egg"]'::jsonb, 880, 0,
  null, null, null, false, false, 74, 10, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Hamburguesa pollo menu'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Tavuk Burger Menu',
  name_en = 'Chicken burger menu',
  description_tr = 'Tavuk burger patates ve icecek ile.',
  description_es = 'Hamburguesa de pollo con patatas y bebida.',
  description_en = 'Chicken burger with fries and drink.',
  price = 7.50,
  currency = 'EUR',
  image_url = '/brand/dish-kebab-pan.png',
  ingredients = '{"tr":["pilic","ekmek","patates"],"es":["pollo","pan","patatas"],"en":["chicken","bread","fries"]}'::jsonb,
  allergens = '["gluten","egg"]'::jsonb,
  calories = 880,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 74,
  order_index = 10,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Hamburguesa pollo menu';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kucuk Durum', 'Rollo pequeno', 'Small wrap',
  'Hafif porsiyon icin kucuk kebap durum.', 'Rollo pequeno de kebab para una opcion ligera.', 'Small kebab wrap for a lighter option.',
  4.50, 'EUR', '/brand/dish-kebab-rollo.png', '{"tr":["et doner","yesillik","sos"],"es":["carne kebab","verduras","salsa"],"en":["kebab meat","greens","sauce"]}'::jsonb, '["gluten"]'::jsonb, 470, 1,
  null, null, null, false, false, 70, 20, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Rollo pequeno'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kucuk Durum',
  name_en = 'Small wrap',
  description_tr = 'Hafif porsiyon icin kucuk kebap durum.',
  description_es = 'Rollo pequeno de kebab para una opcion ligera.',
  description_en = 'Small kebab wrap for a lighter option.',
  price = 4.50,
  currency = 'EUR',
  image_url = '/brand/dish-kebab-rollo.png',
  ingredients = '{"tr":["et doner","yesillik","sos"],"es":["carne kebab","verduras","salsa"],"en":["kebab meat","greens","sauce"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 470,
  spice_level = 1,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 70,
  order_index = 20,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Rollo pequeno';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Falafel', 'Falafel', 'Falafel',
  'Nohut kofte salata ve sos ile.', 'Croquetas de garbanzo con ensalada y salsa.', 'Chickpea bites with salad and sauce.',
  6.00, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["nohut","salata","sos"],"es":["garbanzo","ensalada","salsa"],"en":["chickpea","salad","sauce"]}'::jsonb, '["sesame"]'::jsonb, 540, 0,
  'Vejetaryen', 'Vegetariano', 'Vegetarian', true, false, 84, 30, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Falafel'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Falafel',
  name_en = 'Falafel',
  description_tr = 'Nohut kofte salata ve sos ile.',
  description_es = 'Croquetas de garbanzo con ensalada y salsa.',
  description_en = 'Chickpea bites with salad and sauce.',
  price = 6.00,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["nohut","salata","sos"],"es":["garbanzo","ensalada","salsa"],"en":["chickpea","salad","sauce"]}'::jsonb,
  allergens = '["sesame"]'::jsonb,
  calories = 540,
  spice_level = 0,
  badge_tr = 'Vejetaryen',
  badge_es = 'Vegetariano',
  badge_en = 'Vegetarian',
  is_signature = true,
  is_anchor = false,
  sales_priority = 84,
  order_index = 30,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Falafel';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Tavuk Nuggets', 'Nuggets de pollo', 'Chicken nuggets',
  'Citir tavuk parcalari ve dip sos.', 'Nuggets crujientes de pollo con salsa.', 'Crispy chicken nuggets with dip.',
  5.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["tavuk","pane","sos"],"es":["pollo","rebozado","salsa"],"en":["chicken","breadcrumb","sauce"]}'::jsonb, '["gluten","egg"]'::jsonb, 520, 0,
  null, null, null, false, false, 68, 40, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Nuggets de pollo'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Tavuk Nuggets',
  name_en = 'Chicken nuggets',
  description_tr = 'Citir tavuk parcalari ve dip sos.',
  description_es = 'Nuggets crujientes de pollo con salsa.',
  description_en = 'Crispy chicken nuggets with dip.',
  price = 5.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["tavuk","pane","sos"],"es":["pollo","rebozado","salsa"],"en":["chicken","breadcrumb","sauce"]}'::jsonb,
  allergens = '["gluten","egg"]'::jsonb,
  calories = 520,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 68,
  order_index = 40,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Nuggets de pollo';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Tavuk Kanat', 'Alitas de pollo', 'Chicken wings',
  'Soslu citir tavuk kanatlari.', 'Alitas de pollo crujientes con salsa.', 'Crispy chicken wings with sauce.',
  6.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["tavuk kanat","baharat","sos"],"es":["alitas","especias","salsa"],"en":["wings","spices","sauce"]}'::jsonb, '[]'::jsonb, 690, 2,
  null, null, null, false, false, 76, 50, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Alitas de pollo'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Tavuk Kanat',
  name_en = 'Chicken wings',
  description_tr = 'Soslu citir tavuk kanatlari.',
  description_es = 'Alitas de pollo crujientes con salsa.',
  description_en = 'Crispy chicken wings with sauce.',
  price = 6.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["tavuk kanat","baharat","sos"],"es":["alitas","especias","salsa"],"en":["wings","spices","sauce"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 690,
  spice_level = 2,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 76,
  order_index = 50,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Alitas de pollo';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Sogan Halkasi', 'Aros de cebolla', 'Onion rings',
  'Altin renkli citir sogan halkalari.', 'Aros de cebolla dorados y crujientes.', 'Golden crispy onion rings.',
  4.00, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["sogan","pane"],"es":["cebolla","rebozado"],"en":["onion","breadcrumb"]}'::jsonb, '["gluten"]'::jsonb, 430, 0,
  null, null, null, false, false, 58, 60, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Aros de cebolla'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Sogan Halkasi',
  name_en = 'Onion rings',
  description_tr = 'Altin renkli citir sogan halkalari.',
  description_es = 'Aros de cebolla dorados y crujientes.',
  description_en = 'Golden crispy onion rings.',
  price = 4.00,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["sogan","pane"],"es":["cebolla","rebozado"],"en":["onion","breadcrumb"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 430,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 58,
  order_index = 60,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Aros de cebolla';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Patates Kizartmasi', 'Patatas fritas', 'French fries',
  'Klasik citir patates kizartmasi.', 'Patatas fritas clasicas y crujientes.', 'Classic crispy french fries.',
  3.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["patates"],"es":["patatas"],"en":["potatoes"]}'::jsonb, '[]'::jsonb, 390, 0,
  null, null, null, false, false, 64, 70, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Patatas fritas'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Patates Kizartmasi',
  name_en = 'French fries',
  description_tr = 'Klasik citir patates kizartmasi.',
  description_es = 'Patatas fritas clasicas y crujientes.',
  description_en = 'Classic crispy french fries.',
  price = 3.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["patates"],"es":["patatas"],"en":["potatoes"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 390,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 64,
  order_index = 70,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Patatas fritas';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Deluxe Patates', 'Patatas deluxe', 'Deluxe potatoes',
  'Baharatli deluxe patates ve ozel sos.', 'Patatas especiadas con salsa especial.', 'Seasoned deluxe potatoes with special sauce.',
  4.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["patates","baharat","sos"],"es":["patatas","especias","salsa"],"en":["potatoes","spices","sauce"]}'::jsonb, '["milk"]'::jsonb, 510, 1,
  'En Sevilen', 'Mas pedido', 'Most ordered', false, false, 82, 80, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Patatas deluxe'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Deluxe Patates',
  name_en = 'Deluxe potatoes',
  description_tr = 'Baharatli deluxe patates ve ozel sos.',
  description_es = 'Patatas especiadas con salsa especial.',
  description_en = 'Seasoned deluxe potatoes with special sauce.',
  price = 4.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["patates","baharat","sos"],"es":["patatas","especias","salsa"],"en":["potatoes","spices","sauce"]}'::jsonb,
  allergens = '["milk"]'::jsonb,
  calories = 510,
  spice_level = 1,
  badge_tr = 'En Sevilen',
  badge_es = 'Mas pedido',
  badge_en = 'Most ordered',
  is_signature = false,
  is_anchor = false,
  sales_priority = 82,
  order_index = 80,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Patatas deluxe';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Firin Patates', 'Papas al horno', 'Baked potato',
  'Firin patates sos ve sicak garnitur ile.', 'Papa al horno con salsa y topping caliente.', 'Baked potato with sauce and warm topping.',
  5.50, 'EUR', '/brand/real-istanbul-hero-kebab.png', '{"tr":["patates","sos","garnitur"],"es":["papa","salsa","topping"],"en":["potato","sauce","topping"]}'::jsonb, '["milk"]'::jsonb, 620, 0,
  null, null, null, false, false, 66, 90, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Papas al horno'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Complementos' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Firin Patates',
  name_en = 'Baked potato',
  description_tr = 'Firin patates sos ve sicak garnitur ile.',
  description_es = 'Papa al horno con salsa y topping caliente.',
  description_en = 'Baked potato with sauce and warm topping.',
  price = 5.50,
  currency = 'EUR',
  image_url = '/brand/real-istanbul-hero-kebab.png',
  ingredients = '{"tr":["patates","sos","garnitur"],"es":["papa","salsa","topping"],"en":["potato","sauce","topping"]}'::jsonb,
  allergens = '["milk"]'::jsonb,
  calories = 620,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 66,
  order_index = 90,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Papas al horno';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Especiales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Kebap Pizza', 'Pizza kebab', 'Kebab pizza',
  'Kebap eti ile hazirlanan bol malzemeli pizza.', 'Pizza con carne kebab salsa y queso fundido.', 'Pizza with kebab meat sauce and melted cheese.',
  8.90, 'EUR', '/brand/dish-pizza-kebab.png', '{"tr":["hamur","kebap eti","peynir"],"es":["masa","carne kebab","queso"],"en":["dough","kebab meat","cheese"]}'::jsonb, '["gluten","milk"]'::jsonb, 940, 1,
  'Sefin Secimi', 'Eleccion del chef', 'Chef''s Choice', true, false, 91, 10, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Pizza kebab'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Especiales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Kebap Pizza',
  name_en = 'Kebab pizza',
  description_tr = 'Kebap eti ile hazirlanan bol malzemeli pizza.',
  description_es = 'Pizza con carne kebab salsa y queso fundido.',
  description_en = 'Pizza with kebab meat sauce and melted cheese.',
  price = 8.90,
  currency = 'EUR',
  image_url = '/brand/dish-pizza-kebab.png',
  ingredients = '{"tr":["hamur","kebap eti","peynir"],"es":["masa","carne kebab","queso"],"en":["dough","kebab meat","cheese"]}'::jsonb,
  allergens = '["gluten","milk"]'::jsonb,
  calories = 940,
  spice_level = 1,
  badge_tr = 'Sefin Secimi',
  badge_es = 'Eleccion del chef',
  badge_en = 'Chef''s Choice',
  is_signature = true,
  is_anchor = false,
  sales_priority = 91,
  order_index = 10,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Pizza kebab';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Especiales' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Iskender Kebap', 'Iskender kebab', 'Iskender kebab',
  'Kebap eti ekmek ustu yogurt ve domates sos ile.', 'Carne kebab sobre pan con yogur y salsa de tomate.', 'Kebab meat over bread with yogurt and tomato sauce.',
  10.90, 'EUR', '/brand/dish-iskender-kebab.png', '{"tr":["et doner","pide","yogurt"],"es":["carne kebab","pan","yogur"],"en":["kebab meat","bread","yogurt"]}'::jsonb, '["gluten","milk"]'::jsonb, 880, 1,
  'Premium', 'Premium', 'Premium', false, true, 89, 20, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Iskender kebab'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Especiales' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Iskender Kebap',
  name_en = 'Iskender kebab',
  description_tr = 'Kebap eti ekmek ustu yogurt ve domates sos ile.',
  description_es = 'Carne kebab sobre pan con yogur y salsa de tomate.',
  description_en = 'Kebab meat over bread with yogurt and tomato sauce.',
  price = 10.90,
  currency = 'EUR',
  image_url = '/brand/dish-iskender-kebab.png',
  ingredients = '{"tr":["et doner","pide","yogurt"],"es":["carne kebab","pan","yogur"],"en":["kebab meat","bread","yogurt"]}'::jsonb,
  allergens = '["gluten","milk"]'::jsonb,
  calories = 880,
  spice_level = 1,
  badge_tr = 'Premium',
  badge_es = 'Premium',
  badge_en = 'Premium',
  is_signature = false,
  is_anchor = true,
  sales_priority = 89,
  order_index = 20,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Iskender kebab';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Postres' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Antep Fistikli Tatli', 'Dulce pistacho', 'Pistachio dessert',
  'Fistikli serbetli tatli.', 'Dulce de pistacho con toque turco.', 'Pistachio dessert with a Turkish touch.',
  3.50, 'EUR', '/brand/dish-baklava-pistachio.png', '{"tr":["fistik","hamur","serbet"],"es":["pistacho","masa","almibar"],"en":["pistachio","dough","syrup"]}'::jsonb, '["gluten","nuts"]'::jsonb, 360, 0,
  null, null, null, false, false, 74, 10, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Dulce pistacho'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Postres' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Antep Fistikli Tatli',
  name_en = 'Pistachio dessert',
  description_tr = 'Fistikli serbetli tatli.',
  description_es = 'Dulce de pistacho con toque turco.',
  description_en = 'Pistachio dessert with a Turkish touch.',
  price = 3.50,
  currency = 'EUR',
  image_url = '/brand/dish-baklava-pistachio.png',
  ingredients = '{"tr":["fistik","hamur","serbet"],"es":["pistacho","masa","almibar"],"en":["pistachio","dough","syrup"]}'::jsonb,
  allergens = '["gluten","nuts"]'::jsonb,
  calories = 360,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 74,
  order_index = 10,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Dulce pistacho';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Postres' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Cevizli Tatli', 'Dulce nueces', 'Walnut dessert',
  'Cevizli tatli kahve sonrasi icin ideal.', 'Dulce con nueces ideal para terminar.', 'Walnut dessert ideal to finish the meal.',
  3.50, 'EUR', '/brand/dish-baklava-pistachio.png', '{"tr":["ceviz","hamur","serbet"],"es":["nueces","masa","almibar"],"en":["walnuts","dough","syrup"]}'::jsonb, '["gluten","nuts"]'::jsonb, 380, 0,
  null, null, null, false, false, 70, 20, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Dulce nueces'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Postres' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Cevizli Tatli',
  name_en = 'Walnut dessert',
  description_tr = 'Cevizli tatli kahve sonrasi icin ideal.',
  description_es = 'Dulce con nueces ideal para terminar.',
  description_en = 'Walnut dessert ideal to finish the meal.',
  price = 3.50,
  currency = 'EUR',
  image_url = '/brand/dish-baklava-pistachio.png',
  ingredients = '{"tr":["ceviz","hamur","serbet"],"es":["nueces","masa","almibar"],"en":["walnuts","dough","syrup"]}'::jsonb,
  allergens = '["gluten","nuts"]'::jsonb,
  calories = 380,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 70,
  order_index = 20,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Dulce nueces';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Gazli Icecekler', 'Refrescos', 'Soft drinks',
  'Soguk kutu icecek secenekleri.', 'Bebidas frias en lata.', 'Cold canned soft drinks.',
  2.00, 'EUR', '/brand/drink-softs.png', '{"tr":["icecek"],"es":["refresco"],"en":["soft drink"]}'::jsonb, '[]'::jsonb, 140, 0,
  null, null, null, false, false, 76, 10, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Refrescos'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Gazli Icecekler',
  name_en = 'Soft drinks',
  description_tr = 'Soguk kutu icecek secenekleri.',
  description_es = 'Bebidas frias en lata.',
  description_en = 'Cold canned soft drinks.',
  price = 2.00,
  currency = 'EUR',
  image_url = '/brand/drink-softs.png',
  ingredients = '{"tr":["icecek"],"es":["refresco"],"en":["soft drink"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 140,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 76,
  order_index = 10,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Refrescos';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Su', 'Agua', 'Water',
  'Soguk sise su.', 'Botella de agua fria.', 'Cold bottled water.',
  1.50, 'EUR', '/brand/drink-water.png', '{"tr":["su"],"es":["agua"],"en":["water"]}'::jsonb, '[]'::jsonb, 0, 0,
  null, null, null, false, false, 68, 20, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Agua'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Su',
  name_en = 'Water',
  description_tr = 'Soguk sise su.',
  description_es = 'Botella de agua fria.',
  description_en = 'Cold bottled water.',
  price = 1.50,
  currency = 'EUR',
  image_url = '/brand/drink-water.png',
  ingredients = '{"tr":["su"],"es":["agua"],"en":["water"]}'::jsonb,
  allergens = '[]'::jsonb,
  calories = 0,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 68,
  order_index = 20,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Agua';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Bira', 'Cerveza', 'Beer',
  'Soguk bira secenegi.', 'Cerveza fria.', 'Cold beer.',
  2.50, 'EUR', '/brand/drink-efes.png', '{"tr":["bira"],"es":["cerveza"],"en":["beer"]}'::jsonb, '["gluten"]'::jsonb, 150, 0,
  null, null, null, false, false, 54, 30, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Cerveza'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Bira',
  name_en = 'Beer',
  description_tr = 'Soguk bira secenegi.',
  description_es = 'Cerveza fria.',
  description_en = 'Cold beer.',
  price = 2.50,
  currency = 'EUR',
  image_url = '/brand/drink-efes.png',
  ingredients = '{"tr":["bira"],"es":["cerveza"],"en":["beer"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 150,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 54,
  order_index = 30,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Cerveza';

with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
insert into public.products (
  restaurant_id, category_id, name_tr, name_es, name_en, description_tr, description_es, description_en,
  price, currency, image_url, ingredients, allergens, calories, spice_level,
  badge_tr, badge_es, badge_en, is_signature, is_anchor, sales_priority, order_index, is_available
)
select restaurant.id, category.id, 'Efes', 'Efes', 'Efes',
  'Soguk Efes birasi.', 'Cerveza Efes bien fria.', 'Cold Efes beer.',
  2.50, 'EUR', '/brand/drink-efes.png', '{"tr":["bira"],"es":["cerveza"],"en":["beer"]}'::jsonb, '["gluten"]'::jsonb, 150, 0,
  null, null, null, false, false, 56, 40, true
from restaurant, category
where not exists (
  select 1 from public.products p
  where p.restaurant_id = restaurant.id
    and p.name_es = 'Efes'
);
with restaurant as (select id from public.restaurants where slug = 'real-kebab-istanbul'),
category as (select c.id from public.categories c, restaurant where c.restaurant_id = restaurant.id and c.name_es = 'Bebidas' limit 1)
update public.products p set
  category_id = category.id,
  name_tr = 'Efes',
  name_en = 'Efes',
  description_tr = 'Soguk Efes birasi.',
  description_es = 'Cerveza Efes bien fria.',
  description_en = 'Cold Efes beer.',
  price = 2.50,
  currency = 'EUR',
  image_url = '/brand/drink-efes.png',
  ingredients = '{"tr":["bira"],"es":["cerveza"],"en":["beer"]}'::jsonb,
  allergens = '["gluten"]'::jsonb,
  calories = 150,
  spice_level = 0,
  badge_tr = null,
  badge_es = null,
  badge_en = null,
  is_signature = false,
  is_anchor = false,
  sales_priority = 56,
  order_index = 40,
  is_available = true
from restaurant, category
where p.restaurant_id = restaurant.id
  and p.name_es = 'Efes';

commit;
