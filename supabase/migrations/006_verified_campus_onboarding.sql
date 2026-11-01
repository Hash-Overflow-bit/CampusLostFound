-- M04 trusted campus onboarding.
-- Campus membership is derived from the authenticated, confirmed email address and the
-- database campus domain mapping. The browser cannot choose campus authorization state.

alter table public.campuses
  add column if not exists active boolean not null default true;

create or replace function public.onboard_my_campus()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_user auth.users%rowtype;
  caller_domain text;
  resolved_campus public.campuses%rowtype;
  result public.profiles%rowtype;
begin
  if auth.uid() is null then
    raise exception 'authentication_required' using errcode = 'P0001';
  end if;

  select * into current_user
  from auth.users
  where id = auth.uid();

  if current_user.id is null then
    raise exception 'authentication_required' using errcode = 'P0001';
  end if;

  if current_user.email_confirmed_at is null then
    raise exception 'email_confirmation_required' using errcode = 'P0001';
  end if;

  if current_user.email is null or position('@' in current_user.email) = 0 then
    raise exception 'valid_email_required' using errcode = 'P0001';
  end if;

  caller_domain := lower(split_part(current_user.email, '@', 2));

  select c.* into resolved_campus
  from public.campuses c
  where c.active = true
    and lower(c.email_domain) = caller_domain
  limit 1;

  if resolved_campus.id is null then
    raise exception 'unsupported_university_domain' using errcode = 'P0001';
  end if;

  update public.profiles
  set campus_id = resolved_campus.id,
      verified_at = coalesce(verified_at, current_user.email_confirmed_at, now()),
      updated_at = now()
  where id = auth.uid()
  returning * into result;

  if result.id is null then
    raise exception 'profile_not_found' using errcode = 'P0001';
  end if;

  return result;
end;
$$;

revoke all on function public.onboard_my_campus() from public;
grant execute on function public.onboard_my_campus() to authenticated;

comment on function public.onboard_my_campus() is
  'Assigns the caller to an active campus only when their confirmed auth email domain matches campuses.email_domain.';
