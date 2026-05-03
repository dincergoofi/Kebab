create extension if not exists pgcrypto;

do $$
begin
  create type public.feedback_platform as enum ('internal', 'google', 'whatsapp');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  city text,
  country_code char(2) not null default 'ES',
  default_language text not null default 'es' check (default_language in ('tr', 'es', 'en')),
  google_place_id text,
  google_review_url text,
  whatsapp_number text,
  is_active boolean not null default true,
  is_menu_enabled boolean not null default true,
  is_feedback_enabled boolean not null default true,
  is_game_enabled boolean not null default true,
  promo_enabled boolean not null default false,
  promo_threshold integer not null default 90 check (promo_threshold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurant_tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  code text not null check (code ~ '^[a-z0-9-]+$'),
  label text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (restaurant_id, code)
);

create table if not exists public.restaurant_links (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  kind text not null check (kind ~ '^[a-z0-9_-]+$'),
  label text not null,
  url text not null,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name_tr text not null,
  name_es text not null,
  name_en text not null,
  order_index integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (restaurant_id, id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  name_tr text not null,
  name_es text not null,
  name_en text not null,
  description_tr text,
  description_es text,
  description_en text,
  price numeric(10, 2) not null check (price >= 0),
  currency char(3) not null default 'EUR',
  image_url text,
  ingredients jsonb not null default '{}'::jsonb,
  allergens jsonb not null default '[]'::jsonb,
  calories integer check (calories is null or calories >= 0),
  spice_level smallint not null default 0 check (spice_level between 0 and 3),
  badge_tr text,
  badge_es text,
  badge_en text,
  is_signature boolean not null default false,
  is_anchor boolean not null default false,
  sales_priority integer not null default 0 check (sales_priority between 0 and 100),
  order_index integer not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_same_restaurant_category
    foreign key (restaurant_id, category_id)
    references public.categories(restaurant_id, id)
    deferrable initially deferred
);

create table if not exists public.guest_sessions (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  language text not null default 'es' check (language in ('tr', 'es', 'en')),
  user_agent text,
  started_at timestamptz not null default now()
);

create table if not exists public.session_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.guest_sessions(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  event_name text not null check (event_name ~ '^[a-z0-9_]+$'),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  session_id uuid references public.guest_sessions(id) on delete set null,
  star_rating smallint not null check (star_rating between 1 and 5),
  comment text,
  platform public.feedback_platform not null default 'internal',
  language text not null default 'es' check (language in ('tr', 'es', 'en')),
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.game_leaderboard (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  player_name text not null default 'Guest',
  score integer not null check (score >= 0 and score <= 100000),
  created_at timestamptz not null default now()
);

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  leaderboard_id uuid not null unique references public.game_leaderboard(id) on delete cascade,
  code text not null unique,
  score integer not null check (score >= 0),
  expires_at timestamptz not null default (now() + interval '7 days'),
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists categories_restaurant_order_idx
  on public.categories (restaurant_id, order_index);

create index if not exists products_category_order_idx
  on public.products (category_id, order_index)
  where is_available = true;

create index if not exists guest_sessions_restaurant_started_idx
  on public.guest_sessions (restaurant_id, started_at desc);

create index if not exists session_events_session_created_idx
  on public.session_events (session_id, created_at desc);

create index if not exists feedback_restaurant_created_idx
  on public.feedback (restaurant_id, created_at desc);

create index if not exists leaderboard_restaurant_score_idx
  on public.game_leaderboard (restaurant_id, score desc, created_at desc);

alter table public.restaurants enable row level security;
alter table public.restaurant_tables enable row level security;
alter table public.restaurant_links enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.guest_sessions enable row level security;
alter table public.session_events enable row level security;
alter table public.feedback enable row level security;
alter table public.game_leaderboard enable row level security;
alter table public.promo_codes enable row level security;

drop policy if exists restaurants_public_read on public.restaurants;
create policy restaurants_public_read
  on public.restaurants
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
  on public.categories
  for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.restaurants r
      where r.id = categories.restaurant_id
        and r.is_active = true
    )
  );

drop policy if exists restaurant_links_public_read on public.restaurant_links;
create policy restaurant_links_public_read
  on public.restaurant_links
  for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1 from public.restaurants r
      where r.id = restaurant_links.restaurant_id
        and r.is_active = true
    )
  );

drop policy if exists products_public_read on public.products;
create policy products_public_read
  on public.products
  for select
  to anon, authenticated
  using (
    is_available = true
    and exists (
      select 1 from public.restaurants r
      where r.id = products.restaurant_id
        and r.is_active = true
    )
  );

drop policy if exists leaderboard_public_read on public.game_leaderboard;
create policy leaderboard_public_read
  on public.game_leaderboard
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.restaurants r
      where r.id = game_leaderboard.restaurant_id
        and r.is_active = true
    )
  );

