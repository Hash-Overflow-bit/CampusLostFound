-- M04 campus isolation hardening.
-- Route guards are UX only. These policies make the trusted profile campus the database boundary.

create or replace function public.current_campus_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.campus_id
  from public.profiles p
  where p.id = auth.uid()
    and p.verified_at is not null
  limit 1
$$;

revoke all on function public.current_campus_id() from public;
grant execute on function public.current_campus_id() to authenticated;

-- Public item rows are campus-scoped for authenticated campus users. Owners retain access to
-- their own row during transitional states. Anonymous cross-campus discovery is intentionally removed.
drop policy if exists items_read_public on public.items;
create policy items_read_campus on public.items for select
to authenticated
using (
  owner_id = auth.uid()
  or (
    campus_id = public.current_campus_id()
    and status in ('open','possible_match','claim_pending','recovered')
  )
);

drop policy if exists items_insert_owner on public.items;
create policy items_insert_owner_campus on public.items for insert
to authenticated
with check (
  owner_id = auth.uid()
  and campus_id = public.current_campus_id()
  and public.current_campus_id() is not null
);

drop policy if exists items_update_owner on public.items;
create policy items_update_owner_campus on public.items for update
to authenticated
using (owner_id = auth.uid())
with check (
  owner_id = auth.uid()
  and campus_id = public.current_campus_id()
  and public.current_campus_id() is not null
);

-- Images may only be read when the parent item is visible inside the caller's campus.
drop policy if exists item_images_read on public.item_images;
create policy item_images_read_campus on public.item_images for select
to authenticated
using (
  exists (
    select 1 from public.items i
    where i.id = item_id
      and i.campus_id = public.current_campus_id()
      and i.status <> 'closed'
  )
  or owner_id = auth.uid()
);

-- Matches are useful only when both candidate items belong to the caller's trusted campus.
drop policy if exists matches_participants_read on public.matches;
create policy matches_participants_read_campus on public.matches for select
to authenticated
using (
  exists (
    select 1
    from public.items lost
    join public.items found on found.id = found_item_id
    where lost.id = lost_item_id
      and lost.campus_id = public.current_campus_id()
      and found.campus_id = public.current_campus_id()
      and (lost.owner_id = auth.uid() or found.owner_id = auth.uid())
  )
);

-- Claims cannot cross campus boundaries. The claimant's campus is derived from their trusted profile.
drop policy if exists claims_read_participants on public.claims;
create policy claims_read_participants_campus on public.claims for select
to authenticated
using (
  exists (
    select 1 from public.items i
    where i.id = item_id
      and i.campus_id = public.current_campus_id()
      and (claimant_id = auth.uid() or i.owner_id = auth.uid())
  )
);

drop policy if exists claims_insert_claimant on public.claims;
create policy claims_insert_claimant_campus on public.claims for insert
to authenticated
with check (
  claimant_id = auth.uid()
  and public.current_campus_id() is not null
  and exists (
    select 1 from public.items i
    where i.id = item_id
      and i.campus_id = public.current_campus_id()
      and i.owner_id <> auth.uid()
      and i.status in ('open','possible_match')
  )
);

-- A participant can read a conversation/message only when the conversation's item belongs to
-- their campus. Membership alone is not enough to bypass campus isolation.
drop policy if exists conversations_member_read on public.conversations;
create policy conversations_member_read_campus on public.conversations for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_members cm
    join public.items i on i.id = item_id
    where cm.conversation_id = id
      and cm.user_id = auth.uid()
      and i.campus_id = public.current_campus_id()
  )
);

drop policy if exists messages_member_read on public.messages;
create policy messages_member_read_campus on public.messages for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_members cm
    join public.conversations c on c.id = conversation_id
    join public.items i on i.id = c.item_id
    where cm.conversation_id = conversation_id
      and cm.user_id = auth.uid()
      and i.campus_id = public.current_campus_id()
  )
);

drop policy if exists messages_member_insert on public.messages;
create policy messages_member_insert_campus on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.conversation_members cm
    join public.conversations c on c.id = conversation_id
    join public.items i on i.id = c.item_id
    where cm.conversation_id = conversation_id
      and cm.user_id = auth.uid()
      and i.campus_id = public.current_campus_id()
  )
);

comment on function public.current_campus_id() is
  'Returns the authenticated user trusted verified campus for RLS decisions; never accepts browser campus input.';
