-- CleanLA Phase 7 Points + Local Rewards
-- Backend-first incentive ledger, organization rewards, and claim-code redemption.

do $$
begin
  create type public.organization_status as enum (
    'pending_review',
    'approved',
    'rejected',
    'suspended'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.organization_member_role as enum (
    'owner'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.point_ledger_entry_type as enum (
    'cleanup_award',
    'reward_reservation',
    'reward_redeemed',
    'reward_refund',
    'admin_adjustment'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.reward_redemption_status as enum (
    'pending',
    'confirmed',
    'canceled',
    'expired'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  street_address text not null,
  website_url text,
  business_category text not null,
  description text not null,
  status public.organization_status not null default 'pending_review',
  admin_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.organization_member_role not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.organization_rewards (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text not null,
  points_required integer not null,
  redemption_instructions text,
  is_active boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  reward_id uuid not null references public.organization_rewards(id) on delete restrict,
  organization_id uuid not null references public.organizations(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,
  claim_code text not null unique,
  status public.reward_redemption_status not null default 'pending',
  expires_at timestamptz not null,
  confirmed_by uuid references auth.users(id) on delete set null,
  confirmed_at timestamptz,
  canceled_by uuid references auth.users(id) on delete set null,
  canceled_at timestamptz,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.point_ledger (
  id uuid primary key default gen_random_uuid(),
  entry_type public.point_ledger_entry_type not null,
  user_id uuid references auth.users(id) on delete set null,
  organization_id uuid references public.organizations(id) on delete set null,
  points integer not null,
  spot_id uuid references public.spots(id) on delete set null,
  spot_media_id uuid references public.spot_media(id) on delete set null,
  contribution_history_id uuid references public.contribution_history(id) on delete set null,
  reward_id uuid references public.organization_rewards(id) on delete set null,
  redemption_id uuid references public.reward_redemptions(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

do $$
begin
  alter table public.organizations
    add constraint organizations_name_length_chk
    check (char_length(trim(name)) between 2 and 120);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.organization_rewards
    add constraint organization_rewards_points_min_chk
    check (points_required >= 200);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.reward_redemptions
    add constraint reward_redemptions_points_positive_chk
    check (points > 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.point_ledger
    add constraint point_ledger_nonzero_points_chk
    check (points <> 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.point_ledger
    add constraint point_ledger_subject_chk
    check (
      (user_id is not null and organization_id is null)
      or (user_id is null and organization_id is not null)
    );
exception
  when duplicate_object then null;
end $$;

create unique index if not exists point_ledger_cleanup_award_media_unique_idx
  on public.point_ledger (spot_media_id)
  where entry_type = 'cleanup_award' and spot_media_id is not null;

create unique index if not exists point_ledger_reward_reservation_unique_idx
  on public.point_ledger (redemption_id)
  where entry_type = 'reward_reservation';

create unique index if not exists point_ledger_reward_redeemed_unique_idx
  on public.point_ledger (redemption_id)
  where entry_type = 'reward_redeemed';

create unique index if not exists point_ledger_reward_refund_unique_idx
  on public.point_ledger (redemption_id)
  where entry_type = 'reward_refund';

create index if not exists point_ledger_user_created_idx
  on public.point_ledger (user_id, created_at desc);

create index if not exists point_ledger_org_created_idx
  on public.point_ledger (organization_id, created_at desc);

create index if not exists organizations_status_created_idx
  on public.organizations (status, created_at desc);

create index if not exists organization_rewards_org_active_idx
  on public.organization_rewards (organization_id, is_active, created_at desc);

create index if not exists reward_redemptions_user_created_idx
  on public.reward_redemptions (user_id, created_at desc);

create index if not exists reward_redemptions_org_status_idx
  on public.reward_redemptions (organization_id, status, created_at desc);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.point_ledger enable row level security;

create or replace function public.is_admin_user(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = p_user_id
      and p.is_admin = true
  );
$$;

create or replace function public.is_organization_owner(p_org_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members om
    where om.organization_id = p_org_id
      and om.user_id = p_user_id
      and om.role = 'owner'
  );
$$;

drop policy if exists "approved organizations are public readable" on public.organizations;
create policy "approved organizations are public readable"
  on public.organizations
  for select
  using (status = 'approved');

drop policy if exists "organization owners can read own organizations" on public.organizations;
create policy "organization owners can read own organizations"
  on public.organizations
  for select
  to authenticated
  using (public.is_organization_owner(id, (select auth.uid())));

drop policy if exists "admins can read organizations" on public.organizations;
create policy "admins can read organizations"
  on public.organizations
  for select
  to authenticated
  using (public.is_admin_user((select auth.uid())));

drop policy if exists "organization owners can update profile fields" on public.organizations;
create policy "organization owners can update profile fields"
  on public.organizations
  for update
  to authenticated
  using (public.is_organization_owner(id, (select auth.uid())))
  with check (public.is_organization_owner(id, (select auth.uid())));

drop policy if exists "organization members can read own memberships" on public.organization_members;
create policy "organization members can read own memberships"
  on public.organization_members
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_organization_owner(organization_id, (select auth.uid()))
    or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "active rewards from approved organizations are public readable" on public.organization_rewards;
create policy "active rewards from approved organizations are public readable"
  on public.organization_rewards
  for select
  using (
    is_active = true
    and exists (
      select 1
      from public.organizations o
      where o.id = organization_rewards.organization_id
        and o.status = 'approved'
    )
  );

drop policy if exists "organization owners can read rewards" on public.organization_rewards;
create policy "organization owners can read rewards"
  on public.organization_rewards
  for select
  to authenticated
  using (public.is_organization_owner(organization_id, (select auth.uid())));

drop policy if exists "organization owners can manage rewards" on public.organization_rewards;
create policy "organization owners can manage rewards"
  on public.organization_rewards
  for all
  to authenticated
  using (public.is_organization_owner(organization_id, (select auth.uid())))
  with check (public.is_organization_owner(organization_id, (select auth.uid())));

drop policy if exists "users can read own redemptions" on public.reward_redemptions;
create policy "users can read own redemptions"
  on public.reward_redemptions
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_organization_owner(organization_id, (select auth.uid()))
    or public.is_admin_user((select auth.uid()))
  );

drop policy if exists "users can read own point ledger" on public.point_ledger;
create policy "users can read own point ledger"
  on public.point_ledger
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or public.is_organization_owner(organization_id, (select auth.uid()))
    or public.is_admin_user((select auth.uid()))
  );

create or replace view public.user_point_balances
with (security_invoker = true) as
  select user_id, coalesce(sum(points), 0)::integer as balance
  from public.point_ledger
  where user_id is not null
  group by user_id;

create or replace view public.organization_point_balances
with (security_invoker = true) as
  select organization_id, coalesce(sum(points), 0)::integer as balance
  from public.point_ledger
  where organization_id is not null
  group by organization_id;

grant select on public.user_point_balances to authenticated;
grant select on public.organization_point_balances to authenticated;

create or replace function public.points_for_spot_category(p_category public.spot_category)
returns integer
language sql
immutable
set search_path = public
as $$
  select case p_category
    when 'trash' then 5
    when 'graffiti' then 10
    when 'overgrowth' then 15
    when 'encampment_debris' then 25
    when 'illegal_dumping' then 35
    when 'biohazard' then 50
    else 0
  end;
$$;

create or replace function public.get_user_point_balance(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(points), 0)::integer
  from public.point_ledger
  where user_id = p_user_id;
$$;

create or replace function public.get_organization_point_balance(p_organization_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(sum(points), 0)::integer
  from public.point_ledger
  where organization_id = p_organization_id;
$$;

create or replace function public.award_cleanup_points(
  p_user_id uuid,
  p_spot_id uuid,
  p_spot_media_id uuid,
  p_contribution_history_id uuid
)
returns table(points_awarded integer, point_balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_category public.spot_category;
  v_points integer;
begin
  select s.category into v_category
  from public.spots s
  join public.spot_media sm on sm.spot_id = s.id
  where s.id = p_spot_id
    and sm.id = p_spot_media_id
    and sm.created_by = p_user_id
    and sm.media_kind = 'after'
    and sm.verification_status = 'verified'
    and s.status = 'cleaned';

  if v_category is null then
    points_awarded := 0;
    point_balance := public.get_user_point_balance(p_user_id);
    return next;
    return;
  end if;

  v_points := public.points_for_spot_category(v_category);

  insert into public.point_ledger (
    entry_type,
    user_id,
    points,
    spot_id,
    spot_media_id,
    contribution_history_id,
    created_by,
    note
  )
  values (
    'cleanup_award',
    p_user_id,
    v_points,
    p_spot_id,
    p_spot_media_id,
    p_contribution_history_id,
    p_user_id,
    'Verified cleanup award'
  )
  on conflict do nothing;

  if found then
    points_awarded := v_points;
  else
    points_awarded := 0;
  end if;

  point_balance := public.get_user_point_balance(p_user_id);
  return next;
end;
$$;

create or replace function public.claim_reward(
  p_user_id uuid,
  p_reward_id uuid,
  p_claim_code text
)
returns table(redemption_id uuid, claim_code text, points integer, expires_at timestamptz, point_balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reward record;
  v_balance integer;
  v_redemption_id uuid;
  v_expires_at timestamptz;
begin
  select r.id, r.organization_id, r.points_required
    into v_reward
  from public.organization_rewards r
  join public.organizations o on o.id = r.organization_id
  where r.id = p_reward_id
    and r.is_active = true
    and r.points_required >= 200
    and o.status = 'approved';

  if v_reward.id is null then
    raise exception 'REWARD_NOT_AVAILABLE';
  end if;

  v_balance := public.get_user_point_balance(p_user_id);
  if v_balance < v_reward.points_required then
    raise exception 'INSUFFICIENT_POINTS';
  end if;

  v_redemption_id := gen_random_uuid();
  v_expires_at := now() + interval '7 days';

  insert into public.reward_redemptions (
    id,
    reward_id,
    organization_id,
    user_id,
    points,
    claim_code,
    expires_at
  )
  values (
    v_redemption_id,
    v_reward.id,
    v_reward.organization_id,
    p_user_id,
    v_reward.points_required,
    upper(p_claim_code),
    v_expires_at
  );

  insert into public.point_ledger (
    entry_type,
    user_id,
    points,
    reward_id,
    redemption_id,
    created_by,
    note
  )
  values (
    'reward_reservation',
    p_user_id,
    -v_reward.points_required,
    v_reward.id,
    v_redemption_id,
    p_user_id,
    'Reward claim reservation'
  );

  redemption_id := v_redemption_id;
  claim_code := upper(p_claim_code);
  points := v_reward.points_required;
  expires_at := v_expires_at;
  point_balance := public.get_user_point_balance(p_user_id);
  return next;
end;
$$;

create or replace function public.confirm_reward_redemption(
  p_actor_id uuid,
  p_organization_id uuid,
  p_claim_code text
)
returns table(redemption_id uuid, points integer, organization_balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_redemption record;
begin
  if not public.is_organization_owner(p_organization_id, p_actor_id) then
    raise exception 'FORBIDDEN';
  end if;

  select rr.*
    into v_redemption
  from public.reward_redemptions rr
  join public.organizations o on o.id = rr.organization_id
  where rr.organization_id = p_organization_id
    and rr.claim_code = upper(p_claim_code)
    and rr.status = 'pending'
    and rr.expires_at > now()
    and o.status = 'approved'
  for update;

  if v_redemption.id is null then
    raise exception 'REDEMPTION_NOT_AVAILABLE';
  end if;

  update public.reward_redemptions
  set status = 'confirmed',
      confirmed_by = p_actor_id,
      confirmed_at = now(),
      updated_at = now()
  where id = v_redemption.id;

  insert into public.point_ledger (
    entry_type,
    organization_id,
    points,
    reward_id,
    redemption_id,
    created_by,
    note
  )
  values (
    'reward_redeemed',
    v_redemption.organization_id,
    v_redemption.points,
    v_redemption.reward_id,
    v_redemption.id,
    p_actor_id,
    'Reward redemption confirmed'
  )
  on conflict do nothing;

  redemption_id := v_redemption.id;
  points := v_redemption.points;
  organization_balance := public.get_organization_point_balance(p_organization_id);
  return next;
end;
$$;

create or replace function public.cancel_reward_redemption(
  p_actor_id uuid,
  p_redemption_id uuid,
  p_reason text default 'canceled'
)
returns table(redemption_id uuid, points_refunded integer, point_balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_redemption record;
begin
  select rr.*
    into v_redemption
  from public.reward_redemptions rr
  where rr.id = p_redemption_id
    and rr.status = 'pending'
  for update;

  if v_redemption.id is null then
    raise exception 'REDEMPTION_NOT_PENDING';
  end if;

  if p_actor_id <> v_redemption.user_id
     and not public.is_organization_owner(v_redemption.organization_id, p_actor_id)
     and not public.is_admin_user(p_actor_id) then
    raise exception 'FORBIDDEN';
  end if;

  update public.reward_redemptions
  set status = case when expires_at <= now() then 'expired'::public.reward_redemption_status else 'canceled'::public.reward_redemption_status end,
      canceled_by = p_actor_id,
      canceled_at = now(),
      cancel_reason = p_reason,
      updated_at = now()
  where id = v_redemption.id;

  insert into public.point_ledger (
    entry_type,
    user_id,
    points,
    reward_id,
    redemption_id,
    created_by,
    note
  )
  values (
    'reward_refund',
    v_redemption.user_id,
    v_redemption.points,
    v_redemption.reward_id,
    v_redemption.id,
    p_actor_id,
    p_reason
  )
  on conflict do nothing;

  redemption_id := v_redemption.id;
  points_refunded := v_redemption.points;
  point_balance := public.get_user_point_balance(v_redemption.user_id);
  return next;
end;
$$;

create or replace function public.expire_reward_redemptions()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row record;
  v_count integer := 0;
begin
  for v_row in
    select id, user_id
    from public.reward_redemptions
    where status = 'pending'
      and expires_at <= now()
  loop
    perform * from public.cancel_reward_redemption(v_row.user_id, v_row.id, 'expired');
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;
