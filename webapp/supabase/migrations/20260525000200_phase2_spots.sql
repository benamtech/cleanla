-- CleanLA Phase 2 Map MVP
-- Read-only public spots model, viewport-bounded PostGIS query, and migration
-- of Phase 1.5 validation reports into unverified public spots.

do $$
begin
  create type public.spot_category as enum (
    'illegal_dumping',
    'trash',
    'graffiti',
    'encampment_debris',
    'biohazard',
    'overgrowth'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.spot_status as enum (
    'reported',
    'in_progress',
    'cleaned',
    'hidden'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.media_kind as enum (
    'report',
    'before',
    'after'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.verification_status as enum (
    'pending',
    'verified',
    'unverified',
    'location_mismatch',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.spots (
  id uuid primary key default gen_random_uuid(),
  category public.spot_category not null default 'trash',
  status public.spot_status not null default 'reported',
  description text not null,
  neighborhood text,
  location geography(Point, 4326) not null,
  verification_status public.verification_status not null default 'pending',
  verification_reason text,
  created_from_report_id uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.spot_media (
  id uuid primary key default gen_random_uuid(),
  spot_id uuid not null references public.spots(id) on delete cascade,
  media_kind public.media_kind not null default 'report',
  media_url text,
  verification_status public.verification_status not null default 'pending',
  verification_reason text,
  source_report_id uuid unique,
  created_at timestamptz not null default now()
);

create index if not exists spots_location_gix
  on public.spots using gist (location);

create index if not exists spots_status_created_at_idx
  on public.spots (status, created_at desc);

create index if not exists spot_media_spot_id_idx
  on public.spot_media (spot_id);

alter table public.spots enable row level security;
alter table public.spot_media enable row level security;

drop policy if exists "visible spots are publicly readable" on public.spots;
create policy "visible spots are publicly readable"
  on public.spots
  for select
  using (status <> 'hidden');

drop policy if exists "public spot media metadata is readable" on public.spot_media;
create policy "public spot media metadata is readable"
  on public.spot_media
  for select
  using (
    exists (
      select 1
      from public.spots
      where spots.id = spot_media.spot_id
        and spots.status <> 'hidden'
    )
  );

insert into public.spots (
  id,
  category,
  status,
  description,
  neighborhood,
  location,
  verification_status,
  verification_reason,
  created_from_report_id,
  created_at,
  updated_at
)
select
  reports.id,
  'trash'::public.spot_category,
  'reported'::public.spot_status,
  reports.description,
  reports.neighborhood,
  ST_SetSRID(ST_MakePoint(reports.lng, reports.lat), 4326)::geography,
  'unverified'::public.verification_status,
  'legacy_validation_report',
  reports.id,
  reports.created_at,
  reports.created_at
from public.reports
on conflict (id) do nothing;

insert into public.spot_media (
  spot_id,
  media_kind,
  media_url,
  verification_status,
  verification_reason,
  source_report_id,
  created_at
)
select
  reports.id,
  'report'::public.media_kind,
  reports.photo_url,
  'unverified'::public.verification_status,
  'legacy_validation_report',
  reports.id,
  reports.created_at
from public.reports
where reports.photo_url is not null
on conflict (source_report_id) do nothing;

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
  lat double precision,
  lng double precision,
  created_at timestamptz,
  verification_status public.verification_status,
  media_url text
)
language sql
stable
security invoker
set search_path = public
as $$
  with bounds as (
    select ST_MakeEnvelope(west, south, east, north, 4326) as geom
  )
  select
    s.id,
    s.category,
    s.status,
    s.description,
    s.neighborhood,
    ST_Y(s.location::geometry) as lat,
    ST_X(s.location::geometry) as lng,
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
    and s.location::geometry && bounds.geom
    and ST_Intersects(s.location::geometry, bounds.geom)
  order by s.created_at desc
  limit least(greatest(coalesce(result_limit, 500), 1), 500);
$$;
