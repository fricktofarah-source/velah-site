-- Velah core schema (profiles + hydration events + carts)

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text default 'Dubai',
  time_zone text,
  hydration_goal_ml integer default 2000,
  pref_hydration_reminders boolean default true,
  pref_delivery_reminders boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create table if not exists public.hydration_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml integer not null,
  day date not null,
  logged_at timestamptz not null default now(),
  source text,
  client_event_id uuid not null,
  created_at timestamptz default now()
);

create unique index if not exists hydration_events_user_client_idx on public.hydration_events (user_id, client_event_id);
create index if not exists hydration_events_user_day_idx on public.hydration_events (user_id, day);

create or replace view public.hydration_daily_totals with (security_invoker = true) as
  select
    user_id,
    day,
    sum(amount_ml)::int as total_ml,
    max(logged_at) as last_logged_at
  from public.hydration_events
  group by user_id, day;

create table if not exists public.order_carts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.hydration_events enable row level security;
alter table public.order_carts enable row level security;

grant select, insert, update on public.profiles to authenticated;
grant select, insert on public.hydration_events to authenticated;
grant select on public.hydration_daily_totals to authenticated;
grant select, insert, update on public.order_carts to authenticated;

create policy "Profiles: read own" on public.profiles
  for select using (auth.uid() = user_id);
create policy "Profiles: insert own" on public.profiles
  for insert with check (auth.uid() = user_id);
create policy "Profiles: update own" on public.profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Hydration events: read own" on public.hydration_events
  for select using (auth.uid() = user_id);
create policy "Hydration events: insert own" on public.hydration_events
  for insert with check (auth.uid() = user_id);

create policy "Order carts: read own" on public.order_carts
  for select using (auth.uid() = user_id);
create policy "Order carts: upsert own" on public.order_carts
  for insert with check (auth.uid() = user_id);
create policy "Order carts: update own" on public.order_carts
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

create trigger set_order_carts_updated_at
  before update on public.order_carts
  for each row
  execute function public.set_updated_at();

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
