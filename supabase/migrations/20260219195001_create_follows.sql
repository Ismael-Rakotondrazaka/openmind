-- Migration: create follows table
-- Purpose: User follow relationships (follower -> following).
-- Affected: public.follows

create table public.follows (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  follower_id uuid not null references public.users (id) on delete cascade,
  following_id uuid not null references public.users (id) on delete cascade,
  constraint follows_no_self check (follower_id != following_id)
);

comment on table public.follows is 'User follow graph: follower_id follows following_id.';

create unique index follows_follower_following_key on public.follows (follower_id, following_id);
create index follows_follower_id_idx on public.follows (follower_id);
create index follows_following_id_idx on public.follows (following_id);

alter table public.follows enable row level security;

create policy "Anyone can view follow relationships"
  on public.follows for select
  to authenticated, anon
  using (true);

create policy "Users can follow others as themselves"
  on public.follows for insert
  to authenticated
  with check ( (select auth.uid()) = follower_id );

create policy "Users can update their own follow rows"
  on public.follows for update
  to authenticated
  using ( (select auth.uid()) = follower_id )
  with check ( (select auth.uid()) = follower_id );

create policy "Users can unfollow (delete their own follow)"
  on public.follows for delete
  to authenticated
  using ( (select auth.uid()) = follower_id );
