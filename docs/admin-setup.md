# Admin Setup

## 1. Supabase migration

Run the migrations in order:

- `202604130001_initial_schema.sql`
- `202605020002_restaurant_profile_columns.sql`
- `202605020003_restaurant_admins_and_policies.sql`

## 2. Create the auth user

In Supabase Auth, create the admin user for the restaurant owner.

## 3. Map the auth user to the restaurant

Use this SQL after the auth user exists:

```sql
insert into public.restaurant_admins (restaurant_id, user_id, role)
select r.id, 'REPLACE_WITH_AUTH_USER_ID'::uuid, 'owner'
from public.restaurants r
where r.slug = 'real-kebab-istanbul'
on conflict (restaurant_id, user_id) do update set
  role = excluded.role;
```

## 4. Frontend env

Set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 5. Admin URL

Open:

- `/admin/real-kebab-istanbul`

or

- `/real-kebab-istanbul/admin`
