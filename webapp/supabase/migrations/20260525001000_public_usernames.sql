-- Public usernames + attribution
--
-- The product spec needs a public identity to surface "REPORTED BY @username"
-- and "CLEANED BY @username" on the map detail modal. Today profiles has
-- only (id, email, is_admin) and is owner-only-readable via RLS, which means:
--   - no public-readable identity exists at all
--   - cross-user attribution is impossible without leaking email PII
--
-- This migration adds a public username column on profiles, exposes only
-- (id, username) through a view, and extends spots_in_bounds to surface
-- the reporter + cleaner usernames in the map data.
--
-- Compatibility notes:
--   - username is OPTIONAL. Users who never set one show as "ANONYMOUS" in
--     attribution displays. No back-fill needed.
--   - The RPC's existing columns are preserved; the two new columns are
--     additive, so the Phase 5 callers continue to work unchanged.
--   - spot_media.created_by is the cleaner identity when media_kind='after'.
--     The same column is the reporter identity on spots.created_by.

-- ── 1. username column on profiles ────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text;

-- Case-insensitive uniqueness so "alex" and "Alex" can't both register.
-- Partial index because NULL usernames are allowed (and many).
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_unique_idx
  ON public.profiles (lower(username))
  WHERE username IS NOT NULL;

-- Length + character class sanity. Mirrors common social usernames:
-- 3-24 chars, alphanumeric + underscore + hyphen.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_format_chk
  CHECK (
    username IS NULL OR (
      char_length(username) BETWEEN 3 AND 24
      AND username ~ '^[A-Za-z0-9_-]+$'
    )
  );

-- ── 2. public view exposing only (id, username) ───────────────────────────
-- Profiles itself remains owner-only-readable (no email leak). The view is
-- the public surface — anyone (including unauthenticated) can read it.
CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT id, username
  FROM public.profiles
  WHERE username IS NOT NULL;

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ── 3. spots_in_bounds — add reporter_username + cleaner_username ─────────
-- Drop the Phase 5 signature first because we're widening the return shape.
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
  after_media_url     text,
  reporter_username   text,
  cleaner_username    text
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
    ) AS after_media_url,
    -- Reporter = profiles.username for the user who created the spot row.
    (
      SELECT pp.username
      FROM public.public_profiles pp
      WHERE pp.id = s.created_by
    ) AS reporter_username,
    -- Cleaner = profiles.username for the user who uploaded the approved
    -- AFTER media. Same selection rule as after_media_url so they match.
    (
      SELECT pp.username
      FROM public.spot_media sm
      JOIN public.public_profiles pp ON pp.id = sm.created_by
      WHERE sm.spot_id = s.id
        AND sm.media_kind = 'after'
        AND sm.moderation_status = 'approved'
      ORDER BY
        CASE sm.verification_status WHEN 'verified' THEN 0 ELSE 1 END,
        sm.created_at ASC
      LIMIT 1
    ) AS cleaner_username
  FROM public.spots s
  CROSS JOIN bounds
  WHERE s.status <> 'hidden'
    AND extensions.ST_Intersects(s.location::extensions.geometry, bounds.geom)
  ORDER BY s.created_at DESC
  LIMIT LEAST(GREATEST(COALESCE(result_limit, 500), 1), 500);
$$;
