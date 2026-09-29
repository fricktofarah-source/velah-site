-- Where each waitlist/newsletter signup came from: 'website', 'signup', or a link's ?from= value (e.g. 'whatsapp').
-- Rows created before this column existed stay null (source unknown).
alter table public.newsletter add column if not exists source text;

alter table public.newsletter drop constraint if exists newsletter_source_format_chk;
alter table public.newsletter
  add constraint newsletter_source_format_chk check (source is null or source ~ '^[a-z0-9_-]{1,32}$');
