-- CleanLA Phase 5 Moderation
-- Adds: moderation_status enum, moderation columns to spot_media,
--       is_admin to profiles, updated spots_in_bounds RPC.

-- 1. New enum for moderation lifecycle
CREATE TYPE public.moderation_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Add moderation columns to spot_media
ALTER TABLE public.spot_media
  ADD COLUMN moderation_status  public.moderation_status NOT NULL DEFAULT 'pending',
  ADD COLUMN moderation_reason  text,
  ADD COLUMN moderated_by       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN moderated_at       timestamptz;

-- 3. Index for queue queries (ordered by arrival time)
CREATE INDEX spot_media_moderation_status_created_at_idx
  ON public.spot_media (moderation_status, created_at ASC);

-- 4. is_admin flag on profiles (default false; flip manually in dashboard for first admin)
ALTER TABLE public.profiles
  ADD COLUMN is_admin boolean NOT NULL DEFAULT false;

-- 5. Replace spots_in_bounds — media subqueries now require moderation_status = 'approved'.
--    Spots with no approved media surface null URLs until at least one photo clears.
DROP FUNCTION IF EXISTS public.spots_in_bounds(
  double precision, double precision, double precision, double precision, integer
);

CREATE OR REPLACE FUNCTION public.spots_in_bounds(
  west         double precision,
  south        double precision,
  east         double precision,
  north        double precision,
  result_limit integer DEFAULT 500
)
RETURNS TABLE (
  id                  uuid,
  category            public.spot_category,
  status              public.spot_status,
  description         text,
  neighborhood        text,
  severity            smallint,
  lat                 double precision,
  lng                 double precision,
  created_at          timestamptz,
  verification_status public.verification_status,
  report_media_url    text,
  after_media_url     text
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
  WITH bounds AS (
    SELECT extensions.ST_MakeEnvelope(west, south, east, north, 4326) AS geom
  )
  SELECT
    s.id,
    s.category,
    s.status,
    s.description,
    s.neighborhood,
    s.severity,
    extensions.ST_Y(s.location::extensions.geometry) AS lat,
    extensions.ST_X(s.location::extensions.geometry) AS lng,
    s.created_at,
    s.verification_status,
    (
      SELECT sm.media_url
      FROM public.spot_media sm
      WHERE sm.spot_id = s.id
        AND sm.media_kind IN ('report', 'before')
        AND sm.moderation_status = 'approved'
      ORDER BY
        CASE sm.verification_status WHEN 'verified' THEN 0 ELSE 1 END,
        sm.created_at ASC
      LIMIT 1
    ) AS report_media_url,
    (
      SELECT sm.media_url
      FROM public.spot_media sm
      WHERE sm.spot_id = s.id
        AND sm.media_kind = 'after'
        AND sm.moderation_status = 'approved'
      ORDER BY
        CASE sm.verification_status WHEN 'verified' THEN 0 ELSE 1 END,
        sm.created_at ASC
      LIMIT 1
    ) AS after_media_url
  FROM public.spots s
  CROSS JOIN bounds
  WHERE s.status <> 'hidden'
    AND extensions.ST_Intersects(s.location::extensions.geometry, bounds.geom)
  ORDER BY s.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(result_limit, 500), 1), 500);
$$;
