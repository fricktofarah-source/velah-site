-- supabase/migrations/20260201013511_create_order_items_table.sql
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.order_carts(user_id) on delete cascade,
  product_id text not null,
  quantity integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists order_items_cart_id_idx on public.order_items (cart_id);

alter table public.order_items enable row level security;

grant select, insert, update, delete on public.order_items to authenticated;

create policy "Order items: read own" on public.order_items
  for select using (auth.uid() = (select user_id from public.order_carts where user_id = cart_id));

create policy "Order items: insert own" on public.order_items
  for insert with check (auth.uid() = (select user_id from public.order_carts where user_id = cart_id));

create policy "Order items: update own" on public.order_items
  for update using (auth.uid() = (select user_id from public.order_carts where user_id = cart_id)) with check (auth.uid() = (select user_id from public.order_carts where user_id = cart_id));

create policy "Order items: delete own" on public.order_items
  for delete using (auth.uid() = (select user_id from public.order_carts where user_id = cart_id));

create trigger set_order_items_updated_at
  before update on public.order_items
  for each row
  execute function public.set_updated_at();
