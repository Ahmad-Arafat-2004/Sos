-- Public read for categories/products
create policy if not exists "read categories" on public.categories
for select using (true);

create policy if not exists "read products" on public.products
for select using (true);

-- Users: owner can read/update own profile
create policy if not exists "read own profile" on public.users
for select using (auth.uid() = id);

create policy if not exists "update own profile" on public.users
for update using (auth.uid() = id);

-- Orders: owner CRUD
create policy if not exists "insert own orders" on public.orders
for insert with check (auth.uid() = user_id);

create policy if not exists "read own orders" on public.orders
for select using (auth.uid() = user_id);

create policy if not exists "update own orders" on public.orders
for update using (auth.uid() = user_id);

-- Order items: tied to user's orders
create policy if not exists "insert own order items" on public.order_items
for insert with check (exists (
  select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
));

create policy if not exists "read own order items" on public.order_items
for select using (exists (
  select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
));

-- Admin/service-role elevated permissions
-- Allow service role (server) to manage data regardless of RLS
create policy if not exists "service role manage users (insert)" on public.users
for insert with check (auth.jwt() ->> 'role' = 'service_role');

create policy if not exists "service role manage users (update)" on public.users
for update using (auth.jwt() ->> 'role' = 'service_role');

create policy if not exists "service role read users" on public.users
for select using (auth.jwt() ->> 'role' = 'service_role');

create policy if not exists "service role manage categories" on public.categories
for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');

create policy if not exists "service role manage products" on public.products
for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');

create policy if not exists "service role manage orders" on public.orders
for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');

create policy if not exists "service role manage order_items" on public.order_items
for all using (auth.jwt() ->> 'role' = 'service_role') with check (auth.jwt() ->> 'role' = 'service_role');
