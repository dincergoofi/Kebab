create table if not exists public.restaurant_admins (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'manager', 'editor')),
  created_at timestamptz not null default now(),
  unique (restaurant_id, user_id)
);

alter table public.restaurant_admins enable row level security;

create or replace function public.is_restaurant_admin(p_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.restaurant_admins admin_map
    where admin_map.restaurant_id = p_restaurant_id
      and admin_map.user_id = auth.uid()
  );
$$;

grant execute on function public.is_restaurant_admin(uuid) to authenticated;

drop policy if exists restaurant_admins_self_select on public.restaurant_admins;
create policy restaurant_admins_self_select
  on public.restaurant_admins
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists restaurants_admin_select on public.restaurants;
create policy restaurants_admin_select
  on public.restaurants
  for select
  to authenticated
  using (public.is_restaurant_admin(id));

drop policy if exists restaurants_admin_update on public.restaurants;
create policy restaurants_admin_update
  on public.restaurants
  for update
  to authenticated
  using (public.is_restaurant_admin(id))
  with check (public.is_restaurant_admin(id));

drop policy if exists categories_admin_select on public.categories;
create policy categories_admin_select
  on public.categories
  for select
  to authenticated
  using (public.is_restaurant_admin(restaurant_id));

drop policy if exists categories_admin_insert on public.categories;
create policy categories_admin_insert
  on public.categories
  for insert
  to authenticated
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists categories_admin_update on public.categories;
create policy categories_admin_update
  on public.categories
  for update
  to authenticated
  using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists products_admin_select on public.products;
create policy products_admin_select
  on public.products
  for select
  to authenticated
  using (public.is_restaurant_admin(restaurant_id));

drop policy if exists products_admin_insert on public.products;
create policy products_admin_insert
  on public.products
  for insert
  to authenticated
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists products_admin_update on public.products;
create policy products_admin_update
  on public.products
  for update
  to authenticated
  using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists restaurant_links_admin_select on public.restaurant_links;
create policy restaurant_links_admin_select
  on public.restaurant_links
  for select
  to authenticated
  using (public.is_restaurant_admin(restaurant_id));

drop policy if exists restaurant_links_admin_insert on public.restaurant_links;
create policy restaurant_links_admin_insert
  on public.restaurant_links
  for insert
  to authenticated
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists restaurant_links_admin_update on public.restaurant_links;
create policy restaurant_links_admin_update
  on public.restaurant_links
  for update
  to authenticated
  using (public.is_restaurant_admin(restaurant_id))
  with check (public.is_restaurant_admin(restaurant_id));

drop policy if exists feedback_admin_select on public.feedback;
create policy feedback_admin_select
  on public.feedback
  for select
  to authenticated
  using (public.is_restaurant_admin(restaurant_id));

drop policy if exists leaderboard_admin_select on public.game_leaderboard;
create policy leaderboard_admin_select
  on public.game_leaderboard
  for select
  to authenticated
  using (public.is_restaurant_admin(restaurant_id));
