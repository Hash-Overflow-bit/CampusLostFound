-- M04 auth/role hardening.
-- Roles are database-owned authorization state. Clients may read their own role but cannot
-- create/elevate roles or change verification/campus authorization fields through generic updates.

create type public.app_role as enum ('student', 'moderator', 'admin');

alter table public.profiles
  add column role public.app_role not null default 'student';

-- Replace the broad self-update policy from 002_rls.sql. RLS alone cannot distinguish changed
-- columns, so column privileges below restrict browser clients to explicitly editable fields.
drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Supabase's authenticated role must not be able to mutate authorization-bearing columns.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

-- Keep self-profile reads available to authenticated users.
grant select on public.profiles to authenticated;

-- Privileged role/campus/verification changes must use service-role/server operations or a future
-- SECURITY DEFINER admin RPC with explicit authorization and audit logging.
comment on column public.profiles.role is 'Trusted authorization role; never writable by browser clients.';
comment on column public.profiles.campus_id is 'Trusted campus assignment; changed only by trusted onboarding/admin operations.';
comment on column public.profiles.verified_at is 'Trusted verification state; never writable by browser clients.';
