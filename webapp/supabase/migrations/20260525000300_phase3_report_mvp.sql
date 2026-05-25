-- CleanLA Phase 3 Report MVP
-- Auth-gated report ownership and capture metadata. Final media verification
-- decisions remain deferred to Phase 3.5.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles are owner readable" on public.profiles;
create policy "profiles are owner readable"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles are owner insertable" on public.profiles;
create policy "profiles are owner insertable"
  on public.profiles
  for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "profiles are owner updatable" on public.profiles;
create policy "profiles are owner updatable"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

alter table public.spots
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists severity smallint;

do $$
begin
  alter table public.spots
    add constraint spots_severity_range check (severity is null or severity between 1 and 5);
exception
  when duplicate_object then null;
end $$;

alter table public.spot_media
  add column if not exists created_by uuid references auth.users(id) on delete set null,
  add column if not exists capture_source text not null default 'legacy',
  add column if not exists captured_lat double precision,
  add column if not exists captured_lng double precision,
  add column if not exists gps_accuracy_m double precision,
  add column if not exists client_captured_at timestamptz,
  add column if not exists server_received_at timestamptz not null default now(),
  add column if not exists distance_from_spot_m double precision,
  add column if not exists device_context jsonb not null default '{}'::jsonb;

do $$
begin
  alter table public.spot_media
    add constraint spot_media_capture_source_valid
    check (capture_source in ('live_camera', 'legacy'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.spot_media
    add constraint spot_media_captured_lat_range
    check (captured_lat is null or captured_lat between -90 and 90);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.spot_media
    add constraint spot_media_captured_lng_range
    check (captured_lng is null or captured_lng between -180 and 180);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.spot_media
    add constraint spot_media_gps_accuracy_nonnegative
    check (gps_accuracy_m is null or gps_accuracy_m >= 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.spot_media
    add constraint spot_media_distance_nonnegative
    check (distance_from_spot_m is null or distance_from_spot_m >= 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.spot_media
    add constraint spot_media_device_context_object
    check (jsonb_typeof(device_context) = 'object');
exception
  when duplicate_object then null;
end $$;

create index if not exists spots_created_by_idx
  on public.spots (created_by, created_at desc);

create index if not exists spot_media_created_by_idx
  on public.spot_media (created_by, created_at desc);

drop policy if exists "authenticated users can insert owned pending spots" on public.spots;
create policy "authenticated users can insert owned pending spots"
  on public.spots
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and status = 'reported'
    and verification_status = 'pending'
  );

drop policy if exists "spot owners can update pending spot basics" on public.spots;
create policy "spot owners can update pending spot basics"
  on public.spots
  for update
  to authenticated
  using (
    created_by = (select auth.uid())
    and verification_status = 'pending'
  )
  with check (
    created_by = (select auth.uid())
    and status = 'reported'
    and verification_status = 'pending'
  );

drop policy if exists "authenticated users can insert owned pending spot media" on public.spot_media;
create policy "authenticated users can insert owned pending spot media"
  on public.spot_media
  for insert
  to authenticated
  with check (
    created_by = (select auth.uid())
    and verification_status = 'pending'
    and verification_reason = 'awaiting_phase_3_5_verification'
    and capture_source = 'live_camera'
    and exists (
      select 1
      from public.spots
      where spots.id = spot_media.spot_id
        and spots.created_by = (select auth.uid())
    )
  );

drop policy if exists "authenticated users can upload own report photos" on storage.objects;
create policy "authenticated users can upload own report photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'report-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create or replace function public.create_phase3_report_spot(
  p_category public.spot_category,
  p_description text,
  p_lat double precision,
  p_lng double precision,
  p_created_by uuid,
  p_severity smallint
)
returns uuid
language plpgsql
security invoker
set search_path = public, extensions
as $$
declare
  new_spot_id uuid;
begin
  insert into public.spots (
    category,
    status,
    description,
    location,
    verification_status,
    verification_reason,
    created_by,
    severity
  )
  values (
    p_category,
    'reported',
    p_description,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::geography,
    'pending',
    'awaiting_phase_3_5_verification',
    p_created_by,
    p_severity
  )
  returning id into new_spot_id;

  return new_spot_id;
end;
$$;

drop function if exists public.spots_in_bounds(
  double precision,
  double precision,
  double precision,
  double precision,
  integer
);

create or replace function public.spots_in_bounds(
  west double precision,
  south double precision,
  east double precision,
  north double precision,
  result_limit integer default 500
)
returns table (
  id uuid,
  category public.spot_category,
  status public.spot_status,
  description text,
  neighborhood text,
  severity smallint,
  lat double precision,
  lng double precision,
  created_at timestamptz,
  verification_status public.verification_status,
  media_url text
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  with bounds as (
    select extensions.ST_MakeEnvelope(west, south, east, north, 4326) as geom
  )
  select
    s.id,
    s.category,
    s.status,
    s.description,
    s.neighborhood,
    s.severity,
    extensions.ST_Y(s.location::extensions.geometry) as lat,
    extensions.ST_X(s.location::extensions.geometry) as lng,
    s.created_at,
    s.verification_status,
    (
      select sm.media_url
      from public.spot_media sm
      where sm.spot_id = s.id
      order by sm.created_at asc
      limit 1
    ) as media_url
  from public.spots s
  cross join bounds
  where s.status <> 'hidden'
    and extensions.ST_Intersects(s.location::extensions.geometry, bounds.geom)
  order by s.created_at desc
  limit least(greatest(coalesce(result_limit, 500), 1), 500);
$$;
