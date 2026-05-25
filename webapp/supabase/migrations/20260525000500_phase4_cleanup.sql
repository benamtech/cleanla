-- CleanLA Phase 4 Cleanup Flow
-- Adds: reopened enum value, contribution_history table, updated spots_in_bounds RPC,
--       and get_profile_contributions RPC.

-- 1. Extend spot_status enum — must be the first statement so subsequent DDL can reference it.
ALTER TYPE public.spot_status ADD VALUE IF NOT EXISTS 'reopened';

-- 2. Audit log of status transitions and accepted cleanup contributions.
CREATE TABLE IF NOT EXISTS public.contribution_history (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id       uuid        NOT NULL REFERENCES public.spots(id) ON DELETE CASCADE,
  actor_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  action        text        NOT NULL,
  from_status   public.spot_status,
  to_status     public.spot_status,
  spot_media_id uuid        REFERENCES public.spot_media(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contribution_history_actor_id_idx
  ON public.contribution_history (actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS contribution_history_spot_id_idx
  ON public.contribution_history (spot_id, created_at DESC);

ALTER TABLE public.contribution_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own contributions"
  ON public.contribution_history
  FOR SELECT
  TO authenticated
  USING (actor_id = (SELECT auth.uid()));

-- 3. Replace spots_in_bounds — must DROP first because the return column list changes.
--    New columns: report_media_url (renamed from media_url, prefers verified report/before media)
--                 after_media_url  (first verified after photo, or null)
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

-- 4. Profile contribution counts — derived from server-confirmed data only.
--    SECURITY INVOKER so RLS on contribution_history limits rows to the calling user's own.
CREATE OR REPLACE FUNCTION public.get_profile_contributions(p_user_id uuid)
RETURNS TABLE (
  submitted_reports  bigint,
  verified_reports   bigint,
  cleanups_completed bigint
)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    (
      SELECT COUNT(*)
      FROM public.spots
      WHERE created_by = p_user_id
    )::bigint AS submitted_reports,
    (
      SELECT COUNT(*)
      FROM public.spots
      WHERE created_by = p_user_id
        AND verification_status = 'verified'
    )::bigint AS verified_reports,
    (
      SELECT COUNT(*)
      FROM public.contribution_history
      WHERE actor_id  = p_user_id
        AND action    = 'cleanup_submitted'
        AND to_status = 'cleaned'
    )::bigint AS cleanups_completed;
$$;
