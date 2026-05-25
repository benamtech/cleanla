-- CleanLA Phase 3.5 Verification
-- Adds a composite index for verification status queries and the
-- compute_media_distance_m helper used by the server-side verification path.
-- All spot_media capture columns were added in Phase 3 (20260525000300).

CREATE INDEX IF NOT EXISTS spot_media_verification_status_created_at_idx
  ON public.spot_media (verification_status, created_at);

-- Returns the distance in metres between a captured GPS point and a spot's
-- stored geography. Called by the server-side verifyMedia function in
-- webapp/src/lib/verification/verify-media.ts via admin.rpc().
-- Returns NULL if p_spot_id does not match any row.
CREATE OR REPLACE FUNCTION public.compute_media_distance_m(
  p_spot_id uuid,
  p_lat double precision,
  p_lng double precision
)
RETURNS double precision
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions
AS $$
  SELECT extensions.ST_Distance(
    s.location,
    extensions.ST_SetSRID(extensions.ST_MakePoint(p_lng, p_lat), 4326)::geography
  )
  FROM public.spots s
  WHERE s.id = p_spot_id;
$$;
