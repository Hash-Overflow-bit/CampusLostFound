-- Resolve campus/profile data on the server. Browser metadata is treated as a request,
-- never as trusted authorization data. Role remains the database default (`member`).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_campus text := nullif(new.raw_user_meta_data ->> 'campus', '');
  requested_university text := nullif(new.raw_user_meta_data ->> 'university', '');
  resolved_campus uuid;
begin
  -- Prefer an exact campus id when the client supplied a UUID. Invalid values are ignored.
  if requested_campus is not null and requested_campus ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then
    select id into resolved_campus from public.campuses where id = requested_campus::uuid and active = true limit 1;
  end if;

  -- Legacy/local university ids are not trusted as DB ids. Email-domain reconciliation can
  -- assign campus later through a privileged onboarding function once seed mapping exists.
  insert into public.profiles (id, campus_id, display_name)
  values (
    new.id,
    resolved_campus,
    nullif(coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'name'), '')
  )
  on conflict (id) do update
    set display_name = coalesce(excluded.display_name, public.profiles.display_name),
        campus_id = coalesce(public.profiles.campus_id, excluded.campus_id),
        updated_at = now();

  return new;
end;
$$;

-- Recreate to ensure the latest function is attached after migration ordering.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
