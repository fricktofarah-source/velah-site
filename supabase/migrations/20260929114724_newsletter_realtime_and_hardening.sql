-- Newsletter schema in version control, cart Realtime, name/waitlist backfills, and security hardening.

-- 1) newsletter: already exists on the live project (created outside migrations); recorded here so the
--    schema is reproducible. Everything below is a no-op where it already exists.
create table if not exists public.newsletter (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  zone text,
  user_agent text,
  ip text,
  created_at timestamptz default now(),
  email_lc text generated always as (lower(email)) stored,
  status text not null default 'pending' constraint newsletter_status_chk check (status in ('pending', 'confirmed')),
  confirmation_token uuid,
  confirmation_sent_at timestamptz,
  updated_at timestamptz,
  ip_hash text
);

create unique index if not exists newsletter_email_key on public.newsletter (email);
create unique index if not exists newsletter_email_lc_uidx on public.newsletter (email_lc);

-- Only the server (service role) reads/writes the newsletter, so RLS is on with no policies on purpose
alter table public.newsletter enable row level security;

create or replace trigger trg_newsletter_updated_at
  before update on public.newsletter
  for each row
  execute function public.set_updated_at();

-- 2) Realtime for carts: CartProvider subscribes to order_carts changes, but the table was never published
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'order_carts'
  ) then
    alter publication supabase_realtime add table public.order_carts;
  end if;
end $$;

-- 3) Names: the sign-up modal briefly stored first_name/last_name instead of full_name, leaving names blank.
--    Fall back to those in the new-user trigger and backfill affected users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(trim(concat_ws(' ', new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name')), '')
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

update auth.users
set raw_user_meta_data = raw_user_meta_data
  || jsonb_build_object('full_name', trim(concat_ws(' ', raw_user_meta_data->>'first_name', raw_user_meta_data->>'last_name')))
where raw_user_meta_data ? 'first_name'
  and coalesce(raw_user_meta_data->>'full_name', '') = '';

update public.profiles p
set full_name = u.raw_user_meta_data->>'full_name'
from auth.users u
where u.id = p.user_id
  and coalesce(p.full_name, '') = ''
  and coalesce(u.raw_user_meta_data->>'full_name', '') <> '';

-- 4) Waitlist is single opt-in: entries without a confirmation token were never sent a confirm link,
--    so they were stuck at "pending" forever.
update public.newsletter
set status = 'confirmed'
where status = 'pending'
  and confirmation_token is null;

-- 5) Security advisor fixes: trigger functions shouldn't be callable through the REST API (/rpc),
--    and set_updated_at needs a fixed search_path. Triggers keep firing; EXECUTE is only checked on direct calls.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
alter function public.set_updated_at() set search_path = '';

-- rls_auto_enable is Supabase's auto-enable-RLS event trigger; it only exists on projects that turned it on
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;
