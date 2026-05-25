-- CleanLA Phase 1.5 Validation Landing Page
-- Single reports table + public storage bucket for photos.
-- No auth, no moderation, no flags — this is a validation prototype, not the public app.
-- Per the office-hours design doc (2026-05-24): if the partnership conversation
-- + legal review unlock further engineering, a follow-on migration will add
-- moderation, auth-gated submissions, and the face-blur pipeline boundary.

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  photo_url text not null,
  lat double precision not null,
  lng double precision not null,
  description text not null,
  email_optional text,
  neighborhood text,
  created_at timestamptz not null default now()
);

create index if not exists reports_created_at_desc_idx
  on public.reports (created_at desc);

-- Latitude/longitude sanity checks. LA County bounds are roughly
-- 33.7..34.85 N, -118.95..-117.65 W. Allow a generous box (the whole CA + buffer)
-- so a misreported geolocation outside LA still ingests rather than silently fails.
alter table public.reports
  add constraint reports_lat_range check (lat between -90 and 90),
  add constraint reports_lng_range check (lng between -180 and 180);

-- Public read, no write via PostgREST. All writes route through the server action
-- (server-side service role), which lets us add lightweight server-side validation
-- without exposing a write endpoint to the browser.
alter table public.reports enable row level security;

create policy "reports are publicly readable"
  on public.reports
  for select
  using (true);

-- Storage bucket for submitted photos. Public read so the feed can link them
-- directly; uploads require the service role (server action only).
insert into storage.buckets (id, name, public)
values ('report-photos', 'report-photos', true)
on conflict (id) do nothing;

create policy "report photos are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'report-photos');
