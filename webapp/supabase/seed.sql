insert into public.spots (
  id,
  category,
  status,
  description,
  neighborhood,
  location,
  verification_status,
  verification_reason,
  created_at,
  updated_at
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'illegal_dumping',
    'reported',
    'mattress and construction debris blocking the curb lane',
    'boyle heights',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2137, 34.0339), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'trash',
    'reported',
    'overflowing bags around bus stop and sidewalk tree well',
    'koreatown',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.3009, 34.0618), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'graffiti',
    'in_progress',
    'fresh graffiti on alley-facing wall near commercial strip',
    'historic filipinotown',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2594, 34.0656), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '36 hours',
    now() - interval '36 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'encampment_debris',
    'reported',
    'abandoned debris pile along freeway-adjacent sidewalk',
    'westlake',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2779, 34.0544), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '30 hours',
    now() - interval '30 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'biohazard',
    'reported',
    'possible hazardous waste containers left near alley entrance',
    'south los angeles',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2737, 33.9890), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '24 hours',
    now() - interval '24 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'overgrowth',
    'cleaned',
    'overgrown vegetation trimmed back from sidewalk pinch point',
    'highland park',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2000, 34.1155), 4326)::geography,
    'verified',
    'seed_data',
    now() - interval '20 hours',
    now() - interval '12 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    'illegal_dumping',
    'reported',
    'sofa and broken furniture dumped beside parking lot',
    'van nuys',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.4489, 34.1899), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '18 hours',
    now() - interval '18 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000008',
    'trash',
    'reported',
    'loose trash collecting near storm drain',
    'venice',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.4695, 33.9916), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '15 hours',
    now() - interval '15 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000009',
    'graffiti',
    'reported',
    'tagging on retaining wall visible from sidewalk',
    'east hollywood',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2915, 34.0900), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '12 hours',
    now() - interval '12 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000010',
    'trash',
    'cleaned',
    'bags removed from corner after weekend cleanup',
    'leimert park',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.3306, 34.0090), 4326)::geography,
    'verified',
    'seed_data',
    now() - interval '10 hours',
    now() - interval '6 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000011',
    'overgrowth',
    'reported',
    'plant growth narrowing sidewalk access near school route',
    'el sereno',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.1773, 34.0813), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '8 hours',
    now() - interval '8 hours'
  ),
  (
    '10000000-0000-4000-8000-000000000012',
    'encampment_debris',
    'in_progress',
    'debris remains after partial cleanup under overpass',
    'downtown',
    extensions.ST_SetSRID(extensions.ST_MakePoint(-118.2437, 34.0522), 4326)::geography,
    'unverified',
    'seed_data',
    now() - interval '6 hours',
    now() - interval '4 hours'
  )
on conflict (id) do update set
  category = excluded.category,
  status = excluded.status,
  description = excluded.description,
  neighborhood = excluded.neighborhood,
  location = excluded.location,
  verification_status = excluded.verification_status,
  verification_reason = excluded.verification_reason,
  updated_at = excluded.updated_at;

insert into public.organizations (
  id,
  name,
  contact_name,
  contact_email,
  contact_phone,
  street_address,
  website_url,
  business_category,
  description,
  status,
  created_at,
  updated_at
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'Nate''s Mexican Food Cart',
    'Nate Ramirez',
    'nate@example.com',
    '213-555-0101',
    '1200 E 1st St, Los Angeles, CA',
    'https://example.com/nates',
    'food',
    'Neighborhood food cart offering quick rewards for cleanup points.',
    'approved',
    now() - interval '2 days',
    now() - interval '2 days'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'Echo Park Bike Repair',
    'Maya Chen',
    'maya@example.com',
    '213-555-0102',
    '1500 Sunset Blvd, Los Angeles, CA',
    'https://example.com/echo-bike',
    'bike repair',
    'Local repair counter supporting cleaner neighborhood streets.',
    'approved',
    now() - interval '1 day',
    now() - interval '1 day'
  )
on conflict (id) do update set
  name = excluded.name,
  contact_name = excluded.contact_name,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  street_address = excluded.street_address,
  website_url = excluded.website_url,
  business_category = excluded.business_category,
  description = excluded.description,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.organization_rewards (
  id,
  organization_id,
  title,
  description,
  points_required,
  redemption_instructions,
  is_active,
  created_at,
  updated_at
)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'Two chicken empanadas',
    'Redeem points for two chicken empanadas at Nate''s cart.',
    500,
    'Show the claim code at the counter before ordering.',
    true,
    now() - interval '1 day',
    now() - interval '1 day'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    'Flat tire patch',
    'Redeem points for one standard bicycle tube patch.',
    350,
    'Bring the bike and show the claim code when checking in.',
    true,
    now() - interval '12 hours',
    now() - interval '12 hours'
  )
on conflict (id) do update set
  organization_id = excluded.organization_id,
  title = excluded.title,
  description = excluded.description,
  points_required = excluded.points_required,
  redemption_instructions = excluded.redemption_instructions,
  is_active = excluded.is_active,
  updated_at = excluded.updated_at;
