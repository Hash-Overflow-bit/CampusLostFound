-- CampusLostFound V2 core schema
create extension if not exists pgcrypto;

create type public.item_kind as enum ('lost','found');
create type public.item_status as enum ('open','possible_match','claim_pending','recovered','closed');
create type public.claim_status as enum ('pending','accepted','rejected','withdrawn');

create table public.campuses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  email_domain text unique,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  campus_id uuid references public.campuses(id),
  display_name text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  campus_id uuid not null references public.campuses(id),
  kind public.item_kind not null,
  status public.item_status not null default 'open',
  title text not null check (char_length(title) between 2 and 120),
  category text not null,
  brand text,
  color text,
  description text,
  public_location text,
  occurred_at timestamptz,
  recovered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sensitive evidence never belongs in the public item row.
create table public.item_private_details (
  item_id uuid primary key references public.items(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  exact_location text,
  identifying_details text,
  contact_email text,
  contact_phone text,
  created_at timestamptz not null default now()
);

create table public.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  position smallint not null default 0 check (position >= 0 and position <= 9),
  created_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  lost_item_id uuid not null references public.items(id) on delete cascade,
  found_item_id uuid not null references public.items(id) on delete cascade,
  score numeric(5,2) not null check (score between 0 and 100),
  algorithm_version text not null,
  created_at timestamptz not null default now(),
  unique (lost_item_id, found_item_id),
  check (lost_item_id <> found_item_id)
);

create table public.claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id) on delete cascade,
  status public.claim_status not null default 'pending',
  evidence text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (item_id, claimant_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  claim_id uuid references public.claims(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.activity_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index items_campus_status_created_idx on public.items (campus_id, status, created_at desc);
create index items_campus_kind_status_created_idx on public.items (campus_id, kind, status, created_at desc);
create index items_owner_created_idx on public.items (owner_id, created_at desc);
create index items_category_occurred_idx on public.items (category, occurred_at desc);
create index matches_lost_score_idx on public.matches (lost_item_id, score desc);
create index matches_found_score_idx on public.matches (found_item_id, score desc);
create index claims_item_status_idx on public.claims (item_id, status, created_at desc);
create index claims_claimant_idx on public.claims (claimant_id, created_at desc);
create index conversation_members_user_idx on public.conversation_members (user_id, conversation_id);
create index messages_conversation_created_idx on public.messages (conversation_id, created_at desc);
create index notifications_user_unread_idx on public.notifications (user_id, created_at desc) where read_at is null;
