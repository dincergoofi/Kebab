alter table public.restaurants
  add column if not exists address text,
  add column if not exists phone text,
  add column if not exists hours text,
  add column if not exists custom_link text,
  add column if not exists tagline_tr text,
  add column if not exists tagline_es text,
  add column if not exists tagline_en text,
  add column if not exists logo_image_url text,
  add column if not exists cover_image_url text,
  add column if not exists hero_video_url text,
  add column if not exists social_links jsonb not null default '[]'::jsonb,
  add column if not exists theme jsonb not null default '{}'::jsonb;

update public.restaurants
set
  phone = coalesce(phone, whatsapp_number),
  custom_link = coalesce(custom_link, slug),
  tagline_es = coalesce(tagline_es, name),
  tagline_en = coalesce(tagline_en, name),
  tagline_tr = coalesce(tagline_tr, name)
where true;
