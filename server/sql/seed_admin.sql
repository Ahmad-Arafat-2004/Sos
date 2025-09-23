-- Ensure an auth user with the given email exists first (create from Auth > Add user)
-- Then run this to upsert into profile table and set role to 'admin'

-- Admin email
with target as (
  select id, email from auth.users where lower(email) = lower('admin@irthbiladi.com') limit 1
)
insert into public.users (id, email, name, role)
select t.id, t.email, coalesce((t.email)::text, 'Administrator') as name, 'admin'
from target t
on conflict (id) do update set role = excluded.role, name = excluded.name, email = excluded.email, updated_at = now();
