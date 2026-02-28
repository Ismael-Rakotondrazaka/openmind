-- Migration: create users table
-- Purpose: Application user/profile table (auth handled by Supabase).
-- Affected: public.users
-- Notes: username, first_name, last_name nullable; role stored as text.

create table public.users (
  id uuid not null primary key references auth.users (id) on delete cascade,
  username text,
  first_name text,
  last_name text,
  image_url text,
  role text not null default 'user' check (role in ('admin', 'moderator', 'user')),
  posts_count integer not null default 0,
  follower_count integer not null default 0,
  following_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

comment on table public.users is 'Application users; auth is handled by Supabase.';
comment on column public.users.posts_count is 'Total number of non-deleted posts by this user; maintained by trigger on public.posts.';

create unique index users_username_key on public.users (username) where username is not null;
create index users_role_idx on public.users (role);
create index users_created_at_idx on public.users (created_at);
create index users_deleted_at_idx on public.users (deleted_at) where deleted_at is not null;

alter table public.users enable row level security;

create policy "Anyone can view user profiles"
  on public.users for select
  to authenticated, anon
  using (true);

create policy "Users can update their own record"
  on public.users for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

create policy "Admins can update any user"
  on public.users for update
  to authenticated
  using (
    (select role from public.users where id = (select auth.uid())) = 'admin'
  )
  with check (
    (select role from public.users where id = (select auth.uid())) = 'admin'
  );

create policy "Users can delete their own record"
  on public.users for delete
  to authenticated
  using ( (select auth.uid()) = id );

create trigger update_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

-- Only admins can upgrade a user role; users may downgrade their own role
create or replace function public.enforce_role_change_policy()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid;
  actor_role text;
  old_rank smallint;
  new_rank smallint;
begin
  if old.role is not distinct from new.role then
    return new;
  end if;

  actor_id := auth.uid();
  if actor_id is null then
    raise exception 'Only authenticated users can update profiles.';
  end if;

  if old.id = actor_id then
    old_rank := case old.role
      when 'admin' then 2
      when 'moderator' then 1
      else 0
    end;
    new_rank := case new.role
      when 'admin' then 2
      when 'moderator' then 1
      else 0
    end;
    if new_rank > old_rank then
      raise exception 'You cannot upgrade your own role. Only an admin can promote you.';
    end if;
    return new;
  end if;

  select role into actor_role from public.users where id = actor_id;
  if actor_role <> 'admin' then
    raise exception 'Only admins can change another user''s role.';
  end if;

  return new;
end;
$$;

comment on function public.enforce_role_change_policy() is 'Allows users to downgrade their own role; only admins can upgrade any user role.';

create trigger enforce_role_change_policy
  before update of role on public.users
  for each row
  execute function public.enforce_role_change_policy();

-- Create function to automatically create user record on auth.users signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  safe_username text;
  safe_first_name text;
  safe_last_name text;
begin
  safe_username := nullif(trim((new.raw_user_meta_data->>'username')::text), '');
  safe_first_name := nullif(trim((new.raw_user_meta_data->>'first_name')::text), '');
  safe_last_name := nullif(trim((new.raw_user_meta_data->>'last_name')::text), '');

  begin
    insert into public.users (
      id,
      username,
      first_name,
      last_name,
      role
    )
    values (
      new.id,
      safe_username,
      safe_first_name,
      safe_last_name,
      'user'
    );
  exception
    when unique_violation then
      insert into public.users (
        id,
        username,
        first_name,
        last_name,
        role
      )
      values (
        new.id,
        null,
        safe_first_name,
        safe_last_name,
        'user'
      );
  end;
  return new;
end;
$$;

comment on function public.handle_new_user() is 'Creates a public.users row when a new auth.users record is inserted (signup).';

-- Create trigger to auto-create user record when auth.users is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
