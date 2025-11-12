alter table public.hydration_profiles
  add column if not exists time_zone text;

