-- CampusLostFound V2 RLS. Frontend route guards are not authorization.
alter table public.campuses enable row level security;
alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.item_private_details enable row level security;
alter table public.item_images enable row level security;
alter table public.matches enable row level security;
alter table public.claims enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;

create policy campuses_read on public.campuses for select using (true);

create policy profiles_read_self on public.profiles for select using (id = auth.uid());
create policy profiles_update_self on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy items_read_public on public.items for select
using (status in ('open','possible_match','claim_pending','recovered'));
create policy items_insert_owner on public.items for insert
with check (owner_id = auth.uid());
create policy items_update_owner on public.items for update
using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy items_delete_owner on public.items for delete using (owner_id = auth.uid());

create policy private_details_owner_all on public.item_private_details for all
using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy item_images_read on public.item_images for select
using (exists (select 1 from public.items i where i.id = item_id and i.status <> 'closed'));
create policy item_images_owner_insert on public.item_images for insert
with check (owner_id = auth.uid() and exists (select 1 from public.items i where i.id = item_id and i.owner_id = auth.uid()));
create policy item_images_owner_update on public.item_images for update
using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy item_images_owner_delete on public.item_images for delete using (owner_id = auth.uid());

create policy matches_participants_read on public.matches for select
using (
  exists (select 1 from public.items i where i.id = lost_item_id and i.owner_id = auth.uid()) or
  exists (select 1 from public.items i where i.id = found_item_id and i.owner_id = auth.uid())
);
-- Match creation is intentionally server/service-role only.

create policy claims_read_participants on public.claims for select
using (
  claimant_id = auth.uid() or
  exists (select 1 from public.items i where i.id = item_id and i.owner_id = auth.uid())
);
create policy claims_insert_claimant on public.claims for insert
with check (
  claimant_id = auth.uid() and
  exists (select 1 from public.items i where i.id = item_id and i.owner_id <> auth.uid() and i.status in ('open','possible_match'))
);
create policy claims_update_claimant on public.claims for update
using (claimant_id = auth.uid()) with check (claimant_id = auth.uid());
-- Accept/reject transitions will be a trusted RPC/Edge operation, not a broad client update policy.

create policy conversations_member_read on public.conversations for select
using (exists (select 1 from public.conversation_members cm where cm.conversation_id = id and cm.user_id = auth.uid()));

create policy conversation_members_member_read on public.conversation_members for select
using (exists (select 1 from public.conversation_members mine where mine.conversation_id = conversation_id and mine.user_id = auth.uid()));
-- Conversation/member creation is server controlled after an accepted claim.

create policy messages_member_read on public.messages for select
using (exists (select 1 from public.conversation_members cm where cm.conversation_id = conversation_id and cm.user_id = auth.uid()));
create policy messages_member_insert on public.messages for insert
with check (
  sender_id = auth.uid() and
  exists (select 1 from public.conversation_members cm where cm.conversation_id = conversation_id and cm.user_id = auth.uid())
);

create policy notifications_self_read on public.notifications for select using (user_id = auth.uid());
create policy notifications_self_update on public.notifications for update
using (user_id = auth.uid()) with check (user_id = auth.uid());
-- Notification creation and activity logs are server/service-role only.
