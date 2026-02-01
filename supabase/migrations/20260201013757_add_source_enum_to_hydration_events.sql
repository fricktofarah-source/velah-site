-- supabase/migrations/20260201013452_add_source_enum_to_hydration_events.sql
create type public.hydration_source as enum ('manual', 'bottle', 'hydration_page');

alter table public.hydration_events
add column source_enum public.hydration_source;

update public.hydration_events
set source_enum = case
  when source = 'migration' then 'manual'
  else source::public.hydration_source
end;

alter table public.hydration_events
drop column source;

alter table public.hydration_events
rename column source_enum to source;
