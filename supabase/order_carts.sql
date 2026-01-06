create table if not exists public.order_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.order_carts enable row level security;

create policy "Order carts: read own" on public.order_carts
  for select using (auth.uid() = user_id);
create policy "Order carts: upsert own" on public.order_carts
  for insert with check (auth.uid() = user_id);
create policy "Order carts: update own" on public.order_carts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
