-- CleanLA Phase 7 grants hardening
-- Keep Phase 7 tables/RPCs exposed only where the client actually needs direct Data API access.

revoke all on table public.organizations from anon, authenticated;
revoke all on table public.organization_members from anon, authenticated;
revoke all on table public.organization_rewards from anon, authenticated;
revoke all on table public.reward_redemptions from anon, authenticated;
revoke all on table public.point_ledger from anon, authenticated;
revoke all on table public.user_point_balances from anon, authenticated;
revoke all on table public.organization_point_balances from anon, authenticated;

grant select on table public.organizations to anon, authenticated;
grant select on table public.organization_rewards to anon, authenticated;
grant select on table public.organization_members to authenticated;
grant select on table public.reward_redemptions to authenticated;
grant select on table public.point_ledger to authenticated;
grant select on table public.user_point_balances to authenticated;
grant select on table public.organization_point_balances to authenticated;

revoke execute on function public.award_cleanup_points(uuid, uuid, uuid, uuid) from public, anon, authenticated;
revoke execute on function public.claim_reward(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function public.confirm_reward_redemption(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function public.cancel_reward_redemption(uuid, uuid, text) from public, anon, authenticated;
revoke execute on function public.expire_reward_redemptions() from public, anon, authenticated;
revoke execute on function public.get_user_point_balance(uuid) from public, anon, authenticated;
revoke execute on function public.get_organization_point_balance(uuid) from public, anon, authenticated;

grant execute on function public.award_cleanup_points(uuid, uuid, uuid, uuid) to service_role;
grant execute on function public.claim_reward(uuid, uuid, text) to service_role;
grant execute on function public.confirm_reward_redemption(uuid, uuid, text) to service_role;
grant execute on function public.cancel_reward_redemption(uuid, uuid, text) to service_role;
grant execute on function public.expire_reward_redemptions() to service_role;
grant execute on function public.get_user_point_balance(uuid) to service_role;
grant execute on function public.get_organization_point_balance(uuid) to service_role;

revoke execute on function public.is_admin_user(uuid) from public, anon;
revoke execute on function public.is_organization_owner(uuid, uuid) from public, anon;
grant execute on function public.is_admin_user(uuid) to authenticated, service_role;
grant execute on function public.is_organization_owner(uuid, uuid) to authenticated, service_role;

grant execute on function public.points_for_spot_category(public.spot_category) to anon, authenticated, service_role;