create or replace function public.resolve_restaurant_table(
  p_restaurant_slug text,
  p_table_code text,
  out restaurant_id uuid,
  out table_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
begin
  select r.id
    into restaurant_id
    from public.restaurants r
   where r.slug = p_restaurant_slug
     and r.is_active = true
   limit 1;

  if restaurant_id is null then
    raise exception 'Restaurant not found';
  end if;

  select t.id
    into table_id
    from public.restaurant_tables t
   where t.restaurant_id = restaurant_id
     and t.code = p_table_code
     and t.is_active = true
   limit 1;
end;
$$;

create or replace function public.create_guest_session(
  p_restaurant_slug text,
  p_table_code text,
  p_language text,
  p_user_agent text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restaurant_id uuid;
  v_table_id uuid;
  v_session_id uuid;
begin
  if p_language is null or p_language not in ('tr', 'es', 'en') then
    raise exception 'Invalid language';
  end if;

  select resolved.restaurant_id, resolved.table_id
    into v_restaurant_id, v_table_id
    from public.resolve_restaurant_table(p_restaurant_slug, p_table_code) resolved;

  insert into public.guest_sessions (restaurant_id, table_id, language, user_agent)
  values (v_restaurant_id, v_table_id, p_language, left(coalesce(p_user_agent, ''), 500))
  returning id into v_session_id;

  return v_session_id;
end;
$$;

create or replace function public.track_session_event(
  p_session_id uuid,
  p_event_name text,
  p_metadata jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restaurant_id uuid;
begin
  if p_event_name is null or p_event_name !~ '^[a-z0-9_]+$' then
    raise exception 'Invalid event name';
  end if;

  select restaurant_id
    into v_restaurant_id
    from public.guest_sessions
   where id = p_session_id
   limit 1;

  if v_restaurant_id is null then
    raise exception 'Session not found';
  end if;

  insert into public.session_events (session_id, restaurant_id, event_name, metadata)
  values (p_session_id, v_restaurant_id, left(p_event_name, 80), coalesce(p_metadata, '{}'::jsonb));
end;
$$;

create or replace function public.create_feedback(
  p_restaurant_slug text,
  p_table_code text,
  p_star_rating smallint,
  p_comment text,
  p_platform text,
  p_language text,
  p_user_agent text,
  p_session_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restaurant_id uuid;
  v_table_id uuid;
  v_feedback_id uuid;
  v_platform public.feedback_platform;
begin
  if p_star_rating is null or p_star_rating < 1 or p_star_rating > 5 then
    raise exception 'Invalid star rating';
  end if;

  if p_platform is null or p_platform not in ('internal', 'google', 'whatsapp') then
    raise exception 'Invalid feedback platform';
  end if;

  if p_language is null or p_language not in ('tr', 'es', 'en') then
    raise exception 'Invalid language';
  end if;

  v_platform := p_platform::public.feedback_platform;

  select resolved.restaurant_id, resolved.table_id
    into v_restaurant_id, v_table_id
    from public.resolve_restaurant_table(p_restaurant_slug, p_table_code) resolved;

  insert into public.feedback (
    restaurant_id,
    table_id,
    session_id,
    star_rating,
    comment,
    platform,
    language,
    user_agent
  )
  values (
    v_restaurant_id,
    v_table_id,
    p_session_id,
    p_star_rating,
    left(coalesce(p_comment, ''), 1200),
    v_platform,
    p_language,
    left(coalesce(p_user_agent, ''), 500)
  )
  returning id into v_feedback_id;

  return v_feedback_id;
end;
$$;

create or replace function public.create_game_result(
  p_restaurant_slug text,
  p_table_code text,
  p_player_name text,
  p_score integer
)
returns table (
  leaderboard_id uuid,
  promo_code text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_restaurant public.restaurants%rowtype;
  v_table_id uuid;
  v_leaderboard_id uuid;
  v_code text;
begin
  if p_score is null or p_score < 0 or p_score > 100000 then
    raise exception 'Invalid score';
  end if;

  select *
    into v_restaurant
    from public.restaurants
   where slug = p_restaurant_slug
     and is_active = true
   limit 1;

  if v_restaurant.id is null then
    raise exception 'Restaurant not found';
  end if;

  if v_restaurant.is_game_enabled = false then
    raise exception 'Game disabled';
  end if;

  select id
    into v_table_id
    from public.restaurant_tables
   where restaurant_id = v_restaurant.id
     and code = p_table_code
     and is_active = true
   limit 1;

  insert into public.game_leaderboard (restaurant_id, table_id, player_name, score)
  values (
    v_restaurant.id,
    v_table_id,
    left(coalesce(nullif(trim(p_player_name), ''), 'Guest'), 40),
    p_score
  )
  returning id into v_leaderboard_id;

  if v_restaurant.promo_enabled and p_score >= v_restaurant.promo_threshold then
    v_code :=
      upper(left(replace(v_restaurant.slug, '-', ''), 3))
      || '-'
      || to_char(now(), 'MMDD')
      || '-'
      || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

    insert into public.promo_codes (restaurant_id, leaderboard_id, code, score)
    values (v_restaurant.id, v_leaderboard_id, v_code, p_score)
    returning code into v_code;
  end if;

  return query select v_leaderboard_id, v_code;
end;
$$;

revoke all on function public.resolve_restaurant_table(text, text) from public;
revoke all on function public.create_guest_session(text, text, text, text) from public;
revoke all on function public.track_session_event(uuid, text, jsonb) from public;
revoke all on function public.create_feedback(text, text, smallint, text, text, text, text, uuid) from public;
revoke all on function public.create_game_result(text, text, text, integer) from public;

grant execute on function public.create_guest_session(text, text, text, text) to anon, authenticated;
grant execute on function public.track_session_event(uuid, text, jsonb) to anon, authenticated;
grant execute on function public.create_feedback(text, text, smallint, text, text, text, text, uuid) to anon, authenticated;
grant execute on function public.create_game_result(text, text, text, integer) to anon, authenticated;
