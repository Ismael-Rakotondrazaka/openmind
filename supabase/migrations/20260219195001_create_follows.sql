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

-- Keep public.users.follower_count and following_count in sync with public.follows
create or replace function public.sync_follow_counts()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.users
    set following_count = following_count + 1
    where id = new.follower_id;
    update public.users
    set follower_count = follower_count + 1
    where id = new.following_id;
  elsif tg_op = 'DELETE' then
    update public.users
    set following_count = following_count - 1
    where id = old.follower_id;
    update public.users
    set follower_count = follower_count - 1
    where id = old.following_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger sync_follow_counts_on_insert
  after insert on public.follows
  for each row
  execute function public.sync_follow_counts();

create trigger sync_follow_counts_on_delete
  after delete on public.follows
  for each row
  execute function public.sync_follow_counts();
