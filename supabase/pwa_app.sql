-- Velah PWA app tables + policies

create table if not exists public.hydration_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  goal_ml integer default 2000,
  time_zone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.hydration_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml integer not null,
  logged_at timestamptz not null default now(),
  day date not null default current_date,
  source text,
  created_at timestamptz default now()
);

create index if not exists hydration_entries_user_day_idx on public.hydration_entries (user_id, day);

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text default 'Dubai',
  pref_hydration_reminders boolean default true,
  pref_delivery_reminders boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.hydration_profiles enable row level security;
alter table public.hydration_entries enable row level security;
alter table public.user_profiles enable row level security;

create policy "Profiles: read own" on public.hydration_profiles
  for select using (auth.uid() = user_id);
create policy "Profiles: upsert own" on public.hydration_profiles
  for insert with check (auth.uid() = user_id);
create policy "Profiles: update own" on public.hydration_profiles
  for update using (auth.uid() = user_id);

create policy "Entries: read own" on public.hydration_entries
  for select using (auth.uid() = user_id);
create policy "Entries: insert own" on public.hydration_entries
  for insert with check (auth.uid() = user_id);
create policy "Entries: update own" on public.hydration_entries
  for update using (auth.uid() = user_id);
create policy "Entries: delete own" on public.hydration_entries
  for delete using (auth.uid() = user_id);

create policy "User profiles: read own" on public.user_profiles
  for select using (auth.uid() = user_id);
create policy "User profiles: upsert own" on public.user_profiles
  for insert with check (auth.uid() = user_id);
create policy "User profiles: update own" on public.user_profiles
  for update using (auth.uid() = user_id);
