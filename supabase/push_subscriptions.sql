create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  endpoint text unique not null,
  p256dh text not null,
  auth text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.push_subscriptions enable row level security;

create policy "Users can view their push subscriptions" on public.push_subscriptions
  for select using (auth.uid() = user_id);

create policy "Users can insert their push subscriptions" on public.push_subscriptions
  for insert with check (auth.uid() = user_id);

create policy "Users can update their push subscriptions" on public.push_subscriptions
  for update using (auth.uid() = user_id);
