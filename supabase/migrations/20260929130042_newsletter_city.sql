-- City each waitlist signup is in, to measure demand outside Dubai (e.g. Abu Dhabi).
-- Filled from the waitlist form's city picker; older rows stay null (unknown).
alter table public.newsletter add column if not exists city text;

alter table public.newsletter drop constraint if exists newsletter_city_length_chk;
alter table public.newsletter
  add constraint newsletter_city_length_chk check (city is null or char_length(city) between 1 and 60);
